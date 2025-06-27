
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Save, ArrowLeft, CalendarIcon, Building, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Mock data for dropdowns - replace with actual data fetching
const mockApartmentsForExpense = [
  { id: 'all', name: 'All / Not Specific' },
  { id: 'apt101', name: 'Greenwood Heights' },
  { id: 'apt202', name: 'Riverside Towers' },
  { id: 'apt303', name: 'Acacia Park View' },
];
const expenseTypes = ['Maintenance', 'Utilities', 'Repairs', 'Cleaning', 'Salaries', 'Supplies', 'Marketing', 'Legal Fees', 'Other'];


const addExpenseSchema = z.object({
  dateOfExpense: z.date({ required_error: "Date of expense is required."}),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0.'),
  typeOfExpense: z.string({ required_error: "Expense type is required." }),
  description: z.string().min(5, 'Description must be at least 5 characters.'),
  associatedApartmentId: z.string().optional(), // Can be 'all' or specific ID
  receipt: z.any().optional(), // For file upload
});

type AddExpenseFormValues = z.infer<typeof addExpenseSchema>;

export default function AddNewExpensePage() {
  const { toast } = useToast();

  const form = useForm<AddExpenseFormValues>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
        dateOfExpense: new Date(),
        associatedApartmentId: 'all',
    },
  });

  function onSubmit(data: AddExpenseFormValues) {
    console.log('New Expense Data:', data);
    // Handle file upload for data.receipt if present
    // TODO: Implement API call to save expense
    toast({
      title: 'Expense Added (Placeholder)',
      description: `Expense of KES ${data.amount} for ${data.typeOfExpense} has been recorded.`,
      variant: 'default',
    });
    // form.reset(); 
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Add New Expense</h1>
        <Button variant="outline" asChild>
          <Link href="/landlord/payments/expenses"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Expenses</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><DollarSign className="mr-2 h-6 w-6 text-primary" />Expense Details</CardTitle>
              <CardDescription>Record a new operational expense.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField control={form.control} name="dateOfExpense" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Date of Expense</FormLabel>
                  <Popover><PopoverTrigger asChild><FormControl>
                      <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button></FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                  </Popover><FormMessage />
                </FormItem>
              )}/>

              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem><FormLabel>Amount (KES)</FormLabel><FormControl><Input type="number" placeholder="5000" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              
              <FormField control={form.control} name="typeOfExpense" render={({ field }) => (
                <FormItem><FormLabel>Type of Expense</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select expense type" /></SelectTrigger></FormControl>
                    <SelectContent>{expenseTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Detailed description of the expense" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              
              <FormField control={form.control} name="associatedApartmentId" render={({ field }) => (
                <FormItem><FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4"/>Associated Apartment (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Choose apartment or N/A" /></SelectTrigger></FormControl>
                    <SelectContent>{mockApartmentsForExpense.map(apt => <SelectItem key={apt.id} value={apt.id}>{apt.name}</SelectItem>)}</SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
              
              <FormField control={form.control} name="receipt" render={({ field }) => ( // Actual field name is receipt, not screenshot
                <FormItem>
                    <FormLabel className="flex items-center"><Upload className="mr-2 h-4 w-4"/>Upload Receipt (Optional)</FormLabel>
                    <FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} /></FormControl>
                    <FormDescription>Attach a scanned receipt or invoice.</FormDescription>
                    <FormMessage />
                </FormItem>
              )}/>

            </CardContent>
          </Card>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Save className="mr-2 h-5 w-5" /> Save Expense
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

