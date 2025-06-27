
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ClipboardList, User, Building, CalendarDays, MessageSquare, Clock, Image as ImageIcon, Paperclip, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import NextImage from 'next/image'; // Renamed to avoid conflict with Lucide's Image
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { mockTenantProfiles } from '@/app/landlord/tenants/[tenantId]/page'; // Reusing mock data
import { mockServiceRequestDetailsList } from '@/app/landlord/service-requests/[requestId]/page'; // Using landlord's more detailed mock
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Simulate fetching data for a specific tenant (e.g., tenant001)
const currentTenant = mockTenantProfiles.find(t => t.id === 'tenant001');

// Simulate landlord-side activity log for the request (as tenants don't add to it)
const getRequestActivityLog = (requestId: string) => {
    const landlordSideRequest = mockServiceRequestDetailsList.find(req => req.requestId === requestId);
    return landlordSideRequest?.activityLog || [];
};

export default function TenantServiceRequestDetailsPage() {
  const params = useParams();
  const requestId = params.requestId as string;
  const { toast } = useToast();
  const [rating, setRating] = useState(0);

  if (!currentTenant) {
    return <div className="text-center text-destructive">Error: Could not load tenant data.</div>;
  }
  
  const request = currentTenant.serviceRequestHistory.find(req => req.requestId === requestId);
  const detailedRequestInfo = mockServiceRequestDetailsList.find(req => req.requestId === requestId); // For media and priority


  if (!request) {
     return (
        <div className="flex flex-col items-center justify-center h-full p-8">
            <ClipboardList className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-muted-foreground mb-2">Service Request Not Found</h2>
            <p className="text-muted-foreground mb-6">The request with ID "{requestId}" could not be found.</p>
            <Button asChild variant="outline">
                <Link href="/tenant/service-requests">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Requests
                </Link>
            </Button>
        </div>
    );
  }

  const activityLog = getRequestActivityLog(requestId);

  const handleCancelRequest = () => {
      if (request.status === 'Pending' && window.confirm("Are you sure you want to cancel this service request?")) {
          console.log("Canceling request:", requestId);
          toast({ title: "Request Canceled", description: `Service Request ${requestId} has been canceled.`});
          // TODO: Update status in backend/mock data
      } else {
          toast({ title: "Cannot Cancel", description: "This request can no longer be canceled.", variant: "destructive"});
      }
  };

  const handleRateService = () => {
      if (rating > 0 && request.status === 'Completed' || request.status === 'Resolved') {
          console.log(`Rating service for ${requestId} with ${rating} stars.`);
          toast({title: "Rating Submitted", description: `You rated this service ${rating} stars. Thank you!`});
          // TODO: Submit rating to backend
      } else if (request.status !== 'Completed' && request.status !== 'Resolved'){
          toast({title: "Cannot Rate", description: "Service must be completed to rate.", variant: "destructive"});
      } else {
          toast({title: "Rating Error", description: "Please select a star rating.", variant: "destructive"});
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
            <Button variant="outline" size="sm" asChild className="mb-2">
                <Link href="/tenant/service-requests">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Requests
                </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
                <ClipboardList className="mr-3 h-8 w-8 text-primary" />
                Service Request: {request.requestId}
            </h1>
             <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Badge variant={detailedRequestInfo?.priority === 'Urgent' ? 'destructive' : detailedRequestInfo?.priority === 'Low' ? 'secondary' : 'outline'}
                       className={`capitalize ${detailedRequestInfo?.priority === 'Urgent' ? 'bg-red-100 text-red-700' : detailedRequestInfo?.priority === 'Low' ? 'bg-blue-100 text-blue-700' : ''}`}>
                    Priority: {detailedRequestInfo?.priority || 'Normal'}
                </Badge>
                <Badge variant={request.status === 'Completed' || request.status === 'Resolved' ? 'default' : (request.status === 'Pending' ? 'secondary' : 'outline')}
                       className={
                           request.status === 'Completed' || request.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                           request.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                           request.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                           'bg-gray-100 text-gray-700' // Canceled
                       }>
                    Status: {request.status}
                </Badge>
            </p>
        </div>
        {request.status === 'Pending' && (
            <Button variant="destructive" onClick={handleCancelRequest}>
                Cancel Request
            </Button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-md">
            <CardHeader><CardTitle>Request Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <p><strong className="text-muted-foreground flex items-center"><CalendarDays className="mr-2 h-4 w-4"/>Submitted:</strong> {request.dateSubmitted}</p>
                <p><strong className="text-muted-foreground flex items-center"><Building className="mr-2 h-4 w-4"/>Location:</strong> {detailedRequestInfo?.locationOfIssue || 'N/A'}</p>
                <Separator/>
                <p className="font-semibold">Issue Description:</p>
                <p className="text-foreground whitespace-pre-wrap">{request.description}</p>
                
                {detailedRequestInfo?.attachedMedia && detailedRequestInfo.attachedMedia.length > 0 && (
                    <>
                        <Separator/>
                        <p className="font-semibold">Attached Media:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {detailedRequestInfo.attachedMedia.map((media, index) => (
                                <a key={index} href={media.url} target="_blank" rel="noopener noreferrer" className="block border rounded-md overflow-hidden hover:opacity-80 transition-opacity">
                                    {media.type === 'image' ? (
                                        <NextImage src={media.url} alt={media.name} width={150} height={100} className="object-cover w-full h-24" data-ai-hint="repair evidence tenant"/>
                                    ) : (
                                        <div className="p-2 text-center bg-muted h-24 flex flex-col justify-center items-center">
                                            <Paperclip className="h-8 w-8 text-muted-foreground"/>
                                            <p className="text-xs truncate mt-1">{media.name}</p>
                                        </div>
                                    )}
                                </a>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>

        <Card className="md:col-span-1 shadow-md">
            <CardHeader><CardTitle>Assigned Worker</CardTitle></CardHeader>
            <CardContent>
                {detailedRequestInfo?.assignedWorker ? (
                    <div className="space-y-1 text-sm">
                        <p><strong className="text-muted-foreground">Name:</strong> {detailedRequestInfo.assignedWorker.name}</p>
                        <p><strong className="text-muted-foreground">Role:</strong> {detailedRequestInfo.assignedWorker.role}</p>
                        <p><strong className="text-muted-foreground">Contact:</strong> {detailedRequestInfo.assignedWorker.contact}</p>
                        <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                            <Link href={`/tenant/workers-in-apartment?highlight=${detailedRequestInfo.assignedWorker.id}`}>
                                View Worker Details
                            </Link>
                        </Button>
                    </div>
                ) : <p className="italic text-muted-foreground">No worker assigned yet.</p>}
            </CardContent>
        </Card>
      </div>
      
      {(request.status === 'Completed' || request.status === 'Resolved') && (
        <Card className="shadow-md">
            <CardHeader><CardTitle>Rate Service</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-4">
                <div className="flex">
                    {[1,2,3,4,5].map(star => (
                        <Button key={star} variant="ghost" size="icon" onClick={() => setRating(star)} className="p-1">
                            <Star className={`h-6 w-6 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                        </Button>
                    ))}
                </div>
                <Button onClick={handleRateService} disabled={rating === 0}>Submit Rating</Button>
            </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader><CardTitle className="flex items-center"><Clock className="mr-2 h-5 w-5"/>Activity Log</CardTitle></CardHeader>
        <CardContent>
            {activityLog.length > 0 ? (
                <ul className="space-y-3 max-h-72 overflow-y-auto">
                    {activityLog.slice().reverse().map(log => ( // Display newest first
                        <li key={log.id} className="text-sm border-l-2 pl-3 py-1 data-[actor^=System]:border-blue-500 data-[actor^=Tenant]:border-green-500 data-[actor^=Landlord]:border-purple-500 data-[actor^=Worker]:border-orange-500" data-actor={log.actor.split(' ')[0]}>
                            <p className="font-medium">{log.action} <span className="text-xs text-muted-foreground">by {log.actor}</span></p>
                            <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                            {log.details && <p className="text-xs italic text-muted-foreground/80 mt-0.5">{log.details}</p>}
                        </li>
                    ))}
                </ul>
            ) : <p className="text-muted-foreground text-center py-4">No activity recorded yet for this request.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
