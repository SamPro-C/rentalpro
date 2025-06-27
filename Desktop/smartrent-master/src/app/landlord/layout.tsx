
import type { Metadata } from 'next';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import LandlordHeader from '@/components/landlord/LandlordHeader';
import LandlordSidebar from '@/components/landlord/LandlordSidebar';

export const metadata: Metadata = {
  title: 'Landlord Dashboard - SmartRent',
  description: 'Manage your properties, tenants, and workers with SmartRent.',
};

export default function LandlordDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}> {/* Manages sidebar state */}
      <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr] lg:grid-cols-[var(--sidebar-width)_1fr] group-data-[sidebar-state=collapsed]:lg:grid-cols-[var(--sidebar-width-icon)_1fr] transition-[grid-template-columns] duration-300 ease-in-out">
        <LandlordSidebar />
        <div className="flex flex-col">
          <LandlordHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
