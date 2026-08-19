/**
 * 文件树数据模型
 */

export interface FileNode {
  /** 唯一 ID（通常是文件路径） */
  id: string;
  /** 显示名称 */
  name: string;
  /** 完整路径 */
  path: string;
  /** 是否为目录 */
  isDirectory: boolean;
  /** 子节点（仅目录有） */
  children?: FileNode[];
  /** 文件大小（字节，仅文件） */
  size?: number;
  /** 最后修改时间 */
  modifiedAt?: number;
  /** Git 状态 */
  gitStatus?: GitStatus;
}

export type GitStatus =
  | "modified"
  | "added"
  | "deleted"
  | "renamed"
  | "untracked";

/** 展开后的扁平化行 — 用于虚拟滚动渲染 */
export interface FlatNode {
  /** 原始节点 */
  node: FileNode;
  /** 缩进层级（0 = 根） */
  depth: number;
  /** 是否展开（仅目录有意义） */
  expanded: boolean;
  /** 是否有子节点 */
  hasChildren: boolean;
  /** 父节点路径 */
  parentPath: string;
  /** 在扁平列表中的索引 */
  index: number;
}

/**
 * 将树结构扁平化为虚拟滚动所需的线性列表
 * 只展开 expandedIds 中包含的目录
 */
export function flattenTree(
  root: FileNode,
  expandedIds: Set<string>,
): FlatNode[] {
  const result: FlatNode[] = [];
  let index = 0;

  function walk(node: FileNode, depth: number, parentPath: string) {
    const hasChildren =
      node.isDirectory && (node.children?.length ?? 0) > 0;
    const expanded = expandedIds.has(node.id);

    result.push({
      node,
      depth,
      expanded,
      hasChildren,
      parentPath,
      index: index++,
    });

    if (hasChildren && expanded) {
      for (const child of node.children!) {
        walk(child, depth + 1, node.path);
      }
    }
  }

  walk(root, 0, "");
  return result;
}

/** 递归过滤树节点（按关键词搜索） */
export function filterTree(node: FileNode, query: string): FileNode | null {
  if (!query) return node;
  const lowerQuery = query.toLowerCase();

  if (!node.isDirectory) {
    // 文件：匹配名称
    return node.name.toLowerCase().includes(lowerQuery) ? node : null;
  }

  // 目录：匹配自身名称或任意子节点
  const nameMatch = node.name.toLowerCase().includes(lowerQuery);
  const filteredChildren: FileNode[] = [];

  if (node.children) {
    for (const child of node.children) {
      const filtered = filterTree(child, query);
      if (filtered) filteredChildren.push(filtered);
    }
  }

  if (nameMatch || filteredChildren.length > 0) {
    return {
      ...node,
      children: filteredChildren.length > 0 ? filteredChildren : node.children,
    };
  }

  return null;
}

/** 收集所有目录 ID（用于全部展开） */
export function collectDirectoryIds(node: FileNode): string[] {
  const ids: string[] = [];
  function walk(n: FileNode) {
    if (n.isDirectory && n.children && n.children.length > 0) {
      ids.push(n.id);
      for (const child of n.children) walk(child);
    }
  }
  walk(node);
  return ids;
}

/** 按路径或 ID 查找节点（深度优先） */
export function findNodeByPath(root: FileNode, path: string): FileNode | null {
  if (root.path === path || root.id === path) return root;
  for (const child of root.children ?? []) {
    const found = findNodeByPath(child, path);
    if (found) return found;
  }
  return null;
}

/** 收集目标节点的所有祖先目录 ID（用于自动展开） */
export function getAncestorIds(root: FileNode, targetId: string): string[] {
  const result: string[] = [];
  let found = false;

  function walk(node: FileNode): void {
    if (found) return;
    for (const child of node.children ?? []) {
      if (child.id === targetId) {
        result.push(node.id);
        found = true;
        return;
      }
      if (child.isDirectory) {
        walk(child);
        if (found) {
          result.push(node.id);
          return;
        }
      }
    }
  }

  walk(root);
  return result;
}

/** 获取节点的相对路径显示名（去除公共前缀） */
export function getDisplayName(node: FileNode, rootPath?: string): string {
  if (!rootPath) return node.name;
  const relativePath = node.path.startsWith(rootPath)
    ? node.path.slice(rootPath.length).replace(/^[/]+/, "")
    : node.path;
  return relativePath || node.name;
}
