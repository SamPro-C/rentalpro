
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, ClipboardList, CreditCard, Home, Users, DollarSign, ShoppingCart, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { mockTenantProfiles } from '@/app/landlord/tenants/[tenantId]/page'; 
import { mockWorkerProfiles } from '@/app/landlord/workers/[workerId]/page';

const currentTenant = mockTenantProfiles.find(t => t.id === 'tenant001');
const apartmentWorkers = currentTenant 
  ? mockWorkerProfiles.filter(w => 
      w.assignedApartments.some(apt => apt.id === currentTenant.apartmentId) && w.status === 'Active'
    )
  : [];

export default function TenantDashboardPage() {
  if (!currentTenant) {
    return <div className="text-center text-destructive">Error: Could not load tenant data.</div>;
  }

  const lastPayment = currentTenant.paymentHistory.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0];
  const currentMonthRentStatus = lastPayment?.monthYear.startsWith(new Date().toLocaleString('default', { month: 'long' })) ? lastPayment.status : 'Unpaid';
  const amountDue = currentTenant.monthlyRent - (currentMonthRentStatus === 'Partial' && lastPayment ? lastPayment.amountPaid : 0);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Hello, {currentTenant.fullName}!
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Home className="mr-2 h-6 w-6" /> Your Residence
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><strong>Tenant ID:</strong> {currentTenant.id}</p>
            <p><strong>National ID:</strong> {currentTenant.nationalId}</p>
            <p><strong>Apartment:</strong> {currentTenant.apartmentName}</p>
            <p><strong>Unit:</strong> {currentTenant.unitName}</p>
            <p><strong>Room:</strong> {currentTenant.roomNumber}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-accent">
              <DollarSign className="mr-2 h-6 w-6" /> Current Rent Status
            </CardTitle>
            <CardDescription>For {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg">
              <strong>Amount Due:</strong> KES {amountDue.toLocaleString()}
            </p>
            <p className="text-sm">
              <strong>Status:</strong> 
              <span className={`ml-2 font-semibold ${
                currentMonthRentStatus === 'Paid' ? 'text-green-600' :
                currentMonthRentStatus === 'Partial' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {currentMonthRentStatus}
              </span>
            </p>
            <Button asChild className="w-full mt-2 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/tenant/payments">
                <CreditCard className="mr-2 h-4 w-4" /> Pay Now / View History
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground text-center">Due Date: 5th of {new Date().toLocaleString('default', { month: 'long' })}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><ClipboardList className="mr-2 h-5 w-5"/>Service Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {currentTenant.serviceRequestHistory.filter(sr => sr.status === 'Pending' || sr.status === 'In Progress').length} active requests.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/tenant/service-requests">View My Requests</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5"/>Workers in Apartment</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground mb-3">
              {apartmentWorkers.length > 0 ? `${apartmentWorkers.length} worker(s) assigned.` : `No workers currently assigned.` }
             </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/tenant/workers-in-apartment">View Worker Details</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5"/>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">You have 2 unread notifications.</p> {/* Placeholder */}
            <Button asChild variant="outline" className="w-full">
              <Link href="/tenant/notifications">View All Notifications</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg bg-secondary/30">
        <CardHeader>
            <CardTitle className="flex items-center text-secondary-foreground/80"><ShoppingCart className="mr-2 h-5 w-5"/>SmartRent Shopping</CardTitle>
            <CardDescription>Conveniently shop for essentials and services.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button asChild className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/tenant/shopping">Go to Shopping</Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
