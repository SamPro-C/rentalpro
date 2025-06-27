
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Save, ArrowLeft, Building, Clock, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// Mock data for dropdowns - replace with actual data fetching
const mockApartmentsForAssignment = [
  { id: 'apt101', name: 'Greenwood Heights' },
  { id: 'apt202', name: 'Riverside Towers' },
  { id: 'apt303', name: 'Acacia Park View' },
];

const workerRoles = ['Cleaner', 'Plumber', 'Electrician', 'Security', 'Gardener', 'Handyman', 'Manager'];
const daysOfWeek = [
    { id: 'mon', label: 'Mon' }, { id: 'tue', label: 'Tue' }, { id: 'wed', label: 'Wed'}, 
    { id: 'thu', label: 'Thu' }, { id: 'fri', label: 'Fri' }, { id: 'sat', label: 'Sat' }, { id: 'sun', label: 'Sun'}
] as const;


const workerRegistrationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.').optional().or(z.literal('')), // Optional for some worker roles
  phone: z.string().min(10, 'Phone number must be at least 10 digits.').regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format."),
  nationalId: z.string().min(5, 'National ID is required.'),
  role: z.string({ required_error: "Worker role is required."}),
  assignedApartmentIds: z.array(z.string()).refine(value => value.some(id => id), {
    message: "You have to select at least one apartment.",
  }),
  
  workingHoursStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time (HH:MM format). Example: 09:00"),
  workingHoursEnd: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time (HH:MM format). Example: 17:00"),
  workingDays: z.array(z.string()).refine(value => value.some(day => day), {
    message: "You have to select at least one working day.",
  }),

  emergencyContactName: z.string().min(2, 'Emergency contact name is required.'),
  emergencyContactPhone: z.string().min(10, 'Emergency contact phone is required.'),
  initialPassword: z.string().min(8, 'Initial password must be at least 8 characters.'),
});

type WorkerRegistrationFormValues = z.infer<typeof workerRegistrationSchema>;

export default function RegisterNewWorkerPage() {
  const { toast } = useToast();

  const form = useForm<WorkerRegistrationFormValues>({
    resolver: zodResolver(workerRegistrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      nationalId: '',
      role: undefined,
      assignedApartmentIds: [],
      workingHoursStart: '09:00',
      workingHoursEnd: '17:00',
      workingDays: ['mon', 'tue', 'wed', 'thu', 'fri'], // Default Mon-Fri
      emergencyContactName: '',
      emergencyContactPhone: '',
      initialPassword: '',
    },
  });

  function onSubmit(data: WorkerRegistrationFormValues) {
    console.log('New Worker Data:', data);
    // TODO: Implement API call to register worker
    toast({
      title: 'Worker Registration (Placeholder)',
      description: `${data.fullName} is ready to be registered. See console for details.`,
      variant: 'default',
    });
    // form.reset(); 
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Register New Worker</h1>
        <Button variant="outline" asChild>
          <Link href="/landlord/workers"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Worker List</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><Briefcase className="mr-2 h-6 w-6 text-primary" />Worker Information</CardTitle>
              <CardDescription>Enter the worker's details and assignments.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Mark Lee" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email Address (Optional)</FormLabel><FormControl><Input type="email" placeholder="worker@example.com" {...field} /></FormControl><FormDescription>Used for login if provided.</FormDescription><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+254 755 112233" {...field} /></FormControl><FormDescription>Primary contact and for SMS.</FormDescription><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="nationalId" render={({ field }) => (
                <FormItem><FormLabel>National ID Number</FormLabel><FormControl><Input placeholder="87654321" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem><FormLabel>Role/Job Title</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger></FormControl>
                    <SelectContent>{workerRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
               <FormField control={form.control} name="initialPassword" render={({ field }) => (
                <FormItem><FormLabel className="flex items-center"><KeyRound className="mr-2 h-4 w-4"/>Initial Password</FormLabel>
                <FormControl><Input type="password" placeholder="Set a secure password" {...field} /></FormControl>
                <FormDescription>Worker will use this to log in.</FormDescription>
                <FormMessage /></FormItem>
              )}/>
            </CardContent>
          </Card>
          
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><Building className="mr-2 h-6 w-6 text-primary" />Assignments & Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="assignedApartmentIds"
                  render={() => (
                    <FormItem>
                      <FormLabel>Assigned Apartments</FormLabel>
                      <FormDescription>Select all apartments this worker will be assigned to.</FormDescription>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                        {mockApartmentsForAssignment.map((apartment) => (
                          <FormField
                            key={apartment.id}
                            control={form.control}
                            name="assignedApartmentIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={apartment.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(apartment.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, apartment.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== apartment.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {apartment.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <FormField control={form.control} name="workingHoursStart" render={({ field }) => (
                        <FormItem><FormLabel>Working Hours Start</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="workingHoursEnd" render={({ field }) => (
                        <FormItem><FormLabel>Working Hours End</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                 <FormField
                    control={form.control}
                    name="workingDays"
                    render={() => (
                        <FormItem>
                        <FormLabel>Working Days</FormLabel>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
                            {daysOfWeek.map((day) => (
                            <FormField
                                key={day.id}
                                control={form.control}
                                name="workingDays"
                                render={({ field }) => {
                                return (
                                    <FormItem
                                    key={day.id}
                                    className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2"
                                    >
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value?.includes(day.id)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                            ? field.onChange([...field.value, day.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                    (value) => value !== day.id
                                                )
                                                );
                                        }}
                                        />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                        {day.label}
                                    </FormLabel>
                                    </FormItem>
                                );
                                }}
                            />
                            ))}
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
          </Card>

           <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><Clock className="mr-2 h-6 w-6 text-primary" />Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="emergencyContactName" render={({ field }) => (
                    <FormItem><FormLabel>Emergency Contact Full Name</FormLabel><FormControl><Input placeholder="Jane Smith (Spouse)" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="emergencyContactPhone" render={({ field }) => (
                    <FormItem><FormLabel>Emergency Contact Phone</FormLabel><FormControl><Input placeholder="+254 712 345678" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </CardContent>
           </Card>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Save className="mr-2 h-5 w-5" /> Register Worker
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

