
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, PlusCircle, Eye, Search } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTenantProfiles } from '@/app/landlord/tenants/[tenantId]/page'; // Reusing mock data
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Simulate fetching data for a specific tenant (e.g., tenant001)
const currentTenant = mockTenantProfiles.find(t => t.id === 'tenant001');
const serviceRequestStatuses = ['all', 'Pending', 'In Progress', 'Completed', 'Canceled', 'Resolved'];

export default function TenantServiceRequestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  if (!currentTenant) {
    return <div className="text-center text-destructive">Error: Could not load service request data.</div>;
  }

  const filteredRequests = currentTenant.serviceRequestHistory.filter(req => {
    const matchesSearch = req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.requestId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Service Requests</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/tenant/service-requests/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Submit New Request
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ClipboardList className="mr-2 h-6 w-6 text-primary"/>Submitted Requests</CardTitle>
          <CardDescription>Track the status of your service and maintenance requests.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-6 p-4 border rounded-lg bg-muted/50 space-y-4 md:flex md:items-end md:gap-4">
              <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                      type="search"
                      placeholder="Search by Request ID or Description..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <div className="md:w-1/4">
                  <Label htmlFor="statusFilterSRTenant" className="text-sm font-medium text-muted-foreground">Filter by Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger id="statusFilterSRTenant"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                      <SelectContent>{serviceRequestStatuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s === 'all' ? 'All Statuses' : s}</SelectItem>)}</SelectContent>
                  </Select>
              </div>
            </div>


          {filteredRequests.length > 0 ? (
            <div className="overflow-x-auto">
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
                {filteredRequests.map(req => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs">{req.requestId}</TableCell>
                    <TableCell>{req.dateSubmitted}</TableCell>
                    <TableCell className="max-w-xs truncate" title={req.description}>{req.description}</TableCell>
                    <TableCell>{req.workerAssigned || <span className="text-muted-foreground italic">None</span>}</TableCell>
                    <TableCell>
                       <Badge variant={req.status === 'Completed' || req.status === 'Resolved' ? 'default' : (req.status === 'Pending' ? 'secondary' : 'outline')}
                                 className={req.status === 'Completed' || req.status === 'Resolved' ? 'bg-green-100 text-green-700' : (req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : '')}
                        >{req.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/tenant/service-requests/${req.requestId}`}>
                          <Eye className="mr-1 h-4 w-4"/> View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-6">
                {searchTerm || filterStatus !== 'all' ? "No service requests match your criteria." : "You haven't submitted any service requests yet."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

