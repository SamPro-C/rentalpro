
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, CalendarDays, ListChecks } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { mockWorkerProfiles } from '@/app/landlord/workers/[workerId]/page';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Simulate fetching data for a specific worker (e.g., worker001)
const currentWorker = mockWorkerProfiles.find(w => w.id === 'worker001');

const mockTaskCompletionData = [
  { month: "Jan", completed: 15, pending: 5 },
  { month: "Feb", completed: 20, pending: 3 },
  { month: "Mar", completed: 18, pending: 7 },
  { month: "Apr", completed: 22, pending: 2 },
  { month: "May", completed: 25, pending: 4 },
  { month: "Jun", completed: 19, pending: 6 },
];

const chartConfig = {
  completed: { label: "Tasks Completed", color: "hsl(var(--chart-1))" },
  pending: { label: "Tasks Pending", color: "hsl(var(--chart-2))" },
};

export default function WorkerReportsPage() {

  if (!currentWorker) {
    return <div className="text-center text-destructive p-8">Error: Could not load worker data for reports.</div>;
  }
  
  const totalTasks = currentWorker.assignedTasksHistory.length;
  const completedTasks = currentWorker.assignedTasksHistory.filter(t => t.status === 'Completed').length;
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
        <BarChart3 className="mr-3 h-8 w-8 text-primary" /> My Performance Reports
      </h1>
      <CardDescription>
        This is a read-only summary of your task performance and attendance. For detailed queries, please contact your landlord.
      </CardDescription>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Total Tasks Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalTasks}</div>
          </CardContent>
        </Card>
         <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{completedTasks}</div>
          </CardContent>
        </Card>
         <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Task Completion Trend</CardTitle>
          <CardDescription>Shows number of tasks completed vs. pending each month (mock data).</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <BarChart accessibilityLayer data={mockTaskCompletionData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
              <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5"/>Recent Task Summary</CardTitle>
        </CardHeader>
        <CardContent>
            {currentWorker.assignedTasksHistory.length > 0 ? (
            <div className="overflow-x-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Assigned</TableHead>
                  <TableHead>Date Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentWorker.assignedTasksHistory.slice(0, 10).map(task => ( // Show recent 10
                  <TableRow key={task.id}>
                    <TableCell className="font-mono text-xs">{task.taskId}</TableCell>
                    <TableCell className="max-w-xs truncate">{task.description}</TableCell>
                    <TableCell>
                      <Badge variant={task.status === 'Completed' ? 'default' : (task.status === 'Pending' ? 'secondary' : 'outline')}
                             className={
                                task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                task.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : ''
                             }>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.dateAssigned}</TableCell>
                    <TableCell>{task.dateCompleted || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            ) : (
                <p className="text-muted-foreground text-center py-6">No task history available.</p>
            )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground text-center">Reports are for informational purposes only. Download or edit functionalities are not available for workers.</p>
    </div>
  );
}
