
import type { Metadata } from 'next';
import TenantHeader from '@/components/tenant/TenantHeader';
import Footer from '@/components/layout/Footer'; // Assuming a shared footer

export const metadata: Metadata = {
  title: 'Tenant Dashboard - SmartRent',
  description: 'Manage your tenancy, payments, and service requests with SmartRent.',
};

export default function TenantDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TenantHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
