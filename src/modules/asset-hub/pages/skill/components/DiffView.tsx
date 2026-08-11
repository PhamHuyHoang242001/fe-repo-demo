// DiffView — render git-style line diff from {base, incoming} using jsdiff.
// If base===null: render incoming as a "first version" preview (no diff).
// Huge-diff guard: cap at MAX_HUNKS=2000 hunks or MAX_BYTES=200_000 chars (either side);
//   shows a truncated view + warning banner instead of rendering the full diff.
// Tailwind-only; no hardcoded hex — uses ah-* tokens.

import React, { useMemo } from 'react';
import { diffLines, diffWordsWithSpace } from 'diff';
import type { Change } from 'diff';

const MAX_BYTES = 200_000; // chars in either base or incoming
const MAX_HUNKS = 2_000;   // diff Change objects

// ---- Types --------------------------------------------------------------------

interface DiffViewProps {
  base: string | null;
  incoming: string;
}

// ---- Word-level inline highlight (inside changed lines) -----------------------

function WordSpan({ text, added, removed }: { text: string; added?: boolean; removed?: boolean }) {
  if (added) return <mark className="rounded bg-ah-green-l text-ah-green-d">{text}</mark>;
  if (removed) return <mark className="rounded bg-ah-red-l text-ah-red line-through">{text}</mark>;
  return <>{text}</>;
}

function renderWordDiff(oldLine: string, newLine: string): React.ReactNode {
  const changes = diffWordsWithSpace(oldLine, newLine);
  return changes.map((c, i) => (
    <WordSpan key={i} text={c.value} added={c.added} removed={c.removed} />
  ));
}

// ---- Single diff hunk row -----------------------------------------------------

interface HunkRowProps {
  change: Change;
  lineNo: { old: number; new: number };
  nextValue?: string; // companion added line for word-level diff (paired with removed)
}

const HunkRow: React.FC<HunkRowProps> = ({ change, lineNo, nextValue }) => {
  const lines = change.value.replace(/\n$/, '').split('\n');

  if (change.added) {
    return (
      <>
        {lines.map((line, i) => (
          <tr key={i} className="bg-ah-green-l">
            <td className="select-none px-3 py-0 text-right text-[11px] text-ah-muted w-10">
              {lineNo.new + i}
            </td>
            <td className="select-none px-2 py-0 text-[11px] text-ah-green w-4">+</td>
            <td className="px-2 py-0 text-[13px] font-mono text-ah-green-d whitespace-pre-wrap break-all">
              {nextValue !== undefined ? renderWordDiff('', line) : line}
            </td>
          </tr>
        ))}
      </>
    );
  }

  if (change.removed) {
    return (
      <>
        {lines.map((line, i) => (
          <tr key={i} className="bg-ah-red-l">
            <td className="select-none px-3 py-0 text-right text-[11px] text-ah-muted w-10">
              {lineNo.old + i}
            </td>
            <td className="select-none px-2 py-0 text-[11px] text-ah-red w-4">-</td>
            <td className="px-2 py-0 text-[13px] font-mono text-ah-red whitespace-pre-wrap break-all">
              {nextValue !== undefined ? renderWordDiff(line, nextValue) : line}
            </td>
          </tr>
        ))}
      </>
    );
  }

  // unchanged — show up to 3 context lines; collapse large unchanged blocks.
  // Carry each line's true offset so duplicate lines (blanks, repeated markers)
  // get correct gutter numbers — indexOf would collapse them to the first match.
  const CONTEXT = 3;
  const rows: Array<{ offset: number; line: string } | null> =
    lines.length > CONTEXT * 2 + 1
      ? [
          ...lines.slice(0, CONTEXT).map((line, i) => ({ offset: i, line })),
          null,
          ...lines.slice(-CONTEXT).map((line, i) => ({ offset: lines.length - CONTEXT + i, line })),
        ]
      : lines.map((line, i) => ({ offset: i, line }));

  return (
    <>
      {rows.map((row, i) =>
        row === null ? (
          <tr key="ellipsis" className="bg-ah-pale">
            <td colSpan={3} className="select-none px-3 py-0.5 text-center text-[11px] text-ah-muted">
              ···
            </td>
          </tr>
        ) : (
          <tr key={i}>
            <td className="select-none px-3 py-0 text-right text-[11px] text-ah-muted w-10">
              {lineNo.new + row.offset}
            </td>
            <td className="select-none px-2 py-0 text-[11px] text-ah-muted w-4" />
            <td className="px-2 py-0 text-[13px] font-mono text-ah-ink whitespace-pre-wrap break-all">
              {row.line}
            </td>
          </tr>
        )
      )}
    </>
  );
};

// ---- Preview mode (first version, no diff) ------------------------------------

const PreviewMode: React.FC<{ incoming: string; truncated: boolean }> = ({ incoming, truncated }) => (
  <div>
    <div className="mb-2 flex items-center gap-2 rounded-lg border border-ah-green bg-ah-green-l px-3 py-1.5">
      <span className="text-[12px] font-semibold text-ah-green">Phiên bản đầu tiên — xem trước nội dung skill.md</span>
    </div>
    {truncated && (
      <div className="mb-2 rounded-lg border border-ah-amber bg-ah-amber-l px-3 py-1.5 text-[12px] text-ah-amber">
        Nội dung quá lớn — chỉ hiển thị 200KB đầu tiên.
      </div>
    )}
    <pre className="overflow-x-auto rounded-lg border border-ah-line bg-ah-pale p-4 text-[13px] font-mono text-ah-ink whitespace-pre-wrap break-all">
      {incoming.slice(0, MAX_BYTES)}
    </pre>
  </div>
);

// ---- Main component -----------------------------------------------------------

const DiffView: React.FC<DiffViewProps> = ({ base, incoming }) => {
  // Huge-file guard: check size (base may be null for a first-version preview).
  const oversized = (base?.length ?? 0) > MAX_BYTES || incoming.length > MAX_BYTES;

  // Compute diff (memoised — can be expensive for large texts).
  // Hook runs unconditionally (before any early return) to satisfy rules-of-hooks;
  // returns empty for the preview case where there is no base to diff against.
  const { changes, tooManyHunks } = useMemo(() => {
    if (base === null) return { changes: [] as Change[], tooManyHunks: false };
    const safeBase = oversized ? base.slice(0, MAX_BYTES) : base;
    const safeIncoming = oversized ? incoming.slice(0, MAX_BYTES) : incoming;
    const ch = diffLines(safeBase, safeIncoming);
    return { changes: ch, tooManyHunks: ch.length > MAX_HUNKS };
  }, [base, incoming, oversized]);

  // First-version preview (no base) — safe to return now that hooks have run.
  if (base === null) {
    const truncated = incoming.length > MAX_BYTES;
    return <PreviewMode incoming={incoming} truncated={truncated} />;
  }

  const displayChanges = tooManyHunks ? changes.slice(0, MAX_HUNKS) : changes;

  // Walk changes to compute running line numbers
  let oldLine = 1;
  let newLine = 1;

  return (
    <div>
      {(oversized || tooManyHunks) && (
        <div className="mb-2 rounded-lg border border-ah-amber bg-ah-amber-l px-3 py-1.5 text-[12px] text-ah-amber">
          File quá lớn — diff bị cắt bớt để tránh treo trình duyệt. Chỉ hiển thị phần đầu.
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-ah-line">
        <table className="w-full border-collapse text-left">
          <tbody>
            {displayChanges.map((change, idx) => {
              const lineNos = { old: oldLine, new: newLine };
              const lineCount = change.value.replace(/\n$/, '').split('\n').length;
              if (!change.added) oldLine += lineCount;
              if (!change.removed) newLine += lineCount;

              // Pair removed + next added for word-level diff
              const nextChange = displayChanges[idx + 1];
              const nextVal =
                change.removed && nextChange?.added
                  ? nextChange.value.replace(/\n$/, '')
                  : undefined;

              return (
                <HunkRow
                  key={idx}
                  change={change}
                  lineNo={lineNos}
                  nextValue={nextVal}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiffView;
