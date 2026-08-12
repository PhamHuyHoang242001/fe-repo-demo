// DiffView — git-style line diff from {base, incoming} using jsdiff.
// base===null → "first version" preview. Huge-diff guard: MAX_HUNKS/MAX_BYTES.
// Visual: full-frame rounded-2xl panel, ah-* tokens, fade-in on mount.

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { diffLines, diffWordsWithSpace } from 'diff';
import type { Change } from 'diff';
import { fadeInUp } from '../../../theme/motion';

const MAX_BYTES = 200_000;
const MAX_HUNKS = 2_000;

interface DiffViewProps { base: string | null; incoming: string }

// ---- Word-level inline highlight ----------------------------------------------
function WordSpan({ text, added, removed }: { text: string; added?: boolean; removed?: boolean }) {
  if (added) return <mark className="rounded bg-ah-green-l text-ah-green-d">{text}</mark>;
  if (removed) return <mark className="rounded bg-ah-red-l text-ah-red line-through">{text}</mark>;
  return <>{text}</>;
}
function renderWordDiff(a: string, b: string) {
  return diffWordsWithSpace(a, b).map((c, i) => <WordSpan key={i} text={c.value} added={c.added} removed={c.removed} />);
}

// ---- Single diff hunk --------------------------------------------------------
const HunkRow: React.FC<{ change: Change; lineNo: { old: number; new: number }; nextValue?: string }> = ({ change, lineNo, nextValue }) => {
  const lines = change.value.replace(/\n$/, '').split('\n');
  if (change.added) return (
    <>{lines.map((line, i) => (
      <tr key={i} className="bg-ah-green-l">
        <td className="select-none px-3 py-0 text-right text-[11px] text-ah-muted w-10">{lineNo.new + i}</td>
        <td className="select-none px-2 py-0 text-[11px] font-bold text-ah-green w-4">+</td>
        <td className="px-2 py-0 text-[13px] font-mono text-ah-green-d whitespace-pre-wrap break-all">
          {nextValue !== undefined ? renderWordDiff('', line) : line}
        </td>
      </tr>
    ))}</>
  );
  if (change.removed) return (
    <>{lines.map((line, i) => (
      <tr key={i} className="bg-ah-red-l">
        <td className="select-none px-3 py-0 text-right text-[11px] text-ah-muted w-10">{lineNo.old + i}</td>
        <td className="select-none px-2 py-0 text-[11px] font-bold text-ah-red w-4">-</td>
        <td className="px-2 py-0 text-[13px] font-mono text-ah-red whitespace-pre-wrap break-all">
          {nextValue !== undefined ? renderWordDiff(line, nextValue) : line}
        </td>
      </tr>
    ))}</>
  );
  // Unchanged — up to 3 context lines, collapse large blocks.
  const CONTEXT = 3;
  const rows: Array<{ offset: number; line: string } | null> =
    lines.length > CONTEXT * 2 + 1
      ? [...lines.slice(0, CONTEXT).map((l, i) => ({ offset: i, line: l })), null, ...lines.slice(-CONTEXT).map((l, i) => ({ offset: lines.length - CONTEXT + i, line: l }))]
      : lines.map((l, i) => ({ offset: i, line: l }));
  return (
    <>{rows.map((row, i) => row === null
      ? <tr key="ellipsis" className="bg-ah-pale"><td colSpan={3} className="select-none px-3 py-0.5 text-center text-[11px] text-ah-muted">···</td></tr>
      : <tr key={i} className="hover:bg-ah-pale/40 transition-colors">
          <td className="select-none px-3 py-0 text-right text-[11px] text-ah-muted w-10">{lineNo.new + row.offset}</td>
          <td className="select-none px-2 py-0 text-[11px] text-ah-muted w-4" />
          <td className="px-2 py-0 text-[13px] font-mono text-ah-ink whitespace-pre-wrap break-all">{row.line}</td>
        </tr>
    )}</>
  );
};

// ---- Preview mode (first version) --------------------------------------------
const PreviewMode: React.FC<{ incoming: string; truncated: boolean }> = ({ incoming, truncated }) => (
  <motion.div variants={fadeInUp} initial="hidden" animate="show">
    <div className="mb-2.5 flex items-center gap-2 rounded-xl border border-ah-green bg-ah-green-l px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-ah-green" />
      <span className="text-[12px] font-semibold text-ah-green">Phiên bản đầu tiên — xem trước nội dung prompt.md</span>
    </div>
    {truncated && (
      <div className="mb-2.5 flex items-center gap-2 rounded-xl border border-ah-amber bg-ah-amber-l px-3 py-2 text-[12px] text-ah-amber">
        <span className="h-2 w-2 rounded-full bg-ah-amber" />
        Nội dung quá lớn — chỉ hiển thị 200KB đầu tiên.
      </div>
    )}
    <pre className="overflow-x-auto rounded-2xl border border-ah-line bg-ah-pale p-4 text-[13px] font-mono text-ah-ink whitespace-pre-wrap break-all shadow-ah-float">
      {incoming.slice(0, MAX_BYTES)}
    </pre>
  </motion.div>
);

// ---- Main component ----------------------------------------------------------
const DiffView: React.FC<DiffViewProps> = ({ base, incoming }) => {
  const oversized = (base?.length ?? 0) > MAX_BYTES || incoming.length > MAX_BYTES;
  const { changes, tooManyHunks } = useMemo(() => {
    if (base === null) return { changes: [] as Change[], tooManyHunks: false };
    const safeBase = oversized ? base.slice(0, MAX_BYTES) : base;
    const safeIncoming = oversized ? incoming.slice(0, MAX_BYTES) : incoming;
    const ch = diffLines(safeBase, safeIncoming);
    return { changes: ch, tooManyHunks: ch.length > MAX_HUNKS };
  }, [base, incoming, oversized]);

  if (base === null) return <PreviewMode incoming={incoming} truncated={incoming.length > MAX_BYTES} />;

  const displayChanges = tooManyHunks ? changes.slice(0, MAX_HUNKS) : changes;
  let oldLine = 1; let newLine = 1;

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="show">
      {(oversized || tooManyHunks) && (
        <div className="mb-2.5 flex items-center gap-2 rounded-xl border border-ah-amber bg-ah-amber-l px-3 py-2 text-[12px] text-ah-amber">
          <span className="h-2 w-2 rounded-full bg-ah-amber" />
          File quá lớn — diff bị cắt bớt để tránh treo trình duyệt. Chỉ hiển thị phần đầu.
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-ah-line shadow-ah-float">
        <table className="w-full border-collapse text-left">
          <tbody>
            {displayChanges.map((change, idx) => {
              const lineNos = { old: oldLine, new: newLine };
              const lineCount = change.value.replace(/\n$/, '').split('\n').length;
              if (!change.added) oldLine += lineCount;
              if (!change.removed) newLine += lineCount;
              const nextChange = displayChanges[idx + 1];
              const nextVal = change.removed && nextChange?.added ? nextChange.value.replace(/\n$/, '') : undefined;
              return <HunkRow key={idx} change={change} lineNo={lineNos} nextValue={nextVal} />;
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DiffView;
