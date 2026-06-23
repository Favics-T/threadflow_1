
import { 
    LayoutDashboard, Landmark,
     ShoppingCart, ShelvingUnit,
     CirclePile,HatGlasses     } from 'lucide-react'


export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/clients",
    label: "Clients",
    icon: Landmark,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    href: "/inventory",
    label: "Inventory",
    icon: ShelvingUnit,
  },
  {
    href: "/tailors",
    label: "Tailors",
    icon: CirclePile,
  },
  {
    href: "/agent",
    label: "AI Agent",
    icon: HatGlasses,
  },
];