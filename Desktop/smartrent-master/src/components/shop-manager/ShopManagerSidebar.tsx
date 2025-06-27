
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
import { shopManagerNavItems } from '@/config/shop-manager-dashboard';
import { ShoppingBag, LogOut } from 'lucide-react'; 

export default function ShopManagerSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/shop-manager/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" side="left" variant="sidebar" defaultOpen={true} className="hidden border-r bg-muted/40 md:block">
      <SidebarHeader className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/shop-manager/dashboard" className="flex items-center gap-2 font-semibold text-primary">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-lg group-data-[collapsible=icon]:hidden">SmartRent Shop</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {shopManagerNavItems.map((item) => (
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
                  {item.label && <span className="ml-auto text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">{item.label}</span>}
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
