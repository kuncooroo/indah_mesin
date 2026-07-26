export interface MainCategory {
  id: string;
  name: string;
  icon: string;
}

import { MARKETPLACE_CATEGORIES, MARKETPLACE_QUICK_FILTERS } from "@/lib/marketplace-catalog";

export const mainCategories: MainCategory[] = [...MARKETPLACE_CATEGORIES];
export const filterCategories: MainCategory[] = [...MARKETPLACE_CATEGORIES];
export const quickFilters = MARKETPLACE_QUICK_FILTERS.map((f) => f.label);
