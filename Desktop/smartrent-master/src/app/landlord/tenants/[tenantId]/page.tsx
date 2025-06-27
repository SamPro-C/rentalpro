
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, User, Home, Building, Contact, CalendarDays, DollarSign, FileText, MessageSquare, Edit3, Trash2, ShieldAlert, Eye } from 'lucide-react';
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

interface PaymentHistoryItem {
  id: string;
  monthYear: string;
  amountDue: number;
  amountPaid: number;
  paymentDate: string;
  method: string;
  transactionId?: string;
  status: 'Paid' | 'Unpaid' | 'Partial';
}

interface ServiceRequestItem {
  id: string;
  requestId: string;
  dateSubmitted: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Resolved' | 'Canceled';
  workerAssigned?: string;
}

export interface TenantProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  apartmentId: string; 
  apartmentName: string;
  unitId: string; 
  unitName: string;
  roomId: string; 
  roomNumber: string;
  moveInDate: string;
  monthlyRent: number;
  securityDeposit: number;
  leaseStartDate: string;
  leaseEndDate?: string;
  paymentHistory: PaymentHistoryItem[];
  serviceRequestHistory: ServiceRequestItem[];
}

const mockTenantProfiles: TenantProfile[] = [
  {
    id: 'tenant001',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '0712345678',
    nationalId: '12345678',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    emergencyContactName: 'Jane Doe (Spouse)',
    emergencyContactPhone: '0798765432',
    apartmentId: 'apt101',
    apartmentName: 'Greenwood Heights',
    unitId: 'unitA101',
    unitName: 'A-101',
    roomId: 'r1',
    roomNumber: '1',
    moveInDate: '2023-01-15',
    monthlyRent: 25000,
    securityDeposit: 25000,
    leaseStartDate: '2023-01-15',
    leaseEndDate: '2024-01-14',
    paymentHistory: [
      { id: 'p1', monthYear: 'May 2024', amountDue: 25000, amountPaid: 25000, paymentDate: '2024-05-03', method: 'M-Pesa', transactionId: 'SFE123ABC4', status: 'Paid' },
      { id: 'p2', monthYear: 'April 2024', amountDue: 25000, amountPaid: 25000, paymentDate: '2024-04-05', method: 'Card', status: 'Paid' },
      { id: 'p3', monthYear: 'June 2024', amountDue: 25000, amountPaid: 0, paymentDate: '-', method: '-', status: 'Unpaid' },
    ],
    serviceRequestHistory: [
      { id: 'sr1', requestId: 'SR001', dateSubmitted: '2024-03-10', description: 'Leaking kitchen tap', status: 'Completed', workerAssigned: 'Mark Lee' },
      { id: 'sr2', requestId: 'SR005', dateSubmitted: '2024-05-20', description: 'Broken window latch', status: 'Pending' },
    ],
  },
   {
    id: 'tenant002',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '0723456789',
    nationalId: '87654321',
    dateOfBirth: '1988-11-22',
    gender: 'Female',
    emergencyContactName: 'Robert Smith (Brother)',
    emergencyContactPhone: '0787654321',
    apartmentId: 'apt101',
    apartmentName: 'Greenwood Heights',
    unitId: 'unitA102',
    unitName: 'A-102',
    roomId: 'r3',
    roomNumber: 'Main',
    moveInDate: '2022-08-01',
    monthlyRent: 30000,
    securityDeposit: 30000,
    leaseStartDate: '2022-08-01',
    leaseEndDate: '2024-07-31',
    paymentHistory: [
      { id: 'p4', monthYear: 'June 2024', amountDue: 30000, amountPaid: 15000, paymentDate: '2024-06-04', method: 'Bank Transfer', transactionId: 'BTX9876', status: 'Partial' },
    ],
    serviceRequestHistory: [],
  },
];


export default function TenantProfilePage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.tenantId as string;
  const { toast } = useToast();

  const tenant = mockTenantProfiles.find(t => t.id === tenantId); 

  if (!tenant) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8">
            <Users className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-muted-foreground mb-2">Tenant Not Found</h2>
            <p className="text-muted-foreground mb-6">The tenant with ID "{tenantId}" could not be found.</p>
            <Button asChild variant="outline">
                <Link href="/landlord/tenants">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tenant List
                </Link>
            </Button>
        </div>
    );
  }

  const handleEditInfo = () => {
    toast({ title: "Edit Tenant", description: `Initiating edit for ${tenant.fullName}.`});
    router.push(`/landlord/tenants/edit/${tenant.id}`); // Assuming an edit page exists
  };
  const handleDeleteTenant = () => {
      if(window.confirm(`Are you sure you want to delete tenant ${tenant.fullName}? This action is permanent and will mark their room as vacant.`)) {
        console.log("Delete tenant info:", tenant.id);
        toast({ title: "Tenant Deleted", description: `${tenant.fullName} has been removed from the system.`, variant: "destructive"});
         // TODO: Implement actual deletion logic and state update
      }
  };
  const handleAddManualPayment = () => {
    router.push(`/landlord/payments/manual?tenantId=${tenant.id}`);
  };
  const handleSendNotification = () => {
    router.push(`/landlord/notifications/send?recipientType=specific_tenants&recipientIds=${tenant.id}&subject=Regarding your tenancy`);
  };
  const handleMarkPaymentStatus = (status: 'Paid' | 'Unpaid') => {
    if(window.confirm(`Are you sure you want to mark current month's rent as ${status} for ${tenant.fullName}? This will be logged.`)) {
        console.log(`Marking current month as ${status} for tenant:`, tenant.id);
        toast({ title: "Payment Status Updated", description: `Current month for ${tenant.fullName} marked as ${status}. Payment record will be generated.` });
        // TODO: Implement actual status update and potentially generate a payment record
    }
  };
  const handleViewLease = () => {
    toast({title: "View Lease Agreement", description: "The lease document would be displayed here. This feature is planned for a future update."})
  }


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
            <Button variant="outline" size="sm" asChild className="mb-2">
                <Link href="/landlord/tenants">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tenants
                </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
                <User className="mr-3 h-8 w-8 text-primary" />
                {tenant.fullName}
            </h1>
            <p className="text-muted-foreground">Tenant ID: {tenant.id}</p>
        </div>
        <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleEditInfo}><Edit3 className="mr-2 h-4 w-4"/>Edit Info</Button>
            <Button variant="destructive" onClick={handleDeleteTenant}><Trash2 className="mr-2 h-4 w-4"/>Delete Tenant</Button>
            <Button onClick={handleAddManualPayment}><DollarSign className="mr-2 h-4 w-4"/>Add Manual Payment</Button>
            <Button onClick={handleSendNotification}><MessageSquare className="mr-2 h-4 w-4"/>Send Notification</Button>
        </div>
      </div>

    <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
            <CardHeader><CardTitle>Contact & Personal</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
                <p><strong className="text-muted-foreground">Email:</strong> {tenant.email}</p>
                <p><strong className="text-muted-foreground">Phone:</strong> {tenant.phone}</p>
                <p><strong className="text-muted-foreground">National ID:</strong> {tenant.nationalId}</p>
                <p><strong className="text-muted-foreground">Date of Birth:</strong> {tenant.dateOfBirth}</p>
                <p><strong className="text-muted-foreground">Gender:</strong> <span className="capitalize">{tenant.gender}</span></p>
                <Separator className="my-2" />
                <p className="font-semibold">Emergency Contact:</p>
                <p><strong className="text-muted-foreground">Name:</strong> {tenant.emergencyContactName}</p>
                <p><strong className="text-muted-foreground">Phone:</strong> {tenant.emergencyContactPhone}</p>
            </CardContent>
        </Card>
        <Card className="md:col-span-2 shadow-md">
            <CardHeader><CardTitle>Residence & Lease</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
                <p><strong className="text-muted-foreground">Apartment:</strong> <Link href={`/landlord/apartments/${tenant.apartmentId}`} className="text-primary hover:underline">{tenant.apartmentName}</Link></p>
                <p><strong className="text-muted-foreground">Unit:</strong> <Link href={`/landlord/apartments/${tenant.apartmentId}/units/${tenant.unitId}`} className="text-primary hover:underline">{tenant.unitName}</Link></p>
                <p><strong className="text-muted-foreground">Room:</strong> {tenant.roomNumber}</p>
                <Separator className="my-2" />
                <p><strong className="text-muted-foreground">Move-in Date:</strong> {tenant.moveInDate}</p>
                <p><strong className="text-muted-foreground">Monthly Rent:</strong> KES {tenant.monthlyRent.toLocaleString()}</p>
                <p><strong className="text-muted-foreground">Security Deposit:</strong> KES {tenant.securityDeposit.toLocaleString()}</p>
                <p><strong className="text-muted-foreground">Lease Start:</strong> {tenant.leaseStartDate}</p>
                <p><strong className="text-muted-foreground">Lease End:</strong> {tenant.leaseEndDate || 'N/A (Month-to-Month)'}</p>
                 <div className="pt-2">
                    <Button variant="outline" size="sm" onClick={handleViewLease}><FileText className="mr-2 h-4 w-4"/>View Lease Agreement</Button>
                 </div>
            </CardContent>
        </Card>
    </div>

    <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Payment History</CardTitle>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleMarkPaymentStatus('Paid')}>Mark Current as Paid</Button>
                <Button variant="outline" size="sm" onClick={() => handleMarkPaymentStatus('Unpaid')} className="border-destructive text-destructive hover:bg-destructive/10">Mark Current as Unpaid</Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Month/Year</TableHead>
                        <TableHead>Amount Due</TableHead>
                        <TableHead>Amount Paid</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tenant.paymentHistory.map(p => (
                        <TableRow key={p.id}>
                            <TableCell>{p.monthYear}</TableCell>
                            <TableCell>KES {p.amountDue.toLocaleString()}</TableCell>
                            <TableCell>KES {p.amountPaid.toLocaleString()}</TableCell>
                            <TableCell>{p.paymentDate}</TableCell>
                            <TableCell>{p.method}</TableCell>
                            <TableCell>{p.transactionId || '-'}</TableCell>
                            <TableCell>
                                <Badge variant={p.status === 'Paid' ? 'default' : (p.status === 'Unpaid' ? 'destructive' : 'secondary')}
                                       className={p.status === 'Paid' ? 'bg-green-100 text-green-700' : p.status === 'Unpaid' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}>
                                    {p.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
             {tenant.paymentHistory.length === 0 && <p className="text-muted-foreground text-center py-4">No payment history found.</p>}
        </CardContent>
    </Card>

    <Card className="shadow-lg">
        <CardHeader><CardTitle>Service Request History</CardTitle></CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Date Submitted</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Worker Assigned</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tenant.serviceRequestHistory.map(sr => (
                        <TableRow key={sr.id}>
                            <TableCell>{sr.requestId}</TableCell>
                            <TableCell>{sr.dateSubmitted}</TableCell>
                            <TableCell className="max-w-xs truncate">{sr.description}</TableCell>
                            <TableCell>{sr.workerAssigned || <span className="italic text-muted-foreground">None</span>}</TableCell>
                            <TableCell>
                                <Badge variant={sr.status === 'Completed' || sr.status === 'Resolved' ? 'default' : (sr.status === 'Pending' ? 'secondary' : 'outline')}
                                 className={sr.status === 'Completed' || sr.status === 'Resolved' ? 'bg-green-100 text-green-700' : (sr.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : '')}
                                >{sr.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/landlord/service-requests/${sr.requestId}`}><Eye className="mr-1 h-4 w-4"/>View Details</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {tenant.serviceRequestHistory.length === 0 && <p className="text-muted-foreground text-center py-4">No service request history found for this tenant.</p>}
        </CardContent>
    </Card>

    </div>
  );
}
export { mockTenantProfiles };

