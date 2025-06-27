
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Users, Phone, Mail, ClockIcon, MessageSquare } from 'lucide-react';
import { mockTenantProfiles } from '@/app/landlord/tenants/[tenantId]/page'; // Reusing mock data
import { mockWorkerProfiles } from '@/app/landlord/workers/[workerId]/page'; // Reusing worker mock data
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Simulate fetching data for a specific tenant (e.g., tenant001)
const currentTenant = mockTenantProfiles.find(t => t.id === 'tenant001');

const apartmentWorkers = currentTenant 
  ? mockWorkerProfiles.filter(w => 
      w.assignedApartments.some(apt => apt.id === currentTenant.apartmentId) && w.status === 'Active'
    )
  : [];

export default function WorkersInApartmentPage() {
  const { toast } = useToast();

  if (!currentTenant) {
    return <div className="text-center text-destructive">Error: Could not load tenant data.</div>;
  }

  const handleContactWorker = (workerName: string) => {
    toast({
      title: "Contact Worker (Placeholder)",
      description: `Direct contact with ${workerName} is not yet enabled. Please use service requests for communication.`,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Workers in Your Apartment ({currentTenant.apartmentName})</h1>
      
      {apartmentWorkers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apartmentWorkers.map(worker => (
            <Card key={worker.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4 pb-3">
                <Avatar className="h-12 w-12">
                   <AvatarImage src={`https://placehold.co/80x80.png?text=${worker.fullName.substring(0,1)}`} alt={worker.fullName} data-ai-hint="person avatar"/>
                   <AvatarFallback>{worker.fullName.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-xl">{worker.fullName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{worker.role}</p>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-1 flex-grow">
                {worker.phone && (
                    <p className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground"/> {worker.phone}</p>
                )}
                {worker.email && (
                    <p className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/> {worker.email}</p>
                )}
                <p className="flex items-center pt-1"><ClockIcon className="mr-2 h-4 w-4 text-muted-foreground"/> <span className="font-medium">Schedule:</span> {worker.workingHours}</p>
              </CardContent>
              <CardFooter className="border-t mt-auto pt-3">
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleContactWorker(worker.fullName)}>
                  <MessageSquare className="mr-2 h-4 w-4"/> Contact Worker
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-md">
          <CardContent className="text-center py-10">
            <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold text-muted-foreground">No active workers currently assigned to your apartment.</p>
            <p className="text-sm text-muted-foreground">If you have a service request, please submit it, and a worker will be assigned.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
