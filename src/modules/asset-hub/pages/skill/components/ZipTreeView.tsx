// Expand/collapse tree of a skill ZIP. Titles are plain strings (no HTML) so filenames cannot XSS.
import React, { useMemo } from 'react';
import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { ZipTreeNode } from '../types';
import { formatBytes } from '../utils/format';

interface ZipTreeViewProps {
  nodes: ZipTreeNode[];
}

interface Branch {
  name: string;
  path: string;
  isDir: boolean;
  size: number | null;
  children: Map<string, Branch>;
}

function insert(root: Map<string, Branch>, node: ZipTreeNode): void {
  const segs = node.path.split('/').filter(Boolean);
  let cursor = root;
  let acc = '';
  segs.forEach((seg, i) => {
    acc = acc ? `${acc}/${seg}` : seg;
    const isLeaf = i === segs.length - 1;
    if (!cursor.has(seg)) {
      cursor.set(seg, {
        name: seg,
        path: acc,
        isDir: isLeaf ? node.isDir : true,
        size: isLeaf ? node.size : null,
        children: new Map(),
      });
    } else if (isLeaf) {
      const existing = cursor.get(seg)!;
      existing.isDir = node.isDir;
      existing.size = node.size;
    }
    cursor = cursor.get(seg)!.children;
  });
}

function toDataNodes(map: Map<string, Branch>): DataNode[] {
  const list = Array.from(map.values()).sort((a, b) => {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
    return a.name.localeCompare(b.name, 'vi');
  });
  return list.map((b) => {
    const kids = b.isDir ? toDataNodes(b.children) : undefined;
    const extra = b.isDir
      ? ` · ${kids?.length ?? 0}`
      : b.size != null
        ? ` · ${formatBytes(b.size)}`
        : '';
    return {
      key: b.path,
      title: `${b.name}${extra}`,
      isLeaf: !b.isDir,
      children: kids,
    };
  });
}

const ZipTreeView: React.FC<ZipTreeViewProps> = ({ nodes }) => {
  const { treeData, defaultExpandedKeys } = useMemo(() => {
    const root = new Map<string, Branch>();
    nodes.forEach((n) => insert(root, n));
    const treeData = toDataNodes(root);
    const defaultExpandedKeys = nodes
      .filter((n) => n.isDir && n.path.split('/').length <= 2)
      .map((n) => n.path);
    return { treeData, defaultExpandedKeys };
  }, [nodes]);

  return (
    <div className="rounded-xl border border-ah-line bg-ah-pale/60 px-3 py-2">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-ah-muted">Cấu trúc ZIP</p>
      <Tree
        treeData={treeData}
        defaultExpandedKeys={defaultExpandedKeys}
        selectable={false}
        showLine
        className="bg-transparent text-sm text-ah-ink"
      />
    </div>
  );
};

export default ZipTreeView;
