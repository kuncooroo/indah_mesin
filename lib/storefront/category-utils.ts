export type StorefrontCategory = {
  id: string;
  name: string;
  icon: string;
  parentId?: string | null;
  children?: StorefrontCategory[];
};

/** Flat list untuk filter produk (termasuk semua slug dalam subtree). */
export function flattenCategoryTree(nodes: StorefrontCategory[]): StorefrontCategory[] {
  const out: StorefrontCategory[] = [];
  function walk(list: StorefrontCategory[]) {
    for (const n of list) {
      out.push(n);
      if (n.children?.length) walk(n.children);
    }
  }
  walk(nodes);
  return out;
}

export function collectCategorySlugs(node: StorefrontCategory): string[] {
  const slugs = [node.id];
  if (node.children?.length) {
    for (const child of node.children) {
      slugs.push(...collectCategorySlugs(child));
    }
  }
  return slugs;
}
