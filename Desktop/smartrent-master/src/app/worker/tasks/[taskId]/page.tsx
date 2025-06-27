
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ListChecks, CalendarDays, Building, User, Clock, Paperclip, Edit3, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; 
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import NextImage from 'next/image'; 
import { mockWorkerProfiles } from '@/app/landlord/workers/[workerId]/page';
import { mockServiceRequestDetailsList } from '@/app/landlord/service-requests/[requestId]/page'; 
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const currentWorker = mockWorkerProfiles.find(w => w.id === 'worker001');

export default function WorkerTaskDetailsPage() {
  const params = useParams();
  const router = useRouter(); 
  const taskId = params.taskId as string;
  const { toast } = useToast();
  const [completionNote, setCompletionNote] = useState('');

  const task = currentWorker?.assignedTasksHistory.find(t => t.taskId === taskId);
  const serviceRequestDetails = mockServiceRequestDetailsList.find(sr => sr.requestId === taskId); 


  if (!currentWorker) {
    return <div className="text-center text-destructive p-8">Error: Could not load worker data.</div>;
  }
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <ListChecks className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-muted-foreground mb-2">Task Not Found</h2>
        <p className="text-muted-foreground mb-6">The task with ID "{taskId}" could not be found in your assignments.</p>
        <Button asChild variant="outline">
          <Link href="/worker/tasks"><ArrowLeft className="mr-2 h-4 w-4" /> Back to My Tasks</Link>
        </Button>
      </div>
    );
  }

  const handleUpdateStatus = (newStatus: 'Pending' | 'In Progress' | 'Completed') => {
      console.log(`Updating task ${task.taskId} to ${newStatus}. Completion Note: ${completionNote}`);
      
      if (newStatus === 'Completed' && completionNote.trim() === '') {
        toast({title: "Note Required", description: "Please add a completion note before marking as completed.", variant: "destructive"});
        return;
      }
      toast({title: "Task Status Updated", description: `Task ${task.taskId} marked as ${newStatus}. Landlord and tenant (if applicable) will be notified.`});
      // In a real app, update mockWorkerProfiles or local state for tasks
      // For demo, we'll just log and show toast.
  };

  const handleReportIssue = () => {
      toast({title: "Report Issue", description: `Reporting issue for task ${task.taskId}.`});
      router.push(`/worker/report-issue?taskId=${task.taskId}`);
  };
  
  const handleContactLandlord = () => {
    toast({ title: "Contact Landlord", description: "Initiating contact with landlord regarding this task. This feature is not fully implemented." });
  };

  const handleContactTenant = () => {
    toast({ title: "Contact Tenant", description: "Initiating contact with tenant regarding this task. Please coordinate through landlord for direct contact." });
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link href="/worker/tasks"><ArrowLeft className="mr-2 h-4 w-4" /> Back to My Tasks</Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
            <ListChecks className="mr-3 h-8 w-8 text-primary" />
            Task: {task.taskId}
          </h1>
           <Badge variant={task.status === 'Completed' ? 'default' : (task.status === 'Pending' ? 'secondary' : 'outline')}
                    className={`mt-1 capitalize ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : ''
                    }`}>
                Status: {task.status}
            </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-md">
          <CardHeader><CardTitle>Task Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p><strong className="text-muted-foreground flex items-center"><CalendarDays className="mr-2 h-4 w-4"/>Assigned:</strong> {task.dateAssigned}</p>
            {task.dateCompleted && <p><strong className="text-muted-foreground flex items-center"><CalendarDays className="mr-2 h-4 w-4"/>Completed:</strong> {task.dateCompleted}</p>}
            <Separator/>
            <p><strong className="text-muted-foreground flex items-center"><Building className="mr-2 h-4 w-4"/>Location:</strong> {task.apartmentUnit}</p>
            {task.tenantName && <p><strong className="text-muted-foreground flex items-center"><User className="mr-2 h-4 w-4"/>Associated Tenant:</strong> {task.tenantName}</p>}
            <Separator/>
            <p className="font-semibold">Description:</p>
            <p className="text-foreground whitespace-pre-wrap">{task.description}</p>
            
            {serviceRequestDetails?.attachedMedia && serviceRequestDetails.attachedMedia.length > 0 && (
                <>
                    <Separator/>
                    <p className="font-semibold">Attached Media (from Tenant Request):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {serviceRequestDetails.attachedMedia.map((media, index) => (
                            <a key={index} href={media.url} target="_blank" rel="noopener noreferrer" className="block border rounded-md overflow-hidden hover:opacity-80 transition-opacity">
                                {media.type === 'image' ? (
                                    <NextImage src={media.url} alt={media.name} width={150} height={100} className="object-cover w-full h-24" data-ai-hint="task evidence"/>
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

        <div className="md:col-span-1 space-y-6">
            <Card className="shadow-md">
                <CardHeader><CardTitle className="flex items-center"><Edit3 className="mr-2 h-5 w-5"/>Update Task Status</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    {task.status === 'Pending' && (
                         <Button onClick={() => handleUpdateStatus('In Progress')} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Mark as In Progress</Button>
                    )}
                    {task.status === 'In Progress' && (
                        <>
                        <Textarea 
                            placeholder="Add a completion note (e.g., 'Replaced faulty valve. Tested, no leaks.') Required for completion." 
                            value={completionNote}
                            onChange={(e) => setCompletionNote(e.target.value)}
                            rows={3}
                        />
                        <Button onClick={() => handleUpdateStatus('Completed')} className="w-full bg-green-600 hover:bg-green-700 text-white">Mark as Completed</Button>
                        </>
                    )}
                    {task.status === 'Completed' && (
                        <p className="text-sm text-green-700 font-medium">This task has been completed.</p>
                    )}
                     <Button variant="outline" onClick={handleReportIssue} className="w-full mt-2">Report Issue with this Task</Button>
                </CardContent>
            </Card>
             <Card className="shadow-md">
                <CardHeader><CardTitle className="flex items-center"><MessageSquare className="mr-2 h-5 w-5"/>Communication</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full" onClick={handleContactLandlord}>
                       <MessageSquare className="mr-2 h-4 w-4"/> Contact Landlord
                    </Button>
                     {task.tenantName && (
                        <Button variant="outline" className="w-full" onClick={handleContactTenant}>
                           <MessageSquare className="mr-2 h-4 w-4"/> Contact Tenant
                        </Button>
                     )}
                </CardContent>
            </Card>
        </div>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader><CardTitle className="flex items-center"><Clock className="mr-2 h-5 w-5"/>Task Activity Log</CardTitle></CardHeader>
        <CardContent>
             <p className="text-muted-foreground text-center py-4">
                A detailed activity log for this task, including status changes, notes from landlord, and completion details, would appear here.
             </p>
        </CardContent>
      </Card>
    </div>
  );
}

