
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, Edit3, UserX, UserCheck, Search, Trash2, Briefcase } from 'lucide-react'; // Use Briefcase for role consistency
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockAdminWorkerUsers, type AdminWorkerUser } from '@/lib/mock-data';

export default function ManageWorkersAdminPage() {
  const [workers, setWorkers] = useState<AdminWorkerUser[]>(mockAdminWorkerUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.phone.includes(searchTerm) ||
    worker.workerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (workerId: string, currentStatus: 'Active' | 'Inactive') => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    if (window.confirm(`Are you sure you want to set worker ${workerId} to ${newStatus}?`)) {
      setWorkers(prev => prev.map(w => w.workerId === workerId ? { ...w, status: newStatus } : w));
      toast({ title: 'Worker Status Updated', description: `Worker ${workerId} is now ${newStatus}.` });
    }
  };

  const handleDelete = (workerId: string) => {
    if (window.confirm(`Are you sure you want to DELETE worker ${workerId}? This action is permanent.`)) {
      setWorkers(prev => prev.filter(w => w.workerId !== workerId));
      toast({ title: 'Worker Deleted', description: `Worker ${workerId} has been deleted.`, variant: 'destructive' });
    }
  };
  
  const handleViewProfile = (workerId: string) => toast({title: "View Profile", description: `Viewing profile for worker ${workerId} (placeholder).`});
  const handleEditDetails = (workerId: string) => toast({title: "Edit Details", description: `Editing details for worker ${workerId} (placeholder).`});

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Manage All Workers</h1>
      <CardDescription>
        Oversee all worker accounts across the platform.
      </CardDescription>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Briefcase className="mr-2 h-6 w-6 text-primary" />All System Workers</CardTitle>
           <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by Name, Email, Phone, Worker ID, Role..."
                className="pl-8 w-full md:w-1/2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredWorkers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Briefcase className="mx-auto h-16 w-16 mb-4" />
              <p className="text-lg font-semibold">No workers found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Worker ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Assigned Apartments</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkers.map((worker) => (
                    <TableRow key={worker.workerId}>
                      <TableCell className="font-medium">{worker.name}</TableCell>
                      <TableCell>{worker.workerId}</TableCell>
                      <TableCell>{worker.role}</TableCell>
                      <TableCell>{worker.email}</TableCell>
                      <TableCell>{worker.phone}</TableCell>
                      <TableCell className="max-w-xs">
                        {worker.assignedApartments.length > 0 
                            ? worker.assignedApartments.map(apt => <Badge key={apt} variant="secondary" className="mr-1 mb-1 text-xs">{apt}</Badge>)
                            : <Badge variant="outline">None</Badge>
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={worker.status === 'Active' ? 'default' : 'destructive'}
                               className={worker.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {worker.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewProfile(worker.workerId)} title="View Profile">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditDetails(worker.workerId)} title="Edit Details">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleToggleStatus(worker.workerId, worker.status)} 
                            title={worker.status === 'Active' ? 'Deactivate' : 'Activate'}
                            className={worker.status === 'Active' ? 'text-orange-500 hover:text-orange-600' : 'text-green-500 hover:text-green-600'}
                        >
                          {worker.status === 'Active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(worker.workerId)} title="Delete Worker" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
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
