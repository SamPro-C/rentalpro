
import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import WorkerHeader from '@/components/worker/WorkerHeader';
import WorkerSidebar from '@/components/worker/WorkerSidebar';

export const metadata: Metadata = {
  title: 'Worker Dashboard - SmartRent',
  description: 'Manage your tasks and schedule with SmartRent.',
};

export default function WorkerDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr] lg:grid-cols-[var(--sidebar-width)_1fr] group-data-[sidebar-state=collapsed]:lg:grid-cols-[var(--sidebar-width-icon)_1fr] transition-[grid-template-columns] duration-300 ease-in-out">
        <WorkerSidebar />
        <div className="flex flex-col">
          <WorkerHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
