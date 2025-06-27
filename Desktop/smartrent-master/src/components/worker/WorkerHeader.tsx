
'use client';

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Bell, LogOut } from 'lucide-react';
import { mockWorkerProfiles } from '@/app/landlord/workers/[workerId]/page'; // for name placeholder

export default function WorkerHeader() {
  const { isMobile } = useSidebar();
  // Simulate a logged-in worker
  const worker = mockWorkerProfiles.find(w => w.id === 'worker001') || { fullName: 'Worker', id: 'worker001' };


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {isMobile && <SidebarTrigger className="sm:hidden" />}
      
      <div className="relative ml-auto flex-1 md:grow-0">
        {/* Placeholder for global search if needed */}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/worker/notifications">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${worker.fullName.substring(0,1)}`} alt={worker.fullName} data-ai-hint="worker avatar" />
                <AvatarFallback>{worker.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/worker/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Support (Coming Soon)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
