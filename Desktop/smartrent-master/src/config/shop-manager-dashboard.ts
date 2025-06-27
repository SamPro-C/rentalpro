
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  BarChart3
} from 'lucide-react';

export interface ShopManagerNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
}

export const shopManagerNavItems: ShopManagerNavItem[] = [
  {
    title: 'Dashboard',
    href: '/shop-manager/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Order Management',
    href: '/shop-manager/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Product Management',
    href: '/shop-manager/products',
    icon: Package,
  },
  {
    title: 'Customer Management',
    href: '/shop-manager/customers',
    icon: Users,
    label: 'Shop Customers',
  },
  {
    title: 'Reports & Analytics',
    href: '/shop-manager/reports',
    icon: BarChart3,
  },
  {
    title: 'Shop Settings',
    href: '/shop-manager/settings',
    icon: Settings,
  },
];
