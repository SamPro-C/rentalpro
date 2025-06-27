
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList, Eye, Search, Filter, Users, Building, UserCog, MessageSquare, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockServiceRequestDetailsList } from '@/lib/mock-data'; // Using centralized mock data
import { mockWorkerProfiles, mockApartmentList as mockApartments } from '@/lib/mock-data';


interface ServiceRequestListItem {
  id: string; 
  requestId: string; 
  dateSubmitted: string; // Just date part for list
  tenantName: string;
  tenantId: string;
  apartmentName: string;
  unitName: string;
  roomNumber?: string; 
  description: string; // Summary
  status: 'Pending' | 'In Progress' | 'Completed' | 'Canceled';
  workerAssigned?: string; 
  priority?: 'Urgent' | 'Normal' | 'Low';
}

const serviceRequestsForList: ServiceRequestListItem[] = mockServiceRequestDetailsList.map(detail => ({
    id: detail.id,
    requestId: detail.requestId,
    dateSubmitted: detail.dateSubmitted.split(' ')[0],
    tenantName: detail.tenantName,
    tenantId: detail.tenantId,
    apartmentName: detail.apartmentName,
    unitName: detail.unitName,
    roomNumber: detail.roomNumber,
    description: detail.fullDescription.substring(0, 50) + (detail.fullDescription.length > 50 ? '...' : ''),
    status: detail.currentStatus,
    workerAssigned: detail.assignedWorker?.name,
    priority: detail.priority,
}));


const statusesForFilter = ['all', 'Pending', 'In Progress', 'Completed', 'Canceled'];
const prioritiesForFilter = ['all', 'Urgent', 'Normal', 'Low'];
const apartmentNamesForFilter = ['all', ...new Set(mockApartments.map(a => a.name))]; 
const workerNamesForFilter = ['all', 'Unassigned', ...new Set(mockWorkerProfiles.map(w => w.fullName))]; 


export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequestListItem[]>(serviceRequestsForList);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterApartment, setFilterApartment] = useState('all');
  const [filterWorker, setFilterWorker] = useState('all');
  const { toast } = useToast();


  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
        const matchesSearch = req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              req.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              req.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              req.apartmentName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
        const matchesPriority = filterPriority === 'all' || (req.priority || 'Normal') === filterPriority;
        const matchesApartment = filterApartment === 'all' || req.apartmentName === filterApartment;
        const matchesWorker = filterWorker === 'all' || 
                              (filterWorker === 'Unassigned' && !req.workerAssigned) || 
                              (req.workerAssigned && req.workerAssigned.toLowerCase().includes(filterWorker.toLowerCase()));
        return matchesSearch && matchesStatus && matchesPriority && matchesApartment && matchesWorker;
    });
  },[requests, searchTerm, filterStatus, filterPriority, filterApartment, filterWorker]);

  const handleAssignWorker = (requestId: string) => {
      console.log('Assign worker to service request:', requestId);
      toast({ title: "Action: Assign Worker", description: `Modal to assign worker to SR ${requestId} would open.` });
      // Actual modal logic here, then update local state
      // For demo: setRequests(prev => prev.map(r => r.requestId === requestId ? {...r, workerAssigned: "Mock Worker Assigned", status: "In Progress"} : r));
  };
  const handleChangeStatus = (requestId: string) => {
      console.log('Change status for service request:', requestId);
      toast({ title: "Action: Change Status", description: `Modal/dropdown to change status for SR ${requestId} would appear.`});
      // Actual modal/dropdown logic here, then update local state
      // For demo: setRequests(prev => prev.map(r => r.requestId === requestId ? {...r, status: "Completed"} : r));
  };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Service Requests Management</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="mr-2 h-6 w-6 text-primary" />
            All Service Requests
          </CardTitle>
          <CardDescription>
            Monitor, assign, and update tenant service requests efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-lg bg-muted/50 space-y-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by Request ID, Tenant, Apartment, Description..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
              <div>
                <label htmlFor="statusFilterSR" className="text-sm font-medium text-muted-foreground">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="statusFilterSR"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>{statusesForFilter.map(s => <SelectItem key={s} value={s} className="capitalize">{s === 'all' ? 'All Statuses' : s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="priorityFilterSR" className="text-sm font-medium text-muted-foreground">Priority</label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger id="priorityFilterSR"><SelectValue placeholder="All Priorities" /></SelectTrigger>
                  <SelectContent>{prioritiesForFilter.map(p => <SelectItem key={p} value={p} className="capitalize">{p === 'all' ? 'All Priorities' : p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="apartmentFilterSR" className="text-sm font-medium text-muted-foreground">Apartment</label>
                <Select value={filterApartment} onValueChange={setFilterApartment}>
                  <SelectTrigger id="apartmentFilterSR"><SelectValue placeholder="All Apartments" /></SelectTrigger>
                  <SelectContent>{apartmentNamesForFilter.map(name => <SelectItem key={name} value={name} className="capitalize">{name === 'all' ? 'All Apartments' : name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="workerFilterSR" className="text-sm font-medium text-muted-foreground">Assigned Worker</label>
                <Select value={filterWorker} onValueChange={setFilterWorker}>
                  <SelectTrigger id="workerFilterSR"><SelectValue placeholder="All Workers" /></SelectTrigger>
                  <SelectContent>{workerNamesForFilter.map(name => <SelectItem key={name} value={name} className="capitalize">{name === 'all' ? 'All/Any Worker' : name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-10">
              <ClipboardList className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">No service requests match your criteria.</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Req. ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Apartment/Unit</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned Worker</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs">{req.requestId}</TableCell>
                    <TableCell>{req.dateSubmitted}</TableCell>
                    <TableCell className="font-medium"><Link href={`/landlord/tenants/${req.tenantId}`} className="text-primary hover:underline">{req.tenantName}</Link></TableCell>
                    <TableCell>{req.apartmentName} / {req.unitName}</TableCell>
                    <TableCell className="max-w-xs truncate" title={req.description}>{req.description}</TableCell>
                    <TableCell>
                        <Badge variant={req.priority === 'Urgent' ? 'destructive' : req.priority === 'Low' ? 'secondary' : 'outline'}
                        className={`capitalize ${req.priority === 'Urgent' ? 'bg-red-100 text-red-700' : req.priority === 'Low' ? 'bg-blue-100 text-blue-700' : ''}`}
                        >
                            {req.priority || 'Normal'}
                        </Badge>
                    </TableCell>
                    <TableCell>{req.workerAssigned ? <Link href={`/landlord/workers/${req.workerAssigned.split(' ')[0].toLowerCase()}`} className="text-primary hover:underline">{req.workerAssigned}</Link> : <Badge variant="outline" className="italic">Unassigned</Badge>}</TableCell>
                    <TableCell>
                      <Badge variant={req.status === 'Completed' ? 'default' : (req.status === 'Pending' ? 'secondary' : 'outline')}
                             className={
                                 req.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                 req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                 req.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                 'bg-gray-100 text-gray-700' // Canceled
                             }
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" asChild title="View Details">
                         <Link href={`/landlord/service-requests/${req.requestId}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                      {req.status === 'Pending' && (
                        <Button variant="ghost" size="icon" onClick={() => handleAssignWorker(req.requestId)} title="Assign Worker">
                            <UserCog className="h-4 w-4 text-accent" />
                        </Button>
                      )}
                       {(req.status === 'Pending' || req.status === 'In Progress') && (
                        <Button variant="ghost" size="icon" onClick={() => handleChangeStatus(req.requestId)} title="Change Status">
                            <Edit3 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
