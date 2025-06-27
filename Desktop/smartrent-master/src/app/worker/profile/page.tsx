
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Edit3, ShieldAlert, Briefcase, CalendarDays, Clock, Building } from 'lucide-react';
import Link from 'next/link'; // Not actively used for navigation, but good for consistency
import { mockWorkerProfiles } from '@/app/landlord/workers/[workerId]/page'; // Reusing mock data
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Simulate fetching data for a specific worker (e.g., worker001)
const currentWorker = mockWorkerProfiles.find(w => w.id === 'worker001');

export default function WorkerProfilePage() {
  const { toast } = useToast();

  if (!currentWorker) {
    return <div className="text-center text-destructive p-8">Error: Could not load worker profile data.</div>;
  }

  const handleChangePassword = () => {
    console.log("Change password for worker:", currentWorker.id);
    toast({ title: "Action: Change Password", description: "Password change modal/form would appear here." });
    // TODO: Implement password change modal
  };

  const handleRequestInfoUpdate = () => {
    console.log("Request info update for worker:", currentWorker.id);
    toast({ title: "Action: Request Info Update", description: "Form to request info update from landlord would appear here." });
    // TODO: Implement info update request form/modal
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
        <UserCircle className="mr-3 h-8 w-8 text-primary" /> My Profile
      </h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your details as registered by your landlord. Request updates for any changes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <p><strong>Full Name:</strong> {currentWorker.fullName}</p>
            <p><strong>Email:</strong> {currentWorker.email || <span className="italic text-muted-foreground">Not provided</span>}</p>
            <p><strong>Phone:</strong> {currentWorker.phone}</p>
            <p><strong>National ID:</strong> {currentWorker.nationalId}</p>
            <p><strong>Role:</strong> {currentWorker.role}</p>
            <p><strong>Status:</strong> 
                <Badge variant={currentWorker.status === 'Active' ? 'default' : 'destructive'} 
                       className={`ml-2 ${currentWorker.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {currentWorker.status}
                </Badge>
            </p>
          </div>
          <Separator className="my-3"/>
          <h3 className="font-semibold text-base">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <p><strong>Name:</strong> {currentWorker.emergencyContactName}</p>
            <p><strong>Phone:</strong> {currentWorker.emergencyContactPhone}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary"/>Assignments & Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
            <div>
                <strong className="flex items-center mb-1"><Building className="mr-2 h-4 w-4"/>Assigned Apartments:</strong>
                {currentWorker.assignedApartments.length > 0 ? (
                     <div className="flex flex-wrap gap-1">
                        {currentWorker.assignedApartments.map(apt => 
                            <Badge key={apt.id} variant="secondary">{apt.name}</Badge>
                        )}
                    </div>
                ) : <p className="italic text-muted-foreground">None</p>}
            </div>
            <p><strong className="flex items-center"><Clock className="mr-2 h-4 w-4"/>Working Hours:</strong> {currentWorker.workingHours}</p>
            <Button variant="link" asChild className="p-0 h-auto text-primary">
                <Link href="/worker/schedule">View Full Schedule</Link>
            </Button>
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
                  Request Personal Info Update
              </Button>
          </CardContent>
          <CardFooter>
             <p className="text-xs text-muted-foreground">
                To update your core profile details (name, ID, role, assignments), please contact your landlord. 
                You can request changes for your contact information (phone/email) here.
            </p>
          </CardFooter>
      </Card>
    </div>
  );
}
