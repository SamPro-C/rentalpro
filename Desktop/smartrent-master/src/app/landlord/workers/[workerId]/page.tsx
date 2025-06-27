
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Briefcase, User, Contact, Building, Clock, CalendarDays, Edit3, Trash2, MessageSquare, ListChecks, History, ShieldAlert, UserCheck, UserX } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';


export interface AssignedTask {
  id: string;
  taskId: string;
  dateAssigned: string;
  description: string;
  apartmentUnit: string;
  tenantName?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dateCompleted?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  hoursWorked?: string;
  location?: string;
}

export interface WorkerProfile {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  nationalId: string;
  role: string;
  mockSalary?: number;
  assignedApartments: Array<{id: string, name: string}>;
  workingHours: string; // e.g., "09:00 - 17:00, Mon-Fri"
  status: 'Active' | 'Inactive';
  emergencyContactName: string;
  emergencyContactPhone: string;
  assignedTasksHistory: AssignedTask[];
  attendanceHistory: AttendanceRecord[]; 
}

const mockWorkerProfiles: WorkerProfile[] = [
  {
    id: 'worker001',
    fullName: 'Mark Lee',
    email: 'mark.lee@example.com',
    phone: '0755112233',
    nationalId: '87654321',
    role: 'Plumber',
    mockSalary: 45000,
    assignedApartments: [
      { id: 'apt101', name: 'Greenwood Heights' },
      { id: 'apt202', name: 'Riverside Towers' },
    ],
    workingHours: '09:00 - 17:00, Mon, Tue, Wed, Thu, Fri',
    status: 'Active',
    emergencyContactName: 'Mary Lee (Wife)',
    emergencyContactPhone: '0755998877',
    assignedTasksHistory: [
      { id: 't1', taskId: 'TSK001', dateAssigned: '2024-05-15', description: 'Fix leaking pipe in Unit A-101', apartmentUnit: 'Greenwood Heights, A-101', tenantName: 'John Doe', status: 'Completed', dateCompleted: '2024-05-16' },
      { id: 't2', taskId: 'TSK008', dateAssigned: '2024-06-01', description: 'Unblock drainage in Unit B-203', apartmentUnit: 'Riverside Towers, R-10', tenantName: 'Alice Brown', status: 'In Progress' },
    ],
    attendanceHistory: [
      { id: 'att1', date: '2024-06-03', checkInTime: '09:02', checkOutTime: '17:05', hoursWorked: '8h 3m', location: 'Greenwood Heights'},
      { id: 'att2', date: '2024-06-04', checkInTime: '08:55', checkOutTime: '16:58', hoursWorked: '8h 3m', location: 'Riverside Towers'},
    ],
  },
  {
    id: 'worker002',
    fullName: 'Sarah Kim',
    email: 'sarah.kim@example.com',
    phone: '0766223344',
    nationalId: '11223344',
    role: 'Electrician',
    mockSalary: 55000,
    assignedApartments: [ { id: 'apt101', name: 'Greenwood Heights' }],
    workingHours: '08:00 - 16:00, Mon-Sat',
    status: 'Active',
    emergencyContactName: 'Ken Kim (Brother)',
    emergencyContactPhone: '0766001122',
    assignedTasksHistory: [
      { id: 't3', taskId: 'TSK010', dateAssigned: '2024-06-05', description: 'Repair faulty wiring in common area', apartmentUnit: 'Greenwood Heights, Common Area', status: 'Pending' },
    ],
    attendanceHistory: [],
  },
  {
    id: 'worker004',
    fullName: 'James Oloo',
    email: 'james.oloo@example.com',
    phone: '0744XXXYYY',
    nationalId: '44556677',
    role: 'Handyman/Pest Control',
    mockSalary: 38000,
    assignedApartments: [ { id: 'apt101', name: 'Greenwood Heights' } ],
    workingHours: '09:00 - 17:00, Mon-Fri',
    status: 'Active',
    emergencyContactName: 'Grace Oloo',
    emergencyContactPhone: '0744ABCDEF',
    assignedTasksHistory: [
        {id: 't4', taskId: 'SR005', dateAssigned: '2024-06-03', description: 'Pest control needed for ants...', apartmentUnit: 'Greenwood Heights, A-102', tenantName: 'Jane Smith', status: 'In Progress'},
    ],
    attendanceHistory: []
  }
];

export default function WorkerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const workerId = params.workerId as string;
  const { toast } = useToast();
  
  const initialWorker = mockWorkerProfiles.find(w => w.id === workerId);
  const [worker, setWorker] = useState(initialWorker);


  if (!worker) {
     return (
        <div className="flex flex-col items-center justify-center h-full p-8">
            <Briefcase className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-muted-foreground mb-2">Worker Not Found</h2>
            <p className="text-muted-foreground mb-6">The worker with ID "{workerId}" could not be found.</p>
            <Button asChild variant="outline">
                <Link href="/landlord/workers">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Worker List
                </Link>
            </Button>
        </div>
    );
  }

  const handleEditInfo = () => {
      toast({ title: "Edit Worker", description: `Opening form to edit ${worker.fullName}.`});
      router.push(`/landlord/workers/edit/${worker.id}`); // Assuming an edit page
  };
  const handleToggleStatus = () => {
      const newStatus = worker.status === 'Active' ? 'Inactive' : 'Active';
      if(window.confirm(`Are you sure you want to mark ${worker.fullName} as ${newStatus}?`)) {
        setWorker(prev => prev ? {...prev, status: newStatus} : undefined); 
        toast({ title: "Worker Status Updated", description: `${worker.fullName} is now ${newStatus}.` });
      }
  };
  const handleSendNotification = () => {
      router.push(`/landlord/notifications/send?recipientType=specific_workers&recipientIds=${worker.id}&subject=Regarding your work`);
  };
  const handleAssignTask = () => {
      toast({ title: "Assign Task", description: `Opening task assignment interface for ${worker.fullName}.` });
      // TODO: Implement task assignment modal/page navigation
      // Example: router.push(`/landlord/tasks/new?workerId=${worker.id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
            <Button variant="outline" size="sm" asChild className="mb-2">
                <Link href="/landlord/workers">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workers
                </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
                <User className="mr-3 h-8 w-8 text-primary" />
                {worker.fullName} <Badge variant={worker.status === 'Active' ? 'default' : 'destructive'} className={`ml-3 ${worker.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{worker.status}</Badge>
            </h1>
            <p className="text-muted-foreground">Worker ID: {worker.id} | Role: {worker.role}</p>
        </div>
        <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleEditInfo}><Edit3 className="mr-2 h-4 w-4"/>Edit Info</Button>
            <Button variant={worker.status === 'Active' ? "destructive" : "default"} onClick={handleToggleStatus}>
                {worker.status === 'Active' ? <UserX className="mr-2 h-4 w-4"/> : <UserCheck className="mr-2 h-4 w-4"/>}
                {worker.status === 'Active' ? 'Deactivate' : 'Activate'} Worker
            </Button>
             <Button onClick={handleSendNotification}><MessageSquare className="mr-2 h-4 w-4"/>Send Notification</Button>
            <Button onClick={handleAssignTask} className="bg-accent text-accent-foreground hover:bg-accent/90"><ListChecks className="mr-2 h-4 w-4"/>Assign Task</Button>
        </div>
      </div>

    <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
            <CardHeader><CardTitle>Contact & Personal</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
                <p><strong className="text-muted-foreground">Email:</strong> {worker.email || <span className="italic">Not provided</span>}</p>
                <p><strong className="text-muted-foreground">Phone:</strong> {worker.phone}</p>
                <p><strong className="text-muted-foreground">National ID:</strong> {worker.nationalId}</p>
                <Separator className="my-2" />
                <p className="font-semibold">Emergency Contact:</p>
                <p><strong className="text-muted-foreground">Name:</strong> {worker.emergencyContactName}</p>
                <p><strong className="text-muted-foreground">Phone:</strong> {worker.emergencyContactPhone}</p>
            </CardContent>
        </Card>
        <Card className="md:col-span-2 shadow-md">
            <CardHeader><CardTitle>Assignments & Schedule</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
                <p><strong className="text-muted-foreground">Assigned Apartments:</strong></p>
                {worker.assignedApartments.length > 0 ? (
                    <ul className="list-disc list-inside ml-4">
                        {worker.assignedApartments.map(apt => <li key={apt.id}><Link href={`/landlord/apartments/${apt.id}`} className="text-primary hover:underline">{apt.name}</Link></li>)}
                    </ul>
                ) : <p className="italic text-muted-foreground">None</p>}
                <Separator className="my-2" />
                <p><strong className="text-muted-foreground">Working Hours:</strong> {worker.workingHours}</p>
            </CardContent>
        </Card>
    </div>

    <Card className="shadow-lg">
        <CardHeader><CardTitle>Assigned Tasks History</CardTitle></CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Task ID</TableHead>
                        <TableHead>Assigned</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Apartment/Unit</TableHead>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Completed</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {worker.assignedTasksHistory.map(task => (
                        <TableRow key={task.id}>
                            <TableCell className="font-mono text-xs">{task.taskId}</TableCell>
                            <TableCell>{task.dateAssigned}</TableCell>
                            <TableCell className="max-w-xs truncate">{task.description}</TableCell>
                            <TableCell>{task.apartmentUnit}</TableCell>
                            <TableCell>{task.tenantName || '-'}</TableCell>
                            <TableCell>
                                <Badge variant={task.status === 'Completed' ? 'default' : (task.status === 'Pending' ? 'secondary' : 'outline')}
                                 className={task.status === 'Completed' ? 'bg-green-100 text-green-700' : (task.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : (task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : ''))}
                                >{task.status}</Badge>
                            </TableCell>
                            <TableCell>{task.dateCompleted || '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
             {worker.assignedTasksHistory.length === 0 && <p className="text-muted-foreground text-center py-4">No tasks assigned to this worker yet.</p>}
        </CardContent>
    </Card>

    <Card className="shadow-lg">
        <CardHeader><CardTitle className="flex items-center"><History className="mr-2 h-5 w-5"/>Attendance History (If Enabled)</CardTitle></CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Check-in Time</TableHead>
                        <TableHead>Check-out Time</TableHead>
                        <TableHead>Hours Worked</TableHead>
                        <TableHead>Location (Details)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {worker.attendanceHistory.map(att => (
                        <TableRow key={att.id}>
                            <TableCell>{att.date}</TableCell>
                            <TableCell>{att.checkInTime || '-'}</TableCell>
                            <TableCell>{att.checkOutTime || '-'}</TableCell>
                            <TableCell>{att.hoursWorked || '-'}</TableCell>
                            <TableCell>{att.location || '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {worker.attendanceHistory.length === 0 && <p className="text-muted-foreground text-center py-4">No attendance records found for this worker.</p>}
        </CardContent>
    </Card>

    </div>
  );
}

export { mockWorkerProfiles };

