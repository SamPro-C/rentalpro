
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { workerNavItems } from '@/config/worker-dashboard';
import { Home as AppIcon, LogOut } from 'lucide-react'; // Using Home as a generic app icon

export default function WorkerSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/worker/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" side="left" variant="sidebar" defaultOpen={true} className="hidden border-r bg-muted/40 md:block">
      <SidebarHeader className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/worker/dashboard" className="flex items-center gap-2 font-semibold text-primary">
          <AppIcon className="h-6 w-6" />
          <span className="text-lg group-data-[collapsible=icon]:hidden">SmartRent Worker</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {workerNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                variant="default"
                size="default"
                isActive={isActive(item.href)}
                tooltip={{ children: item.title, side: 'right', align: 'center' }}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t p-2">
        <SidebarMenu>
           <SidebarMenuItem>
                <SidebarMenuButton asChild variant="ghost" tooltip={{ children: 'Logout', side: 'right', align: 'center' }}>
                    <Link href="/auth">
                        <LogOut className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
