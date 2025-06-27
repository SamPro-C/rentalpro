
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { adminNavItems } from '@/config/admin-dashboard';
import { ShieldEllipsis, LogOut } from 'lucide-react'; 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, isSubItem: boolean = false) => {
    if (isSubItem) {
        return pathname === href;
    }
    // For parent items, active if current path starts with parent href,
    // unless it's the main dashboard link which needs exact match.
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" side="left" variant="sidebar" defaultOpen={true} className="hidden border-r bg-muted/40 md:block">
      <SidebarHeader className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold text-primary">
          <ShieldEllipsis className="h-6 w-6" />
          <span className="text-lg group-data-[collapsible=icon]:hidden">SmartRent Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <Accordion type="multiple" className="w-full group-data-[collapsible=icon]:hidden">
          {adminNavItems.map((item) => (
            item.items && item.items.length > 0 ? (
              <AccordionItem value={item.title} key={item.title} className="border-b-0">
                <AccordionTrigger 
                    className={`py-0 hover:no-underline [&[data-state=open]>svg]:text-primary ${isActive(item.href) && !item.items.some(sub => pathname === sub.href) ? 'text-primary font-semibold bg-accent/50 rounded-md' : 'hover:bg-accent/30 rounded-md'}`}
                >
                    <SidebarMenuButton
                        asChild
                        variant="ghost"
                        size="default"
                        className={`w-full justify-start ${isActive(item.href) && !item.items.some(sub => pathname === sub.href) ? '!bg-transparent !text-primary' : ''}`}
                        isActive={isActive(item.href) && !item.items.some(sub => pathname === sub.href)}
                    >
                        <Link href={item.href} className="flex items-center w-full">
                            <item.icon className="h-5 w-5 mr-2 flex-shrink-0" />
                            <span className="truncate">{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </AccordionTrigger>
                <AccordionContent className="pb-1 pl-4">
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.href}>
                        <SidebarMenuButton
                          asChild
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          isActive={isActive(subItem.href, true)}
                        >
                          <Link href={subItem.href}>
                            {subItem.icon && <subItem.icon className="h-4 w-4 mr-2 flex-shrink-0" />}
                            <span className="truncate">{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <SidebarMenuItem key={item.href} className="group-data-[collapsible=icon]:hidden my-0.5">
                 <SidebarMenuButton
                    asChild
                    variant="ghost"
                    size="default"
                    className="w-full justify-start"
                    isActive={isActive(item.href)}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5 mr-2 flex-shrink-0" />
                       <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            )
          ))}
        </Accordion>
        {/* For collapsed icon-only sidebar */}
        <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
             {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href + "-icon"}>
                     <SidebarMenuButton
                        asChild
                        variant="ghost"
                        size="default"
                        isActive={isActive(item.href)}
                        tooltip={{ children: item.title, side: 'right', align: 'center' }}
                    >
                        <Link href={item.href}>
                            <item.icon className="h-5 w-5" />
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
