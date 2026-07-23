import type { LucideIcon } from "lucide-react";
import {
  Bolt,
  Factory,
  Package,
  Cpu,
  Sprout,
  UtensilsCrossed,
  Hammer,
  Soup,
  Truck,
} from "lucide-react";

export interface MainCategory {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const mainCategories: MainCategory[] = [
  { id: "cnc", name: "Mesin CNC", icon: Cpu },
  { id: "packaging", name: "Packaging & Labeling", icon: Package },
  { id: "pertanian", name: "Mesin Pertanian", icon: Sprout },
  { id: "food", name: "Food Processing", icon: UtensilsCrossed },
  { id: "wood", name: "Woodworking", icon: Hammer },
  { id: "power", name: "Power Generators", icon: Bolt },
];

export const filterCategories = [
  { id: "cnc", name: "Mesin CNC", icon: Factory },
  { id: "packaging", name: "Packaging", icon: Package },
  { id: "pertanian", name: "Pertanian", icon: Sprout },
  { id: "food", name: "Food Processing", icon: Soup },
  { id: "logistik", name: "Logistik", icon: Truck },
];

export const quickFilters = [
  "Ready Stock",
  "New Arrival",
  "Best Price",
  "Heavy Duty",
];
