
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, CalendarDays, MapPin, QrCode } from 'lucide-react';
import { useState, useEffect } from 'react';
import { mockWorkerProfiles } from '@/app/landlord/workers/[workerId]/page';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';


// Simulate fetching data for a specific worker (e.g., worker001)
const currentWorker = mockWorkerProfiles.find(w => w.id === 'worker001');

export default function WorkerAttendancePage() {
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState(currentWorker?.attendanceHistory || []);
  const [isCheckedIn, setIsCheckedIn] = useState(false); // Manage current check-in state
  const [lastCheckInTime, setLastCheckInTime] = useState<Date | null>(null);

  // Simulate checking if already checked in for today on load
  useEffect(() => {
    const todayRecord = attendanceRecords.find(rec => rec.date === format(new Date(), 'yyyy-MM-dd') && rec.checkInTime && !rec.checkOutTime);
    if (todayRecord && todayRecord.checkInTime) {
        setIsCheckedIn(true);
        // This parsing might be complex if checkInTime is just "HH:mm"
        // For simplicity, let's assume we store full date-time if we need to calculate duration accurately
        // Or, this effect isn't needed if we purely rely on button clicks to manage state
    }
  }, [attendanceRecords]);


  if (!currentWorker) {
    return <div className="text-center text-destructive p-8">Error: Could not load worker data.</div>;
  }

  const handleCheckIn = () => {
    if (isCheckedIn) {
        toast({title: "Already Checked In", description: "You are already checked in for today.", variant: "destructive"});
        return;
    }
    const now = new Date();
    const newRecord = {
      id: `att${attendanceRecords.length + 1}`,
      date: format(now, 'yyyy-MM-dd'),
      checkInTime: format(now, 'HH:mm:ss'),
      location: 'GPS: Lat X, Lon Y (Mock)', // Placeholder for GPS
    };
    // In a real app, this would be an API call
    setAttendanceRecords(prev => [newRecord, ...prev]);
    setIsCheckedIn(true);
    setLastCheckInTime(now);
    toast({title: "Checked In", description: `Successfully checked in at ${newRecord.checkInTime}.`});
    console.log("Checked in:", newRecord);
  };

  const handleCheckOut = () => {
    if (!isCheckedIn) {
        toast({title: "Not Checked In", description: "You need to check in first.", variant: "destructive"});
        return;
    }
    const now = new Date();
    const todayDateStr = format(now, 'yyyy-MM-dd');
    
    setAttendanceRecords(prevRecords => prevRecords.map(rec => {
        if (rec.date === todayDateStr && rec.checkInTime && !rec.checkOutTime) {
            let hoursWorked = 'N/A';
            if (lastCheckInTime) {
                const diffMs = now.getTime() - lastCheckInTime.getTime();
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                hoursWorked = `${diffHours}h ${diffMinutes}m`;
            }
            return { ...rec, checkOutTime: format(now, 'HH:mm:ss'), hoursWorked };
        }
        return rec;
    }));

    setIsCheckedIn(false);
    setLastCheckInTime(null);
    toast({title: "Checked Out", description: `Successfully checked out at ${format(now, 'HH:mm:ss')}.`});
    console.log("Checked out at:", format(now, 'HH:mm:ss'));
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
        <CalendarDays className="mr-3 h-8 w-8 text-primary" /> My Attendance
      </h1>
      <CardDescription>
        Track your work attendance. This feature may use GPS or QR code scanning as configured by your landlord.
      </CardDescription>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Daily Check-in / Check-out</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <Button 
            onClick={handleCheckIn} 
            disabled={isCheckedIn} 
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white flex-1"
            size="lg"
          >
            <CheckCircle className="mr-2 h-5 w-5" /> Check In
          </Button>
          <Button 
            onClick={handleCheckOut} 
            disabled={!isCheckedIn} 
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white flex-1"
            size="lg"
          >
            <XCircle className="mr-2 h-5 w-5" /> Check Out
          </Button>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground space-x-2">
            <p className="flex items-center gap-1"><MapPin className="h-3 w-3"/>GPS tracking may be active.</p>
            <p className="flex items-center gap-1"><QrCode className="h-3 w-3"/>QR code scanning may be required at site.</p>
        </CardFooter>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Attendance Log</CardTitle>
          <CardDescription>Your recorded check-in and check-out times.</CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceRecords.length > 0 ? (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check-in Time</TableHead>
                  <TableHead>Check-out Time</TableHead>
                  <TableHead>Hours Worked</TableHead>
                  <TableHead>Location (Details)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.checkInTime || '-'}</TableCell>
                    <TableCell>{record.checkOutTime || '-'}</TableCell>
                    <TableCell>{record.hoursWorked || '-'}</TableCell>
                    <TableCell>{record.location || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-6">No attendance records found.</p>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground text-center">Attendance records cannot be edited. Please contact your landlord for discrepancies.</p>
    </div>
  );
}
