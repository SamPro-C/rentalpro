
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  CreditCard,
  ClipboardList,
  Users, // For workers
  Bell,
  ShoppingCart,
  UserCircle,
} from 'lucide-react';

export interface TenantNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const tenantNavItems: TenantNavItem[] = [
  {
    title: 'Dashboard',
    href: '/tenant/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Payments',
    href: '/tenant/payments',
    icon: CreditCard,
  },
  {
    title: 'Service Requests',
    href: '/tenant/service-requests',
    icon: ClipboardList,
  },
  {
    title: 'Workers in Apartment',
    href: '/tenant/workers-in-apartment',
    icon: Users,
  },
  {
    title: 'Notifications',
    href: '/tenant/notifications',
    icon: Bell,
  },
  {
    title: 'Shopping',
    href: '/tenant/shopping', // Placeholder, could be external link
    icon: ShoppingCart,
  },
  {
    title: 'My Profile',
    href: '/tenant/profile', // Placeholder for viewing profile info
    icon: UserCircle,
  },
];
