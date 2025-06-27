
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Building,
  ShieldCheck,
  Settings,
  FileText,
  Activity,
  ShoppingCart,
  DollarSign,
  ClipboardList,
  UserCircle, // Added this
  Bell // Added this
} from 'lucide-react';

export interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  items?: AdminNavItem[]; 
}

export const adminNavItems: AdminNavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
    items: [
      { title: 'Approval Queue', href: '/admin/users/approvals', icon: ShieldCheck },
      { title: 'Manage Landlords', href: '/admin/users/landlords', icon: Users },
      { title: 'Manage Tenants', href: '/admin/users/tenants', icon: Users },
      { title: 'Manage Workers', href: '/admin/users/workers', icon: Users },
      { title: 'Manage Shop Managers', href: '/admin/users/shop-managers', icon: Users },
    ]
  },
  {
    title: 'Property Oversight',
    href: '/admin/properties',
    icon: Building,
  },
  {
    title: 'Financial Overview',
    href: '/admin/financials',
    icon: DollarSign,
  },
  {
    title: 'Service Requests Log',
    href: '/admin/service-requests',
    icon: ClipboardList,
  },
  {
    title: 'E-commerce Oversight',
    href: '/admin/ecommerce',
    icon: ShoppingCart,
  },
  {
    title: 'System Reports',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    title: 'Audit Logs',
    href: '/admin/audit-logs',
    icon: Activity,
  },
  {
    title: 'System Settings',
    href: '/admin/settings', // Main link for settings hub (can be general or a new hub page)
    icon: Settings,
     items: [
      { title: 'General Config', href: '/admin/settings/system', icon: Settings },
      { title: 'Notifications & Announcements', href: '/admin/settings/notifications', icon: Bell },
      { title: 'Roles & Permissions', href: '/admin/settings/roles', icon: ShieldCheck },
    ]
  },
   {
    title: 'My Admin Profile',
    href: '/admin/profile',
    icon: UserCircle,
  },
];
