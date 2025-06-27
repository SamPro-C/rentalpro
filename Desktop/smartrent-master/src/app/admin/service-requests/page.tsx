'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Eye, Search, Filter, AlertTriangle, UserCog, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockAdminGlobalServiceRequests, type AdminGlobalServiceRequest } from '@/lib/mock-data';


const statusesForFilter = ['all', 'Pending', 'In Progress', 'Completed', 'Canceled', 'Escalated'];
const prioritiesForFilter = ['all', 'Urgent', 'Normal', 'Low'];
// Assuming apartment names can be dynamically fetched or are known
const apartmentNamesForFilter = ['all', ...new Set(mockAdminGlobalServiceRequests.map(req => req.propertyUnit.split(' - ')[0]))];


export default function AdminServiceRequestsLogPage() {
  const [requests, setRequests] = useState<AdminGlobalServiceRequest[]>(mockAdminGlobalServiceRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterApartment, setFilterApartment] = useState('all');
  const { toast } = useToast();

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
        const matchesSearch = req.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              req.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              req.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
        const matchesPriority = filterPriority === 'all' || (req.priority || 'Normal') === filterPriority;
        const matchesApartment = filterApartment === 'all' || req.propertyUnit.toLowerCase().includes(filterApartment.toLowerCase());
        return matchesSearch && matchesStatus && matchesPriority && matchesApartment;
    });
  }, [requests, searchTerm, filterStatus, filterPriority, filterApartment]);

  const handleViewDetails = (requestId: string) => {
    toast({ title: "View Service Request", description: `Viewing details for SR ${requestId} (placeholder).` });
    // router.push(`/admin/service-requests/${requestId}`);
  };
  
  const handleOverrideAssignment = (requestId: string) => {
    toast({ title: "Override Assignment", description: `Modal to override worker assignment for SR ${requestId} would open.` });
    // Implement modal for re-assignment
  };

  const handleEscalateRequest = (requestId: string) => {
     setRequests(prev => prev.map(r => r.requestId === requestId ? { ...r, status: 'Escalated', priority: 'Urgent' } : r));
    toast({ title: "Request Escalated", description: `SR ${requestId} has been escalated and marked as Urgent.`, variant: "default" });
  };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">System-Wide Service Requests</h1>
      <CardDescription>
        Monitor all service requests across all properties for oversight and intervention if necessary.
      </CardDescription>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ClipboardList className="mr-2 h-6 w-6 text-primary" />All Service Requests</CardTitle>
          <div className="mt-4 p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
               <div className="relative col-span-full sm:col-span-2 md:col-span-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by ID, Tenant, Desc..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
              <div>
                <label htmlFor="adminStatusFilterSR" className="text-sm font-medium text-muted-foreground">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="adminStatusFilterSR"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>{statusesForFilter.map(s => <SelectItem key={s} value={s} className="capitalize">{s === 'all' ? 'All Statuses' : s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="adminPriorityFilterSR" className="text-sm font-medium text-muted-foreground">Priority</label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger id="adminPriorityFilterSR"><SelectValue placeholder="All Priorities" /></SelectTrigger>
                  <SelectContent>{prioritiesForFilter.map(p => <SelectItem key={p} value={p} className="capitalize">{p === 'all' ? 'All Priorities' : p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="adminApartmentFilterSR" className="text-sm font-medium text-muted-foreground">Apartment</label>
                <Select value={filterApartment} onValueChange={setFilterApartment}>
                  <SelectTrigger id="adminApartmentFilterSR"><SelectValue placeholder="All Apartments" /></SelectTrigger>
                  <SelectContent>{apartmentNamesForFilter.map(name => <SelectItem key={name} value={name} className="capitalize">{name === 'all' ? 'All Apartments' : name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <ClipboardList className="mx-auto h-16 w-16 mb-4" />
              <p className="text-lg font-semibold">No service requests match your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Req. ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property/Unit</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned Worker</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((req) => (
                    <TableRow key={req.requestId}>
                      <TableCell className="font-mono text-xs">{req.requestId}</TableCell>
                      <TableCell>{req.dateSubmitted}</TableCell>
                      <TableCell className="font-medium">{req.tenantName}</TableCell>
                      <TableCell>{req.propertyUnit}</TableCell>
                      <TableCell className="max-w-xs truncate" title={req.description}>{req.description}</TableCell>
                      <TableCell>
                          <Badge variant={req.priority === 'Urgent' ? 'destructive' : req.priority === 'Low' ? 'secondary' : 'outline'}
                          className={`capitalize ${req.priority === 'Urgent' ? 'bg-red-100 text-red-700' : req.priority === 'Low' ? 'bg-blue-100 text-blue-700' : ''}`}>
                              {req.priority || 'Normal'}
                          </Badge>
                      </TableCell>
                      <TableCell>{req.assignedWorker || <Badge variant="outline" className="italic">Unassigned</Badge>}</TableCell>
                      <TableCell>
                        <Badge variant={req.status === 'Completed' ? 'default' : (req.status === 'Pending' ? 'secondary' : (req.status === 'Escalated' ? 'destructive': 'outline'))}
                               className={
                                   req.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                   req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                   req.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                   req.status === 'Escalated' ? 'bg-orange-100 text-orange-700 border-orange-500' :
                                   'bg-gray-100 text-gray-700' // Canceled
                               }>
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(req.requestId)} title="View Full Details">
                           <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOverrideAssignment(req.requestId)} title="Override Worker Assignment">
                            <UserCog className="h-4 w-4 text-accent" />
                        </Button>
                        {req.status !== 'Completed' && req.status !== 'Canceled' && req.status !== 'Escalated' && (
                          <Button variant="ghost" size="icon" onClick={() => handleEscalateRequest(req.requestId)} title="Escalate Request" className="text-orange-600 hover:text-orange-700">
                              <AlertTriangle className="h-4 w-4" />
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
