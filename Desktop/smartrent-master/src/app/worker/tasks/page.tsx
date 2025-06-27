
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, ListChecks, Filter, Search, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { mockWorkerProfiles } from '@/app/landlord/workers/[workerId]/page'; // Reusing worker mock data
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Simulate fetching data for a specific worker (e.g., worker001)
const currentWorker = mockWorkerProfiles.find(w => w.id === 'worker001');

const taskStatusesForFilter = ['all', 'Pending', 'In Progress', 'Completed'];
// Assuming assignedTasksHistory contains apartmentUnit which might be just apartment name or apartment, unit.
const apartmentNamesForFilter = ['all', ...new Set(currentWorker?.assignedTasksHistory.map(task => task.apartmentUnit.split(',')[0].trim()) || [])];


export default function WorkerTasksPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterApartment, setFilterApartment] = useState('all');
  
  // Simulate local state for tasks to allow status updates
  const [tasks, setTasks] = useState(currentWorker?.assignedTasksHistory || []);


  if (!currentWorker) {
    return <div className="text-center text-destructive p-8">Error: Could not load worker task data.</div>;
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (task.tenantName && task.tenantName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesApartment = filterApartment === 'all' || task.apartmentUnit.toLowerCase().includes(filterApartment.toLowerCase());
    return matchesSearch && matchesStatus && matchesApartment;
  });
  
  const handleUpdateStatus = (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
      // In a real app, this would be an API call
      setTasks(prevTasks => prevTasks.map(task => 
          task.taskId === taskId ? { ...task, status: newStatus, dateCompleted: newStatus === 'Completed' ? new Date().toLocaleDateString('en-CA') : task.dateCompleted } : task
      ));
      toast({title: "Task Status Updated", description: `Task ${taskId} marked as ${newStatus}.`});
      console.log(`Updating task ${taskId} to ${newStatus}`);
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
        <ListChecks className="mr-3 h-8 w-8 text-primary" /> My Assigned Tasks
      </h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Task Overview</CardTitle>
          <CardDescription>Manage your assigned tasks and update their status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-lg bg-muted/50 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by Task ID, Description, Tenant..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
              <div>
                <label htmlFor="statusFilterWorkerTasks" className="text-sm font-medium text-muted-foreground">Filter by Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="statusFilterWorkerTasks"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>{taskStatusesForFilter.map(s => <SelectItem key={s} value={s} className="capitalize">{s === 'all' ? 'All Statuses' : s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="apartmentFilterWorkerTasks" className="text-sm font-medium text-muted-foreground">Filter by Apartment</label>
                <Select value={filterApartment} onValueChange={setFilterApartment}>
                  <SelectTrigger id="apartmentFilterWorkerTasks"><SelectValue placeholder="All Apartments" /></SelectTrigger>
                  <SelectContent>{apartmentNamesForFilter.map(name => <SelectItem key={name} value={name} className="capitalize">{name === 'all' ? 'All Apartments' : name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {/* Add Due Date Filter if needed */}
            </div>
          </div>

          {filteredTasks.length > 0 ? (
            <div className="overflow-x-auto">
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-mono text-xs">{task.taskId}</TableCell>
                    <TableCell>{task.dateAssigned}</TableCell>
                    <TableCell className="max-w-xs truncate" title={task.description}>{task.description}</TableCell>
                    <TableCell>{task.apartmentUnit}</TableCell>
                    <TableCell>{task.tenantName || <span className="italic text-muted-foreground">N/A</span>}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={task.status === 'Completed' ? 'default' : (task.status === 'Pending' ? 'secondary' : 'outline')}
                        className={
                            task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            task.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : ''
                        }>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.dateCompleted || '-'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" asChild title="View Task Details">
                         <Link href={`/worker/tasks/${task.taskId}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                       {task.status === 'Pending' && (
                        <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(task.taskId, 'In Progress')} title="Mark as In Progress">
                            <Edit3 className="h-4 w-4 text-blue-600" />
                        </Button>
                      )}
                      {task.status === 'In Progress' && (
                        <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(task.taskId, 'Completed')} title="Mark as Completed">
                             <Edit3 className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-6">No tasks found matching your criteria.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
