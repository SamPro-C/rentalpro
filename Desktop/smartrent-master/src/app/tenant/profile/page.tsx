'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Home, Edit3, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { mockTenantProfiles } from '@/app/landlord/tenants/[tenantId]/page'; // Reusing mock data
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Simulate fetching data for a specific tenant (e.g., tenant001)
const currentTenant = mockTenantProfiles.find(t => t.id === 'tenant001');

export default function TenantProfilePage() {
  const { toast } = useToast();

  if (!currentTenant) {
    return <div className="text-center text-destructive">Error: Could not load tenant profile data.</div>;
  }

  const handleChangePassword = () => {
    console.log("Change password for tenant:", currentTenant.id);
    toast({ title: "Action: Change Password", description: "Password change modal/form would appear here." });
  };

  const handleRequestInfoUpdate = () => {
    console.log("Request info update for tenant:", currentTenant.id);
    toast({ title: "Action: Request Info Update", description: "Form to request info update would appear here." });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
        <UserCircle className="mr-3 h-8 w-8 text-primary" /> My Profile
      </h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your details as registered with SmartRent. Contact your landlord for any corrections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <p><strong>Full Name:</strong> {currentTenant.fullName}</p>
            <p><strong>Email:</strong> {currentTenant.email}</p>
            <p><strong>Phone:</strong> {currentTenant.phone}</p>
            <p><strong>National ID:</strong> {currentTenant.nationalId}</p>
            <p><strong>Date of Birth:</strong> {currentTenant.dateOfBirth}</p>
            <p><strong>Gender:</strong> <span className="capitalize">{currentTenant.gender}</span></p>
          </div>
          <Separator className="my-3"/>
          <h3 className="font-semibold text-base">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <p><strong>Name:</strong> {currentTenant.emergencyContactName}</p>
            <p><strong>Phone:</strong> {currentTenant.emergencyContactPhone}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Home className="mr-2 h-5 w-5 text-primary"/>Residence Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
            <p><strong>Apartment:</strong> {currentTenant.apartmentName}</p>
            <p><strong>Unit:</strong> {currentTenant.unitName}</p>
            <p><strong>Room:</strong> {currentTenant.roomNumber}</p>
            <Separator className="my-3"/>
            <p><strong>Move-in Date:</strong> {currentTenant.moveInDate}</p>
            <p><strong>Monthly Rent:</strong> KES {currentTenant.monthlyRent.toLocaleString()}</p>
            <p><strong>Security Deposit:</strong> KES {currentTenant.securityDeposit.toLocaleString()}</p>
            <p><strong>Lease Start Date:</strong> {currentTenant.leaseStartDate}</p>
            <p><strong>Lease End Date:</strong> {currentTenant.leaseEndDate || 'N/A (Month-to-Month)'}</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
          <CardHeader>
              <CardTitle className="flex items-center"><ShieldAlert className="mr-2 h-5 w-5 text-primary"/>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={handleChangePassword}>
                  <Edit3 className="mr-2 h-4 w-4"/> Change My Password
              </Button>
              <Button variant="outline" onClick={handleRequestInfoUpdate}>
                  Request Information Update
              </Button>
          </CardContent>
          <CardFooter>
             <p className="text-xs text-muted-foreground">
                To update your personal or lease details, please contact your landlord. 
                You can request changes for your contact information (phone/email) here.
            </p>
          </CardFooter>
      </Card>
    </div>
  );
}