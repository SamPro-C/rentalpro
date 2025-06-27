
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Briefcase, Eye, Edit3, Trash2, Search, UserCheck, UserX, Download } from 'lucide-react';
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
import { useState } from 'react';

interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  assignedApartments: string[];
  workingHours: string;
  status: 'Active' | 'Inactive';
}

const mockWorkers: Worker[] = [
  { id: 'worker001', name: 'Mark Lee', email: 'mark.lee@example.com', phone: '0755112233', role: 'Plumber', assignedApartments: ['Greenwood Heights', 'Riverside Towers'], workingHours: 'Mon-Fri, 9am-5pm', status: 'Active' },
  { id: 'worker002', name: 'Sarah Kim', email: 'sarah.kim@example.com', phone: '0766223344', role: 'Electrician', assignedApartments: ['Greenwood Heights'], workingHours: 'Mon-Sat, 8am-4pm', status: 'Active' },
  { id: 'worker003', name: 'David Chen', email: 'david.chen@example.com', phone: '0777334455', role: 'Cleaner', assignedApartments: ['Acacia Park View'], workingHours: 'Tue, Thu, Sat, 10am-2pm', status: 'Inactive' },
];

// Mock apartment names for filter dropdown
const mockApartmentNamesForFilter = ['all', 'Greenwood Heights', 'Riverside Towers', 'Acacia Park View'];
const mockWorkerRolesForFilter = ['all', 'Plumber', 'Electrician', 'Cleaner', 'Security', 'Gardener'];


export default function WorkerManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterApartment, setFilterApartment] = useState('all'); // Not implemented in mockWorkers directly, but UI is here

  const filteredWorkers = mockWorkers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          worker.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          worker.phone.includes(searchTerm) ||
                          worker.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || worker.role === filterRole;
    // const matchesApartment = filterApartment === 'all' || worker.assignedApartments.includes(filterApartment); // Needs better mock data structure or logic
    return matchesSearch && matchesRole;
  });

  const handleViewProfile = (workerId: string) => console.log('View profile for worker:', workerId);
  const handleEditWorker = (workerId: string) => console.log('Edit worker:', workerId);
  const handleDeleteWorker = (workerId: string) => {
    if (window.confirm(`Are you sure you want to delete worker ${workerId}?`)) {
      console.log('Delete worker:', workerId);
    }
  };
  const handleToggleStatus = (workerId: string, currentStatus: 'Active' | 'Inactive') => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    if (window.confirm(`Are you sure you want to mark worker ${workerId} as ${newStatus}?`)) {
      console.log(`Setting worker ${workerId} to ${newStatus}`);
      // TODO: Update worker status in actual data
    }
  };
  const handleExport = () => console.log("Exporting worker data:", filteredWorkers);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Worker Management</h1>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/landlord/workers/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Register New Worker
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="mr-2 h-6 w-6 text-primary" />
            All Workers
          </CardTitle>
          <CardDescription>
            Manage all personnel assigned to your properties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by Name, ID, Role..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="roleFilter" className="text-sm font-medium text-muted-foreground">Filter by Role</label>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger id="roleFilter"><SelectValue placeholder="All Roles" /></SelectTrigger>
                  <SelectContent>
                    {mockWorkerRolesForFilter.map(role => (
                      <SelectItem key={role} value={role} className="capitalize">{role === 'all' ? 'All Roles' : role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="apartmentFilterWorker" className="text-sm font-medium text-muted-foreground">Filter by Apartment</label>
                <Select value={filterApartment} onValueChange={setFilterApartment}>
                  <SelectTrigger id="apartmentFilterWorker"><SelectValue placeholder="All Apartments" /></SelectTrigger>
                  <SelectContent>
                     {mockApartmentNamesForFilter.map(name => (
                        <SelectItem key={name} value={name} className="capitalize">{name === 'all' ? 'All Apartments' : name}</SelectItem>
                     ))}
                  </SelectContent>
                </Select>
              </div>
               <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export Results
              </Button>
            </div>
          </div>

          {filteredWorkers.length === 0 ? (
            <div className="text-center py-10">
              <Briefcase className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">No workers match your criteria.</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters, or register a new worker.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Worker ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Assigned Apartments</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkers.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell className="font-medium">{worker.name}</TableCell>
                    <TableCell>{worker.id}</TableCell>
                    <TableCell>{worker.role}</TableCell>
                    <TableCell>
                      <div>{worker.email}</div>
                      <div className="text-xs text-muted-foreground">{worker.phone}</div>
                    </TableCell>
                    <TableCell>
                      {worker.assignedApartments.map(apt => <Badge key={apt} variant="secondary" className="mr-1 mb-1 text-xs">{apt}</Badge>)}
                      {worker.assignedApartments.length === 0 && <span className="text-xs text-muted-foreground italic">None</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={worker.status === 'Active' ? 'default' : 'destructive'}
                             className={worker.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {worker.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleViewProfile(worker.id)} asChild title="View Worker Profile">
                        <Link href={`/landlord/workers/${worker.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditWorker(worker.id)} title="Edit Worker">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                       <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(worker.id, worker.status)} title={worker.status === 'Active' ? 'Deactivate Worker' : 'Activate Worker'}>
                        {worker.status === 'Active' ? <UserX className="h-4 w-4 text-orange-600" /> : <UserCheck className="h-4 w-4 text-green-600" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteWorker(worker.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title="Delete Worker">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
