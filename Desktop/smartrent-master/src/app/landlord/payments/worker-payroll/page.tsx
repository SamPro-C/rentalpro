
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Banknote, ArrowLeft, Users, DollarSign, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { mockAdminWorkerUsers } from '@/lib/mock-data'; // Using admin version as it has mockSalary
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const workerPaymentSchema = z.object({
  workerId: z.string(),
  name: z.string(),
  role: z.string(),
  amount: z.coerce.number().min(0, "Amount must be non-negative."),
  notes: z.string().optional(),
  isSelected: z.boolean().default(false),
});

const payrollFormSchema = z.object({
  paymentMonth: z.string({ required_error: "Payment month is required." }),
  paymentYear: z.string({ required_error: "Payment year is required." }),
  paymentMethod: z.enum(['M-Pesa', 'Bank Transfer'], { required_error: "Payment method is required."}),
  workers: z.array(workerPaymentSchema).min(1, "At least one worker must be processed."),
  // overallReference: z.string().optional(),
});

type PayrollFormValues = z.infer<typeof payrollFormSchema>;

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

export default function WorkerPayrollPage() {
  const { toast } = useToast();
  
  // Initialize worker data for the form, including selection state
  const initialWorkersData = mockAdminWorkerUsers
    .filter(w => w.status === 'Active') // Only active workers for payroll
    .map(worker => ({
        workerId: worker.workerId,
        name: worker.name,
        role: worker.role,
        amount: worker.mockSalary || 0, // Use mockSalary or default to 0
        notes: '',
        isSelected: false, 
  }));


  const form = useForm<PayrollFormValues>({
    resolver: zodResolver(payrollFormSchema),
    defaultValues: {
      paymentMonth: months[new Date().getMonth()],
      paymentYear: currentYear.toString(),
      paymentMethod: undefined,
      workers: initialWorkersData,
    },
  });

  const { fields, update } = useFieldArray({
    control: form.control,
    name: "workers",
  });

  const watchedWorkers = form.watch('workers');
  const selectedWorkersCount = watchedWorkers.filter(w => w.isSelected).length;
  const totalSelectedAmount = watchedWorkers
    .filter(w => w.isSelected)
    .reduce((sum, worker) => sum + (worker.amount || 0), 0);

  function onSubmit(data: PayrollFormValues) {
    const paymentsToProcess = data.workers.filter(w => w.isSelected);
    if (paymentsToProcess.length === 0) {
      toast({
        title: "No Workers Selected",
        description: "Please select at least one worker to process payment for.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Processing Payroll:', {
      month: data.paymentMonth,
      year: data.paymentYear,
      method: data.paymentMethod,
      payments: paymentsToProcess,
      totalAmount: totalSelectedAmount,
    });

    toast({
      title: 'Payroll Submitted',
      description: `Payment processing initiated for ${paymentsToProcess.length} worker(s) via ${data.paymentMethod}. Total: KES ${totalSelectedAmount.toLocaleString()}`,
      variant: 'default',
    });
    // Potentially reset parts of the form or update UI to reflect payment
  }

  const handleSelectAll = (checked: boolean) => {
    fields.forEach((_, index) => {
      form.setValue(`workers.${index}.isSelected`, checked);
    });
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
          <Banknote className="mr-3 h-8 w-8 text-primary" /> Worker Payroll
        </h1>
        <Button variant="outline" asChild>
          <Link href="/landlord/payments"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Payments</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary"/>Payment Period & Method</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="paymentMonth" render={({ field }) => (
                    <FormItem><FormLabel>Payment For Month</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select month" /></SelectTrigger></FormControl>
                        <SelectContent>{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="paymentYear" render={({ field }) => (
                    <FormItem><FormLabel>Payment For Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger></FormControl>
                        <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                    </Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                    <FormItem><FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="M-Pesa">M-Pesa Bulk</SelectItem>
                            <SelectItem value="Bank Transfer">Bank Transfer (Batch)</SelectItem>
                        </SelectContent>
                    </Select><FormMessage /></FormItem>
                )}/>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><Users className="mr-2 h-6 w-6 text-primary"/>Select Workers & Enter Amounts</CardTitle>
              <CardDescription>Select workers to include in this payroll run and specify their payment amounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Checkbox
                    id="selectAllWorkers"
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                    checked={watchedWorkers.length > 0 && watchedWorkers.every(w => w.isSelected)}
                    disabled={watchedWorkers.length === 0}
                />
                <Label htmlFor="selectAllWorkers" className="ml-2 text-sm font-medium">
                    Select All / Deselect All Workers
                </Label>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Worker Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="w-[150px]">Amount (KES)</TableHead>
                      <TableHead className="w-[200px]">Notes/Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id} className={form.watch(`workers.${index}.isSelected`) ? 'bg-primary/5' : ''}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`workers.${index}.isSelected`}
                            render={({ field: checkboxField }) => (
                              <FormItem className="flex items-center">
                                <FormControl>
                                  <Checkbox
                                    checked={checkboxField.value}
                                    onCheckedChange={checkboxField.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{field.name}</TableCell>
                        <TableCell>{field.role}</TableCell>
                        <TableCell>
                           <FormField
                            control={form.control}
                            name={`workers.${index}.amount`}
                            render={({ field: amountField }) => (
                                <FormItem><FormControl><Input type="number" {...amountField} readOnly={!form.watch(`workers.${index}.isSelected`)} className={!form.watch(`workers.${index}.isSelected`) ? 'bg-muted cursor-not-allowed' : ''}/></FormControl><FormMessage /></FormItem>
                            )}
                           />
                        </TableCell>
                        <TableCell>
                           <FormField
                            control={form.control}
                            name={`workers.${index}.notes`}
                            render={({ field: notesField }) => (
                                <FormItem><FormControl><Input {...notesField} placeholder="e.g., Salary + Bonus" readOnly={!form.watch(`workers.${index}.isSelected`)} className={!form.watch(`workers.${index}.isSelected`) ? 'bg-muted cursor-not-allowed' : ''} /></FormControl><FormMessage /></FormItem>
                            )}
                           />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {fields.length === 0 && <p className="text-center text-muted-foreground py-4">No active workers found.</p>}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-lg space-y-1">
                <p><strong className="text-muted-foreground">Workers Selected:</strong> {selectedWorkersCount}</p>
                <p><strong className="text-muted-foreground">Total Payroll Amount:</strong> KES <span className="font-bold text-primary">{totalSelectedAmount.toLocaleString()}</span></p>
            </CardContent>
             <CardFooter>
                 <Button 
                    type="submit" 
                    size="lg" 
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    disabled={selectedWorkersCount === 0 || !form.watch('paymentMethod')}
                 >
                    <DollarSign className="mr-2 h-5 w-5" /> Process Batch Payment
                </Button>
             </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

