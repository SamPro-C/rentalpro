
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
import { landlordNavItems } from '@/config/landlord-dashboard';
import { Home, LogOut } from 'lucide-react'; // SmartRent logo
import { Button } from '@/components/ui/button';

export default function LandlordSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Exact match for dashboard, startsWith for others to highlight parent section
    if (href === '/landlord/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    // Using variant="sidebar" as it's a common pattern for main sidebars
    // defaultOpen={true} makes it open by default on desktop
    <Sidebar collapsible="icon" side="left" variant="sidebar" defaultOpen={true} className="hidden border-r bg-muted/40 md:block">
      <SidebarHeader className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/landlord/dashboard" className="flex items-center gap-2 font-semibold text-primary">
          <Home className="h-6 w-6" />
          <span className="text-lg group-data-[collapsible=icon]:hidden">SmartRent</span>
        </Link>
        {/* Can add a Bell icon here for notifications count if needed, specific to sidebar variant */}
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {landlordNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                variant="default" // 'default' usually has a background on hover/active
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
        {/* Example: Logout button or settings quick link */}
        <SidebarMenu>
           <SidebarMenuItem>
                <SidebarMenuButton asChild variant="ghost" tooltip={{ children: 'Logout', side: 'right', align: 'center' }}>
                    <Link href="/auth"> {/* Should trigger logout */}
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
