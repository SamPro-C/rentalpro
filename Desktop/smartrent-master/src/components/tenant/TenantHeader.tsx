
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { tenantNavItems } from '@/config/tenant-dashboard';
import { Home as AppIcon, Menu, LogOut } from 'lucide-react'; // Renamed Home to AppIcon
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function TenantHeader() {
  const pathname = usePathname();
  const tenantName = "Tenant User"; // Placeholder

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/tenant/dashboard" className="flex items-center space-x-2">
          <AppIcon className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-primary">SmartRent Tenant</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center space-x-1 md:flex">
          {tenantNavItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
              className={`px-3 py-2 text-sm font-medium ${pathname.startsWith(item.href) ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center space-x-2 md:ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/40x40.png" alt={tenantName} data-ai-hint="user avatar generic"/>
                  <AvatarFallback>{tenantName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/tenant/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/auth">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0">
              <nav className="flex flex-col space-y-1 p-2 pt-6">
                 <Link href="/tenant/dashboard" className="flex items-center space-x-2 p-2 mb-2 border-b">
                    <AppIcon className="h-6 w-6 text-primary" />
                    <span className="font-bold text-primary">SmartRent Tenant</span>
                  </Link>
                {tenantNavItems.map((item) => (
                  <Button
                    key={item.href}
                    asChild
                    variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                    className="justify-start"
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
