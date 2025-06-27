
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  CalendarDays,
  ListChecks,
  ClipboardEdit, // For Report an Issue
  Bell,
  UserCircle,
  BarChart3, // For their performance reports
  Building, // For Assigned Apartments
} from 'lucide-react';

export interface WorkerNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const workerNavItems: WorkerNavItem[] = [
  {
    title: 'Dashboard',
    href: '/worker/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Schedule',
    href: '/worker/schedule',
    icon: CalendarDays,
  },
  {
    title: 'My Tasks',
    href: '/worker/tasks',
    icon: ListChecks,
  },
  // Assigned Apartments View can be part of profile or a separate page
  // For now, keeping it simple, details might be on dashboard/profile
  {
    title: 'Report an Issue',
    href: '/worker/report-issue',
    icon: ClipboardEdit,
  },
  {
    title: 'Notifications',
    href: '/worker/notifications',
    icon: Bell,
  },
  {
    title: 'My Performance',
    href: '/worker/reports',
    icon: BarChart3,
  },
  {
    title: 'My Profile',
    href: '/worker/profile',
    icon: UserCircle,
  },
];
