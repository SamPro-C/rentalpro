
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
import { DollarSign, Save, ArrowLeft, CalendarIcon, User, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

// Mock data for dropdowns - replace with actual data fetching
const mockTenants = [
  { id: 'tenant001', name: 'John Doe', apartment: 'Greenwood Heights', unit: 'A-101', room: '1' },
  { id: 'tenant002', name: 'Jane Smith', apartment: 'Greenwood Heights', unit: 'A-102', room: 'Main' },
  { id: 'tenant003', name: 'Alice Brown', apartment: 'Riverside Towers', unit: 'B-201', room: 'Studio' },
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

const manualPaymentSchema = z.object({
  tenantId: z.string({ required_error: "Tenant selection is required." }),
  paymentMonth: z.string({ required_error: "Payment month is required." }),
  paymentYear: z.string({ required_error: "Payment year is required." }),
  amountPaid: z.coerce.number().min(1, 'Amount paid must be greater than 0.'),
  paymentMethod: z.enum(['M-Pesa', 'Bank Transfer', 'Cash', 'Other'], { required_error: "Payment method is required."}),
  transactionId: z.string().optional(), // M-Pesa code or reference
  paymentDate: z.date({ required_error: "Payment date is required."}),
  screenshot: z.any().optional(), // For file upload
  notes: z.string().optional(),
});

type ManualPaymentFormValues = z.infer<typeof manualPaymentSchema>;

export default function AddManualPaymentPage() {
  const { toast } = useToast();
  const [selectedTenantDetails, setSelectedTenantDetails] = useState<{apartment: string, unit: string, room: string} | null>(null);

  const form = useForm<ManualPaymentFormValues>({
    resolver: zodResolver(manualPaymentSchema),
    defaultValues: {
      paymentMonth: months[new Date().getMonth()],
      paymentYear: currentYear.toString(),
      paymentMethod: undefined,
    },
  });

  const watchedTenantId = form.watch('tenantId');

  useEffect(() => {
    if (watchedTenantId) {
      const tenant = mockTenants.find(t => t.id === watchedTenantId);
      if (tenant) {
        setSelectedTenantDetails({ apartment: tenant.apartment, unit: tenant.unit, room: tenant.room });
      } else {
        setSelectedTenantDetails(null);
      }
    } else {
      setSelectedTenantDetails(null);
    }
  }, [watchedTenantId]);

  function onSubmit(data: ManualPaymentFormValues) {
    console.log('Manual Payment Data:', data);
    // Handle file upload for data.screenshot if present
    // TODO: Implement API call to save manual payment
    toast({
      title: 'Manual Payment Recorded (Placeholder)',
      description: `Payment of KES ${data.amountPaid} for ${data.tenantId} has been noted.`,
      variant: 'default',
    });
    // form.reset(); 
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Add Manual Payment</h1>
        <Button variant="outline" asChild>
          <Link href="/landlord/payments"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Payments Overview</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><DollarSign className="mr-2 h-6 w-6 text-primary" />Payment Details</CardTitle>
              <CardDescription>Record a payment received manually (e.g., cash, direct bank transfer not via app).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField control={form.control} name="tenantId" render={({ field }) => (
                <FormItem><FormLabel className="flex items-center"><User className="mr-2 h-4 w-4"/>Select Tenant</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Choose tenant" /></SelectTrigger></FormControl>
                    <SelectContent>{mockTenants.map(t => <SelectItem key={t.id} value={t.id}>{t.name} ({t.unit} - {t.apartment})</SelectItem>)}</SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>

              {selectedTenantDetails && (
                <div className="p-3 border rounded-md bg-muted/50 text-sm">
                    <p><strong className="text-foreground">Apartment:</strong> {selectedTenantDetails.apartment}</p>
                    <p><strong className="text-foreground">Unit:</strong> {selectedTenantDetails.unit}</p>
                    <p><strong className="text-foreground">Room:</strong> {selectedTenantDetails.room}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              <FormField control={form.control} name="amountPaid" render={({ field }) => (
                <FormItem><FormLabel>Amount Paid (KES)</FormLabel><FormControl><Input type="number" placeholder="25000" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>

              <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                <FormItem><FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>

              <FormField control={form.control} name="transactionId" render={({ field }) => (
                <FormItem><FormLabel>Transaction ID / M-Pesa Code / Reference (Optional)</FormLabel><FormControl><Input placeholder="SFE123ABC4" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              
              <FormField control={form.control} name="paymentDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Payment Date</FormLabel>
                  <Popover><PopoverTrigger asChild><FormControl>
                      <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button></FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                  </Popover><FormMessage />
                </FormItem>
              )}/>
              
              <FormField control={form.control} name="screenshot" render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center"><Upload className="mr-2 h-4 w-4"/>Upload Screenshot (Optional)</FormLabel>
                    <FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} /></FormControl>
                    <FormDescription>For M-Pesa or Bank Transfer proof.</FormDescription>
                    <FormMessage />
                </FormItem>
              )}/>

              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormLabel>Notes (Optional)</FormLabel><FormControl><Input placeholder="Any additional notes about this payment" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>

            </CardContent>
          </Card>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Save className="mr-2 h-5 w-5" /> Record Payment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
