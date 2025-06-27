
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, ListChecks, ClipboardEdit, Bell, AlertTriangle, CheckCircle, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { mockWorkerProfiles } from '@/app/landlord/workers/[workerId]/page'; // Reusing mock data for consistency

// Simulate fetching data for a specific worker (e.g., worker001)
const currentWorker = mockWorkerProfiles.find(w => w.id === 'worker001');

export default function WorkerDashboardPage() {
  if (!currentWorker) {
    return <div className="text-center text-destructive p-8">Error: Could not load worker data. Please try logging in again.</div>;
  }

  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD for easy comparison
  const tasksToday = currentWorker.assignedTasksHistory.filter(
    task => task.dateAssigned === today && task.status !== 'Completed'
  );
  const pendingTasksCount = currentWorker.assignedTasksHistory.filter(task => task.status === 'Pending').length;
  const completedTasksTodayCount = currentWorker.assignedTasksHistory.filter(task => task.status === 'Completed' && task.dateCompleted === today).length;

  // Placeholder for notifications
  const unreadNotificationsCount = 2; 

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Hello, {currentWorker.fullName}!
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned Apartments</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWorker.assignedApartments.length}</div>
            <p className="text-xs text-muted-foreground">Currently assigned properties</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Pending Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksToday.length}</div>
            <p className="text-xs text-muted-foreground">Tasks scheduled for today</p>
          </CardContent>
        </Card>
         <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Pending Tasks</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasksCount}</div>
            <p className="text-xs text-muted-foreground">Across all assignments</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasksTodayCount}</div>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5"/>My Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">View your daily and weekly work assignments.</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/worker/schedule">View My Schedule</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5"/>My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Manage your assigned tasks and service requests.</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/worker/tasks">View My Tasks</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><ClipboardEdit className="mr-2 h-5 w-5"/>Report an Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Encountered a problem? Report it to your landlord.</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/worker/report-issue">Submit Report</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {unreadNotificationsCount > 0 && (
         <Card className="bg-blue-50 border-blue-300 shadow-md">
            <CardHeader className="flex flex-row items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600"/>
                <CardTitle className="text-blue-700">You have {unreadNotificationsCount} unread notifications</CardTitle>
            </CardHeader>
            <CardContent>
                <Button asChild variant="link" className="p-0 text-blue-700">
                    <Link href="/worker/notifications">View Notifications</Link>
                </Button>
            </CardContent>
        </Card>
      )}
      
      {/* Placeholder for Today's Tasks if any */}
      {tasksToday.length > 0 && (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Today's Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {tasksToday.map(task => (
                        <li key={task.id} className="text-sm p-2 border rounded-md">
                           <p className="font-semibold">{task.description} <span className="text-xs text-muted-foreground">({task.apartmentUnit})</span></p>
                           <p className="text-xs text-primary">{task.status}</p>
                        </li>
                    ))}
                </ul>
                 <Button asChild variant="link" className="mt-2 p-0">
                    <Link href="/worker/tasks">View All Tasks</Link>
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
