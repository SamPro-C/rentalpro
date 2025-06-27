
import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import ShopManagerHeader from '@/components/shop-manager/ShopManagerHeader';
import ShopManagerSidebar from '@/components/shop-manager/ShopManagerSidebar';

export const metadata: Metadata = {
  title: 'Shop Manager - SmartRent',
  description: 'Manage your e-commerce operations with SmartRent.',
};

export default function ShopManagerDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr] lg:grid-cols-[var(--sidebar-width)_1fr] group-data-[sidebar-state=collapsed]:lg:grid-cols-[var(--sidebar-width-icon)_1fr] transition-[grid-template-columns] duration-300 ease-in-out">
        <ShopManagerSidebar />
        <div className="flex flex-col">
          <ShopManagerHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
