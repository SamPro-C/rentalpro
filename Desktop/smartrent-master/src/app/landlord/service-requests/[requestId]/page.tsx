
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ClipboardList, User, Building, CalendarDays, Image as ImageIcon, Paperclip, UserCog, MessageSquare, Clock, Edit3, Phone, Mail, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image'; 
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockServiceRequestDetailsList, mockWorkersForAssignment } from '@/lib/mock-data'; // Ensure mockWorkersForAssignment is exported

interface ActivityLogItem {
  id: string;
  timestamp: string;
  actor: string; 
  action: string;
  details?: string;
}
export interface ServiceRequestDetail {
  id: string; 
  requestId: string; 
  dateSubmitted: string;
  tenantName: string;
  tenantId: string; 
  tenantPhone: string;
  apartmentName: string;
  apartmentId: string; 
  unitName: string;
  unitId: string; 
  roomNumber: string;
  locationOfIssue?: string; // More specific location from tenant form
  fullDescription: string;
  attachedMedia: Array<{ type: 'image' | 'video'; url: string; name: string }>;
  currentStatus: 'Pending' | 'In Progress' | 'Completed' | 'Canceled';
  assignedWorker?: { id: string; name: string; role: string; contact: string };
  priority?: 'Urgent' | 'Normal' | 'Low';
  activityLog: ActivityLogItem[];
}


export default function ServiceRequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.requestId as string; 
  const { toast } = useToast();

  const initialRequest = mockServiceRequestDetailsList.find(req => req.requestId === requestId);
  const [request, setRequest] = useState(initialRequest);
  const [internalNote, setInternalNote] = useState('');
  
  const addActivityLog = (actor: string, action: string, details?: string) => {
    if (!request) return;
    const newLog: ActivityLogItem = {
      id: `log${request.activityLog.length + 1}_${request.id}`,
      timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      actor,
      action,
      details,
    };
    setRequest(prev => prev ? {...prev, activityLog: [newLog, ...prev.activityLog]} : undefined); // Add to beginning
  };


  if (!request) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8 bg-background">
            <ClipboardList className="w-20 h-20 text-destructive mb-6" />
            <h2 className="text-3xl font-semibold text-foreground mb-3">Service Request Not Found</h2>
            <p className="text-muted-foreground mb-8 text-lg">The request with ID "{requestId}" could not be found.</p>
            <Button asChild variant="outline" size="lg">
                <Link href="/landlord/service-requests">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Service Requests
                </Link>
            </Button>
        </div>
    );
  }
  
  const handleAssignWorker = (workerId?: string) => {
      if (!request) return;
      const worker = mockWorkersForAssignment.find(w => w.id === workerId);
      if(workerId && worker){
          setRequest(prev => prev ? {...prev, assignedWorker: {id: worker.id, name: worker.name, role: worker.name.split('(')[1].replace(')','').trim(), contact: '07XX XXX XXX'} } : undefined); // Extract role better if mock data changes
          addActivityLog('Landlord', `Worker ${worker.name} Assigned`);
          toast({title: "Worker Assigned", description: `${worker.name} has been assigned to SR ${request.requestId}.`});
      } else {
          setRequest(prev => prev ? {...prev, assignedWorker: undefined } : undefined);
          addActivityLog('Landlord', `Worker Unassigned`);
          toast({title: "Worker Unassigned", description: `Worker has been unassigned from SR ${request.requestId}.`, variant: "destructive"});
      }
  };
  const handleUpdateStatus = (newStatus: ServiceRequestDetail['currentStatus']) => {
     if (!request) return;
      setRequest(prev => prev ? {...prev, currentStatus: newStatus } : undefined);
      addActivityLog('Landlord', `Status Updated to ${newStatus}`);
      toast({title: "Status Updated", description: `SR ${request.requestId} status changed to ${newStatus}.`});
  };
  const handleAddInternalNote = () => {
      if (!request) return;
      if(internalNote.trim()){
        addActivityLog('Landlord', 'Internal Note Added', internalNote);
        toast({title: "Internal Note Added"});
        setInternalNote('');
      }
  };

  const getStatusColor = (status: ServiceRequestDetail['currentStatus']) => {
    switch(status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
        case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-300';
        case 'Completed': return 'bg-green-100 text-green-700 border-green-300';
        case 'Canceled': return 'bg-gray-100 text-gray-700 border-gray-300';
        default: return 'bg-muted text-muted-foreground';
    }
  }
   const getPriorityStyles = (priority?: 'Urgent' | 'Normal' | 'Low') => {
    switch (priority) {
      case 'Urgent': return { icon: <TriangleAlert className="mr-1 h-4 w-4 text-red-600" />, badgeClass: 'bg-red-100 text-red-700 border-red-500' };
      case 'Low': return { icon: <div className="mr-1 h-4 w-4" />, badgeClass: 'bg-blue-100 text-blue-700 border-blue-500' }; // No specific icon for low, just spacing
      default: return { icon: <div className="mr-1 h-4 w-4" />, badgeClass: 'bg-gray-100 text-gray-700 border-gray-400' }; // Normal
    }
  };
  const priorityStyles = getPriorityStyles(request.priority);


  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
            <Button variant="outline" size="sm" asChild className="mb-2">
                <Link href="/landlord/service-requests">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
                </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
                <ClipboardList className="mr-3 h-8 w-8 text-primary" />
                Service Request: {request.requestId}
            </h1>
            <div className="text-muted-foreground flex items-center gap-3 mt-1">
                <Badge variant="outline" className={`capitalize ${priorityStyles.badgeClass} flex items-center`}>
                    {priorityStyles.icon} Priority: {request.priority || 'Normal'}
                </Badge>
                <Badge variant="outline" className={`capitalize ${getStatusColor(request.currentStatus)}`}>
                    Status: {request.currentStatus}
                </Badge>
            </div>
        </div>
      </div>

    <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-md">
            <CardHeader><CardTitle>Request Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <p><strong className="text-muted-foreground flex items-center"><CalendarDays className="mr-2 h-4 w-4"/>Submitted:</strong> {request.dateSubmitted}</p>
                <Separator/>
                <p><strong className="text-muted-foreground flex items-center"><User className="mr-2 h-4 w-4"/>Tenant:</strong> <Link href={`/landlord/tenants/${request.tenantId}`} className="text-primary hover:underline">{request.tenantName}</Link> (<Phone className="inline h-3 w-3 mr-1"/>{request.tenantPhone})</p>
                <p><strong className="text-muted-foreground flex items-center"><Building className="mr-2 h-4 w-4"/>Property:</strong> <Link href={`/landlord/apartments/${request.apartmentId}`} className="text-primary hover:underline">{request.apartmentName}</Link> - Unit <Link href={`/landlord/apartments/${request.apartmentId}/units/${request.unitId}`} className="text-primary hover:underline">{request.unitName}</Link>, Room {request.roomNumber}</p>
                {request.locationOfIssue && <p><strong className="text-muted-foreground">Specific Location:</strong> {request.locationOfIssue}</p>}
                <Separator/>
                <p className="font-semibold text-lg">Issue Description:</p>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{request.fullDescription}</p>
                
                {request.attachedMedia.length > 0 && (
                    <>
                        <Separator/>
                        <p className="font-semibold text-lg">Attached Media:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {request.attachedMedia.map((media, index) => (
                                <a key={index} href={media.url} target="_blank" rel="noopener noreferrer" className="block border rounded-lg overflow-hidden hover:opacity-80 transition-opacity shadow-sm hover:shadow-md">
                                    {media.type === 'image' ? (
                                        <Image src={media.url} alt={media.name} width={150} height={100} className="object-cover w-full h-32" data-ai-hint="repair evidence"/>
                                    ) : (
                                        <div className="p-2 text-center bg-muted h-32 flex flex-col justify-center items-center">
                                            <Paperclip className="h-10 w-10 text-muted-foreground"/>
                                            <p className="text-xs truncate mt-1 font-medium">{media.name}</p>
                                        </div>
                                    )}
                                </a>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>

        <div className="md:col-span-1 space-y-6">
            <Card className="shadow-md">
                <CardHeader><CardTitle className="flex items-center"><UserCog className="mr-2 h-5 w-5"/>Worker Assignment</CardTitle></CardHeader>
                <CardContent>
                    {request.assignedWorker ? (
                        <div className="space-y-1.5 text-sm">
                            <p><strong className="text-muted-foreground">Name:</strong> <Link href={`/landlord/workers/${request.assignedWorker.id}`} className="text-primary hover:underline">{request.assignedWorker.name}</Link></p>
                            <p><strong className="text-muted-foreground">Role:</strong> {request.assignedWorker.role}</p>
                            <p><strong className="text-muted-foreground">Contact:</strong> {request.assignedWorker.contact}</p>
                        </div>
                    ) : <p className="italic text-muted-foreground">No worker assigned yet.</p>}
                </CardContent>
                <CardFooter>
                    <Select onValueChange={(value) => handleAssignWorker(value === "unassign" ? undefined : value)} defaultValue={request.assignedWorker?.id}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Assign/Reassign Worker..." /></SelectTrigger>
                        <SelectContent>
                            {request.assignedWorker && <SelectItem value="unassign" className="text-destructive">Unassign Current Worker</SelectItem>}
                            {mockWorkersForAssignment.map(w => <SelectItem key={w.id} value={w.id} disabled={w.availability === 'Busy'}>{w.name} ({w.availability})</SelectItem>)}
                        </SelectContent>
                    </Select>
                </CardFooter>
            </Card>

             <Card className="shadow-md">
                <CardHeader><CardTitle className="flex items-center"><Edit3 className="mr-2 h-5 w-5"/>Update Status</CardTitle></CardHeader>
                <CardContent>
                    <Select onValueChange={(value) => handleUpdateStatus(value as ServiceRequestDetail['currentStatus'])} defaultValue={request.currentStatus}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Change status..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Canceled">Canceled by Landlord</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card className="shadow-md">
                <CardHeader><CardTitle className="flex items-center"><MessageSquare className="mr-2 h-5 w-5"/>Communication</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                        <Link href={`/landlord/notifications/send?recipientType=specific_tenants&recipientIds=${request.tenantId}&subject=Regarding Request ${request.requestId}`}>
                           <Mail className="mr-2 h-4 w-4"/> Contact Tenant
                        </Link>
                    </Button>
                     {request.assignedWorker && (
                        <Button variant="outline" className="w-full" asChild>
                           <Link href={`/landlord/notifications/send?recipientType=specific_workers&recipientIds=${request.assignedWorker.id}&subject=Regarding Request ${request.requestId}`}>
                                <Mail className="mr-2 h-4 w-4"/> Contact Worker
                           </Link>
                        </Button>
                     )}
                </CardContent>
            </Card>
        </div>
    </div>
    
    <Card className="shadow-lg">
        <CardHeader><CardTitle className="flex items-center"><Clock className="mr-2 h-5 w-5"/>Activity Log</CardTitle></CardHeader>
        <CardContent>
            {request.activityLog.length > 0 ? (
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                    {request.activityLog.map(log => (
                        <li key={log.id} className={`text-sm border-l-4 pl-4 py-2 rounded-r-md ${
                            log.actor.toLowerCase().includes('system') ? 'border-blue-500 bg-blue-50' :
                            log.actor.toLowerCase().includes('tenant') ? 'border-green-500 bg-green-50' :
                            log.actor.toLowerCase().includes('landlord') ? 'border-purple-500 bg-purple-50' :
                            log.actor.toLowerCase().includes('worker') ? 'border-orange-500 bg-orange-50' :
                            'border-gray-300 bg-gray-50'
                        }`}>
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-foreground">{log.action}</p>
                                <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">By: {log.actor}</p>
                            {log.details && <p className="text-xs italic text-muted-foreground/90 mt-1 bg-white p-2 rounded border border-dashed">{log.details}</p>}
                        </li>
                    ))}
                </ul>
            ) : <p className="text-muted-foreground text-center py-4">No activity recorded yet.</p>}
        </CardContent>
    </Card>

    <Card className="shadow-lg">
        <CardHeader><CardTitle>Internal Notes (Visible to Landlord Only)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
            <Textarea 
                placeholder="Add internal notes, observations, or follow-up actions..." 
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                rows={3}
            />
            <Button onClick={handleAddInternalNote} disabled={!internalNote.trim()}>Add Note</Button>
             <div className="mt-4 text-sm text-muted-foreground italic">
                Existing internal notes would be displayed here (if any).
             </div>
        </CardContent>
    </Card>

    </div>
  );
}
