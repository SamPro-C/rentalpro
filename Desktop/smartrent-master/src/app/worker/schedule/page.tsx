
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { mockWorkerProfiles } from '@/app/landlord/workers/[workerId]/page';
// import { mockApartments } from '@/app/landlord/tenants/new/page'; // Not used currently
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';

// Simulate fetching data for a specific worker (e.g., worker001)
const currentWorker = mockWorkerProfiles.find(w => w.id === 'worker001');

// Mock schedule data for the worker
const mockSchedule = [
  { date: '2024-07-15', shift: '09:00 - 17:00', apartment: 'Greenwood Heights', tasks: ['Unit A-101: Fix leak', 'Common Area: Check lighting'] },
  { date: '2024-07-16', shift: '09:00 - 17:00', apartment: 'Riverside Towers', tasks: ['Unit B-203: Unblock drain'] },
  { date: '2024-07-17', shift: '08:00 - 12:00', apartment: 'Greenwood Heights', tasks: ['Routine maintenance checks'] },
  { date: '2024-07-22', shift: '13:00 - 17:00', apartment: 'Acacia Park View', tasks: ['Inspect HVAC units'] }, // Example for next week
];

export default function WorkerSchedulePage() {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 for current week, -1 for prev, 1 for next
  const [filterApartment, setFilterApartment] = useState('all');

  if (!currentWorker) {
    return <div className="text-center text-destructive p-8">Error: Could not load worker data.</div>;
  }
  
  const getWeekDisplay = (offset: number): string => {
    const today = new Date();
    const targetDate = offset === 0 ? today : (offset > 0 ? addWeeks(today, offset) : subWeeks(today, offset));
    const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 }); // Assuming week starts on Monday
    const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });
    
    if (offset === 0) return `Current Week ( ${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')} )`;
    if (offset === 1) return `Next Week ( ${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')} )`;
    if (offset === -1) return `Previous Week ( ${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')} )`;
    return `Week of ${format(weekStart, 'MMM d, yyyy')}`;
  };


  // Placeholder for date logic to display current week's schedule
  const displaySchedule = useMemo(() => {
    return mockSchedule.filter(item => {
      const matchesApartment = filterApartment === 'all' || item.apartment === filterApartment;
      // For demo, we are not filtering by date offset here, just showing all mock data
      // In a real app, you'd filter 'item.date' based on 'currentWeekOffset'
      return matchesApartment;
    });
  }, [filterApartment]);


  const apartmentOptions = ['all', ...new Set(currentWorker.assignedApartments.map(a => a.name))];


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
        <CalendarDays className="mr-3 h-8 w-8 text-primary" /> My Work Schedule
      </h1>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>View your assigned shifts and tasks for the week.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setCurrentWeekOffset(prev => prev - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-center w-48">
                {getWeekDisplay(currentWeekOffset)}
              </span>
              <Button variant="outline" size="icon" onClick={() => setCurrentWeekOffset(prev => prev + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4">
             <label htmlFor="apartmentFilterSchedule" className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1"><Filter className="h-3 w-3"/>Filter by Apartment</label>
             <Select value={filterApartment} onValueChange={setFilterApartment}>
                  <SelectTrigger id="apartmentFilterSchedule" className="w-full sm:w-[250px]">
                    <SelectValue placeholder="All Assigned Apartments" />
                  </SelectTrigger>
                  <SelectContent>
                    {apartmentOptions.map(name => (
                      <SelectItem key={name} value={name} className="capitalize">{name === 'all' ? 'All Assigned Apartments' : name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
          </div>
        </CardHeader>
        <CardContent>
          {displaySchedule.length > 0 ? (
            <div className="space-y-4">
              {displaySchedule.map((item, index) => (
                <Card key={index} className="bg-muted/30 p-4">
                  <h3 className="font-semibold text-lg">{item.date}</h3>
                  <p className="text-sm text-primary">{item.shift} @ {item.apartment}</p>
                  <ul className="list-disc list-inside ml-4 mt-1 text-sm text-muted-foreground">
                    {item.tasks.map((task, i) => <li key={i}>{task}</li>)}
                  </ul>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-6">No schedule found for this period or filter.</p>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground text-center">Your schedule is managed by your landlord. Please contact them for any changes.</p>
    </div>
  );
}
