
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Save, ArrowLeft, CalendarIcon, Building, Home, DoorOpen, DollarSign, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { mockApartmentList } from '@/lib/mock-data'; // Using centralized mock data
import { useSearchParams } from 'next/navigation';


interface RoomOption {
  id: string;
  name: string; 
}
interface UnitOption {
  id: string;
  name: string;
  rooms: RoomOption[];
}
interface ApartmentOption {
  id: string;
  name: string;
  units: UnitOption[];
}

// Transform mockApartmentList for dropdowns, filtering for vacant rooms
const apartmentOptions: ApartmentOption[] = mockApartmentList.map(apt => ({
    id: apt.id,
    name: apt.name,
    units: apt.units.map(unit => ({
        id: unit.id,
        name: unit.unitName,
        rooms: unit.rooms.filter(room => room.status === 'Vacant').map(room => ({
            id: room.id,
            name: room.roomNumber,
        }))
    })).filter(unit => unit.rooms.length > 0) // Only include units with at least one vacant room
}));


const tenantRegistrationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.').regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format."),
  nationalId: z.string().min(5, 'National ID is required.'),
  dateOfBirth: z.date({ required_error: "Date of birth is required."}),
  gender: z.enum(['male', 'female', 'other'], { required_error: "Gender is required."}),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required.'),
  emergencyContactPhone: z.string().min(10, 'Emergency contact phone is required.'),
  
  apartmentId: z.string({ required_error: "Apartment selection is required." }),
  unitId: z.string({ required_error: "Unit selection is required." }),
  roomId: z.string({ required_error: "Room selection is required." }), 
  
  moveInDate: z.date({ required_error: "Move-in date is required."}),
  monthlyRent: z.coerce.number().min(0, 'Monthly rent must be a positive number.'),
  securityDeposit: z.coerce.number().min(0, 'Security deposit must be a positive number.'),
  leaseStartDate: z.date({ required_error: "Lease start date is required."}),
  leaseEndDate: z.date().optional(),
  initialPassword: z.string().min(8, 'Initial password must be at least 8 characters.'),
});

type TenantRegistrationFormValues = z.infer<typeof tenantRegistrationSchema>;

export default function RegisterNewTenantPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const initialApartmentId = searchParams.get('apartmentId') || undefined;
  const initialUnitId = searchParams.get('unitId') || undefined;

  const form = useForm<TenantRegistrationFormValues>({
    resolver: zodResolver(tenantRegistrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      nationalId: '',
      gender: undefined,
      emergencyContactName: '',
      emergencyContactPhone: '',
      apartmentId: initialApartmentId,
      unitId: initialUnitId,
      roomId: undefined,
      monthlyRent: 0,
      securityDeposit: 0,
      initialPassword: '',
    },
  });

  const watchedApartmentId = form.watch('apartmentId');
  const watchedUnitId = form.watch('unitId');

  const [availableUnits, setAvailableUnits] = useState<UnitOption[]>([]);
  const [availableRooms, setAvailableRooms] = useState<RoomOption[]>([]);

  useEffect(() => {
    if (initialApartmentId) {
        const selectedApartment = apartmentOptions.find(apt => apt.id === initialApartmentId);
        setAvailableUnits(selectedApartment?.units || []);
        if (initialUnitId && selectedApartment) {
            const selectedUnit = selectedApartment.units.find(unit => unit.id === initialUnitId);
            setAvailableRooms(selectedUnit?.rooms || []);
        }
    }
  }, [initialApartmentId, initialUnitId]);


  useEffect(() => {
    if (watchedApartmentId) {
      const selectedApartment = apartmentOptions.find(apt => apt.id === watchedApartmentId);
      setAvailableUnits(selectedApartment?.units || []);
      if (watchedApartmentId !== initialApartmentId) { // Reset only if apartment actually changes from initial
        form.setValue('unitId', ''); 
        form.setValue('roomId', ''); 
        setAvailableRooms([]);
      }
    } else {
      setAvailableUnits([]);
      setAvailableRooms([]);
    }
  }, [watchedApartmentId, form, initialApartmentId]);

  useEffect(() => {
    if (watchedUnitId && availableUnits.length > 0) {
      const selectedUnit = availableUnits.find(unit => unit.id === watchedUnitId);
      setAvailableRooms(selectedUnit?.rooms || []);
       if (watchedUnitId !== initialUnitId) { // Reset only if unit actually changes
        form.setValue('roomId', '');
      }
    } else {
      setAvailableRooms([]);
    }
  }, [watchedUnitId, availableUnits, form, initialUnitId]);


  function onSubmit(data: TenantRegistrationFormValues) {
    console.log('New Tenant Data:', data);
    // TODO: Implement API call to register tenant
    // TODO: Update room status to "Occupied" in the backend
    toast({
      title: 'Tenant Registration (Placeholder)',
      description: `${data.fullName} is ready to be registered. See console for details.`,
      variant: 'default',
    });
    // form.reset(); 
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Register New Tenant</h1>
        <Button variant="outline" asChild>
          <Link href="/landlord/tenants"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Tenant List</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><UserPlus className="mr-2 h-6 w-6 text-primary" />Personal Information</CardTitle>
              <CardDescription>Enter the tenant's personal details.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="tenant@example.com" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+254 712 345678" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="nationalId" render={({ field }) => (
                <FormItem><FormLabel>National ID Number</FormLabel><FormControl><Input placeholder="12345678" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel>
                  <Popover><PopoverTrigger asChild><FormControl>
                      <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button></FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date('1900-01-01')} initialFocus /></PopoverContent>
                  </Popover><FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem><FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="emergencyContactName" render={({ field }) => (
                <FormItem><FormLabel>Emergency Contact Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="emergencyContactPhone" render={({ field }) => (
                <FormItem><FormLabel>Emergency Contact Phone</FormLabel><FormControl><Input placeholder="+254 798 765432" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><Building className="mr-2 h-6 w-6 text-primary" />Apartment Assignment</CardTitle>
              <CardDescription>Assign the tenant to a specific apartment, unit, and vacant room.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField control={form.control} name="apartmentId" render={({ field }) => (
                <FormItem><FormLabel>Select Apartment</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Choose apartment" /></SelectTrigger></FormControl>
                    <SelectContent>{apartmentOptions.map(apt => <SelectItem key={apt.id} value={apt.id}>{apt.name}</SelectItem>)}</SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="unitId" render={({ field }) => (
                <FormItem><FormLabel>Select Unit</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''} disabled={!watchedApartmentId || availableUnits.length === 0}>
                    <FormControl><SelectTrigger><SelectValue placeholder={watchedApartmentId ? "Choose unit" : "Select apartment first"} /></SelectTrigger></FormControl>
                    <SelectContent>{availableUnits.map(unit => <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>)}</SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="roomId" render={({ field }) => (
                <FormItem><FormLabel>Select Room (Vacant Only)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''} disabled={!watchedUnitId || availableRooms.length === 0}>
                    <FormControl><SelectTrigger><SelectValue placeholder={watchedUnitId ? "Choose room" : "Select unit first"} /></SelectTrigger></FormControl>
                    <SelectContent>
                      {availableRooms.length > 0 
                        ? availableRooms.map(room => <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>)
                        : <SelectItem value="no_rooms" disabled>No vacant rooms in unit</SelectItem>
                      }
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><DollarSign className="mr-2 h-6 w-6 text-primary" />Lease & Financials</CardTitle>
              <CardDescription>Set up lease terms and initial financial details.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField control={form.control} name="moveInDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Move-in Date</FormLabel>
                  <Popover><PopoverTrigger asChild><FormControl>
                      <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button></FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                  </Popover><FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="monthlyRent" render={({ field }) => (
                <FormItem><FormLabel>Monthly Rent (KES)</FormLabel><FormControl><Input type="number" placeholder="25000" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="securityDeposit" render={({ field }) => (
                <FormItem><FormLabel>Security Deposit (KES)</FormLabel><FormControl><Input type="number" placeholder="25000" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
               <FormField control={form.control} name="leaseStartDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Lease Start Date</FormLabel>
                  <Popover><PopoverTrigger asChild><FormControl>
                      <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button></FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                  </Popover><FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="leaseEndDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Lease End Date (Optional)</FormLabel>
                  <Popover><PopoverTrigger asChild><FormControl>
                      <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button></FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                  </Popover><FormMessage />
                </FormItem>
              )}/>
               <FormField control={form.control} name="initialPassword" render={({ field }) => (
                <FormItem><FormLabel className="flex items-center"><KeyRound className="mr-2 h-4 w-4"/>Initial Password</FormLabel>
                <FormControl><Input type="password" placeholder="Set a secure password" {...field} /></FormControl>
                <FormDescription>Tenant will use this to log in for the first time.</FormDescription>
                <FormMessage /></FormItem>
              )}/>
            </CardContent>
          </Card>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Save className="mr-2 h-5 w-5" /> Register Tenant
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
