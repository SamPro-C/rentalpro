
import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export const metadata: Metadata = {
  title: 'Admin Dashboard - SmartRent',
  description: 'Manage the SmartRent platform.',
};

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Dialog>
        <DialogContent>
          <DialogTitle className="sr-only">Admin Dashboard</DialogTitle>
          <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr] lg:grid-cols-[var(--sidebar-width)_1fr] group-data-[sidebar-state=collapsed]:lg:grid-cols-[var(--sidebar-width-icon)_1fr] transition-[grid-template-columns] duration-300 ease-in-out">
            <AdminSidebar />
            <div className="flex flex-col">
              <AdminHeader />
              <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
              </main>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
