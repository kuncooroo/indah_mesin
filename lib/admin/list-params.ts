export const ADMIN_PAGE_SIZE = 10;
export const ADMIN_PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export type AdminListParams = {
  q: string;
  page: number;
  pageSize: number;
  skip: number;
  sort: string;
};

export function parseAdminListParams(
  searchParams: Record<string, string | string[] | undefined> | undefined
): AdminListParams {
  const rawQ = searchParams?.q;
  const q = (typeof rawQ === "string" ? rawQ : "").trim();
  const rawPage = searchParams?.page;
  const pageNum = parseInt(typeof rawPage === "string" ? rawPage : "1", 10);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  const rawSize = searchParams?.pageSize;
  const sizeNum = parseInt(typeof rawSize === "string" ? rawSize : String(ADMIN_PAGE_SIZE), 10);
  const pageSize = (ADMIN_PAGE_SIZE_OPTIONS as readonly number[]).includes(sizeNum)
    ? sizeNum
    : ADMIN_PAGE_SIZE;

  const rawSort = searchParams?.sort;
  const sort = typeof rawSort === "string" && rawSort ? rawSort : "newest";

  const skip = (page - 1) * pageSize;
  return { q, page, pageSize, skip, sort };
}

export function adminTotalPages(total: number, pageSize: number = ADMIN_PAGE_SIZE) {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function rowNumber(index: number, params: AdminListParams) {
  return params.skip + index + 1;
}

export function adminProductOrderBy(sort: string) {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" as const };
    case "name-asc":
      return { name: "asc" as const };
    case "name-desc":
      return { name: "desc" as const };
    case "price-asc":
      return { price: "asc" as const };
    case "price-desc":
      return { price: "desc" as const };
    case "newest":
    default:
      return { createdAt: "desc" as const };
  }
}
