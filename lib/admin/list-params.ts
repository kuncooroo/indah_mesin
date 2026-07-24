export const ADMIN_PAGE_SIZE = 10;

export type AdminListParams = {
  q: string;
  page: number;
  pageSize: number;
  skip: number;
};

export function parseAdminListParams(
  searchParams: Record<string, string | string[] | undefined> | undefined
): AdminListParams {
  const rawQ = searchParams?.q;
  const q = (typeof rawQ === "string" ? rawQ : "").trim();
  const rawPage = searchParams?.page;
  const pageNum = parseInt(typeof rawPage === "string" ? rawPage : "1", 10);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
  const pageSize = ADMIN_PAGE_SIZE;
  const skip = (page - 1) * pageSize;
  return { q, page, pageSize, skip };
}

export function adminTotalPages(total: number, pageSize: number = ADMIN_PAGE_SIZE) {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function rowNumber(index: number, params: AdminListParams) {
  return params.skip + index + 1;
}
