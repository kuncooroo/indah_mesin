export interface MainCategory {
  id: string;
  name: string;
  icon: string;
}

export const mainCategories: MainCategory[] = [
  { id: "cnc", name: "Mesin CNC", icon: "precision_manufacturing" },
  { id: "packaging", name: "Packaging & Labeling", icon: "inventory_2" },
  { id: "pertanian", name: "Mesin Pertanian", icon: "agriculture" },
  { id: "food", name: "Food Processing", icon: "restaurant" },
  { id: "wood", name: "Woodworking", icon: "carpenter" },
  { id: "power", name: "Power Generators", icon: "bolt" },
];

export const filterCategories = [
  { id: "cnc", name: "Mesin CNC", icon: "precision_manufacturing" },
  { id: "packaging", name: "Packaging", icon: "package_2" },
  { id: "pertanian", name: "Pertanian", icon: "agriculture" },
  { id: "food", name: "Food Processing", icon: "soup_kitchen" },
  { id: "logistik", name: "Logistik", icon: "factory" },
];

export const quickFilters = [
  "Ready Stock",
  "New Arrival",
  "Best Price",
  "Heavy Duty",
];
