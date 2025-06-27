
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  CreditCard,
  ClipboardList,
  BarChart3,
  Bell,
  Settings,
  FileText, 
  MessageSquare, 
  CalendarDays, 
  Brain, 
  Banknote,
  DollarSign // Added DollarSign here
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  external?: boolean;
  items?: NavItem[]; 
}

export const landlordNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/landlord/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Apartments',
    href: '/landlord/apartments',
    icon: Building2,
  },
  {
    title: 'Tenants',
    href: '/landlord/tenants',
    icon: Users,
  },
  {
    title: 'Workers',
    href: '/landlord/workers',
    icon: Briefcase,
  },
  {
    title: 'Payments & Financials',
    href: '/landlord/payments', // This can be the overview page link
    icon: CreditCard,
    items: [ 
        { title: 'Payment Overview', href: '/landlord/payments', icon: CreditCard},
        { title: 'Manual Payments', href: '/landlord/payments/manual', icon: FileText},
        { title: 'Expenses', href: '/landlord/payments/expenses', icon: DollarSign},
        { title: 'Worker Payroll', href: '/landlord/payments/worker-payroll', icon: Banknote},
    ]
  },
  {
    title: 'Service Requests',
    href: '/landlord/service-requests',
    icon: ClipboardList,
  },
  {
    title: 'My Planner', 
    href: '/landlord/planner',
    icon: CalendarDays, 
  },
  {
    title: 'Reports',
    href: '/landlord/reports',
    icon: BarChart3, 
  },
  {
    title: 'Notifications',
    href: '/landlord/notifications',
    icon: MessageSquare, 
  },
  {
    title: 'Settings',
    href: '/landlord/settings',
    icon: Settings,
  },
];

