
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, ArrowLeft, Users, Building, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { mockApartmentList, mockTenantProfiles, mockWorkerProfiles } from '@/lib/mock-data';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const MOCK_APARTMENTS_FOR_SELECT = mockApartmentList.map(apt => ({ id: apt.id, name: apt.name }));
const MOCK_TENANTS_FOR_SELECT = mockTenantProfiles.map(t => ({ id: t.id, name: `${t.fullName} (${t.unitName} - ${t.apartmentName})`}));
const MOCK_WORKERS_FOR_SELECT = mockWorkerProfiles.map(w => ({ id: w.id, name: `${w.fullName} (${w.role})`}));


const recipientTypes = [
  { id: 'all_tenants', label: 'All Tenants' },
  { id: 'unpaid_tenants', label: 'All Unpaid Tenants (Rent Due)' },
  { id: 'paid_tenants', label: 'All Paid Tenants (Current Month)' },
  { id: 'specific_apartment_tenants', label: 'Tenants of Specific Apartment(s)' },
  { id: 'specific_tenants', label: 'Specific Tenant(s)' },
  { id: 'all_workers', label: 'All Workers' },
  { id: 'specific_workers', label: 'Specific Worker(s)' },
] as const;


const sendNotificationSchema = z.object({
  recipientType: z.enum(recipientTypes.map(rt => rt.id) as [string, ...string[]], {required_error: "Recipient type is required."}),
  specificApartmentIds: z.array(z.string()).optional(),
  specificTenantIds: z.array(z.string()).optional(),
  specificWorkerIds: z.array(z.string()).optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
  deliveryChannels: z.array(z.string()).refine(value => value.some(channel => channel), {
    message: "You have to select at least one delivery channel.",
  }),
}).superRefine((data, ctx) => {
    if(data.recipientType === 'specific_apartment_tenants' && (!data.specificApartmentIds || data.specificApartmentIds.length === 0)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select at least one apartment.", path: ["specificApartmentIds"]});
    }
    if(data.recipientType === 'specific_tenants' && (!data.specificTenantIds || data.specificTenantIds.length === 0)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select at least one tenant.", path: ["specificTenantIds"]});
    }
    if(data.recipientType === 'specific_workers' && (!data.specificWorkerIds || data.specificWorkerIds.length === 0)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select at least one worker.", path: ["specificWorkerIds"]});
    }
});


type SendNotificationFormValues = z.infer<typeof sendNotificationSchema>;

export default function SendNotificationPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  
  const initialRecipientType = searchParams.get('recipientType') as SendNotificationFormValues['recipientType'] || undefined;
  const initialRecipientIds = searchParams.get('recipientIds')?.split(',') || [];
  const initialSubject = searchParams.get('subject') || '';


  const form = useForm<SendNotificationFormValues>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: {
      recipientType: initialRecipientType,
      specificApartmentIds: initialRecipientType === 'specific_apartment_tenants' ? initialRecipientIds : [],
      specificTenantIds: initialRecipientType === 'specific_tenants' ? initialRecipientIds : [],
      specificWorkerIds: initialRecipientType === 'specific_workers' ? initialRecipientIds : [],
      subject: initialSubject,
      message: '',
      deliveryChannels: ['In-App'], // Default to In-App
    },
  });

  useEffect(() => {
    if(initialRecipientType) form.setValue('recipientType', initialRecipientType);
    if(initialSubject) form.setValue('subject', initialSubject);
    if(initialRecipientIds.length > 0){
        if(initialRecipientType === 'specific_apartment_tenants') form.setValue('specificApartmentIds', initialRecipientIds);
        if(initialRecipientType === 'specific_tenants') form.setValue('specificTenantIds', initialRecipientIds);
        if(initialRecipientType === 'specific_workers') form.setValue('specificWorkerIds', initialRecipientIds);
    }
  },[initialRecipientType, initialRecipientIds, initialSubject, form])

  const watchedRecipientType = form.watch('recipientType');

  function onSubmit(data: SendNotificationFormValues) {
    console.log('Send Notification Data:', data);
    // TODO: Implement API call to send notification based on recipients and channels
    if(window.confirm("Are you sure you want to send this notification to the selected recipients?")){
        toast({
            title: 'Notification Sent (Placeholder)',
            description: `Your message "${data.subject}" is being sent. Check console for details.`,
            variant: 'default',
        });
        // form.reset(); // Consider if reset is always desired or only on full success
    }
  }
  
  const deliveryChannelOptions = [
    { id: 'In-App', label: 'In-App Notification' },
    { id: 'SMS', label: 'SMS Message' },
    { id: 'Email', label: 'Email' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Send New Notification</h1>
        <Button variant="outline" asChild>
          <Link href="/landlord/notifications"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Notifications</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><Send className="mr-2 h-6 w-6 text-primary" />Compose Notification</CardTitle>
              <CardDescription>Select recipients and craft your message.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="recipientType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select Recipient Group</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value} // Ensure this is controlled
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      >
                        {recipientTypes.map(type => (
                             <FormItem key={type.id} className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/50 has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:border-primary">
                                <FormControl>
                                  <RadioGroupItem value={type.id} id={type.id}/>
                                </FormControl>
                                <FormLabel htmlFor={type.id} className="font-normal cursor-pointer w-full">{type.label}</FormLabel>
                              </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            {watchedRecipientType === 'specific_apartment_tenants' && (
                <FormField
                    control={form.control} name="specificApartmentIds"
                    render={() => (
                    <FormItem>
                        <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4"/>Select Apartments</FormLabel>
                        <FormDescription>Select all apartments whose tenants should receive this notification.</FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border p-2 rounded-md">
                        {MOCK_APARTMENTS_FOR_SELECT.map((apt) => (
                            <FormField key={apt.id} control={form.control} name="specificApartmentIds"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-background">
                                <FormControl><Checkbox checked={field.value?.includes(apt.id)} onCheckedChange={(checked) => checked ? field.onChange([...(field.value || []), apt.id]) : field.onChange(field.value?.filter(id => id !== apt.id))} /></FormControl>
                                <FormLabel className="font-normal">{apt.name}</FormLabel>
                                </FormItem>
                            )} />
                        ))}
                        </div><FormMessage />
                    </FormItem>
                    )}
                />
            )}
            {watchedRecipientType === 'specific_tenants' && (
                 <FormField control={form.control} name="specificTenantIds"
                    render={() => (
                    <FormItem>
                        <FormLabel className="flex items-center"><Users className="mr-2 h-4 w-4"/>Select Specific Tenants</FormLabel>
                        <FormDescription>Select individual tenants to receive this notification.</FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border p-2 rounded-md">
                        {MOCK_TENANTS_FOR_SELECT.map((tenant) => (
                            <FormField key={tenant.id} control={form.control} name="specificTenantIds"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-background">
                                <FormControl><Checkbox checked={field.value?.includes(tenant.id)} onCheckedChange={(checked) => checked ? field.onChange([...(field.value || []), tenant.id]) : field.onChange(field.value?.filter(id => id !== tenant.id))} /></FormControl>
                                <FormLabel className="font-normal">{tenant.name}</FormLabel>
                                </FormItem>
                            )} />
                        ))}
                        </div><FormMessage />
                    </FormItem>
                    )}
                />
            )}
             {watchedRecipientType === 'specific_workers' && (
                 <FormField control={form.control} name="specificWorkerIds"
                    render={() => (
                    <FormItem> 
                        <FormLabel className="flex items-center"><Users className="mr-2 h-4 w-4"/>Select Specific Workers</FormLabel>
                        <FormDescription>Select individual workers to receive this notification.</FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border p-2 rounded-md">
                        {MOCK_WORKERS_FOR_SELECT.map((worker) => (
                            <FormField key={worker.id} control={form.control} name="specificWorkerIds"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-background">
                                <FormControl><Checkbox checked={field.value?.includes(worker.id)} onCheckedChange={(checked) => checked ? field.onChange([...(field.value || []), worker.id]) : field.onChange(field.value?.filter(id => id !== worker.id))} /></FormControl>
                                <FormLabel className="font-normal">{worker.name}</FormLabel>
                                </FormItem>
                            )} />
                        ))}
                        </div><FormMessage />
                    </FormItem>
                    )}
                />
            )}


              <FormField control={form.control} name="subject" render={({ field }) => (
                <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="E.g., Important Maintenance Update" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem><FormLabel>Message Content</FormLabel><FormControl><Textarea placeholder="Type your message here..." {...field} rows={6} /></FormControl><FormMessage /></FormItem>
              )}/>
              
                <FormField
                    control={form.control}
                    name="deliveryChannels"
                    render={() => (
                        <FormItem>
                        <FormLabel>Delivery Channels</FormLabel>
                        <FormDescription>Select how this notification should be delivered.</FormDescription>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            {deliveryChannelOptions.map((channel) => (
                            <FormField
                                key={channel.id}
                                control={form.control}
                                name="deliveryChannels"
                                render={({ field }) => {
                                return (
                                    <FormItem
                                    key={channel.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm bg-background"
                                    >
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value?.includes(channel.id)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                            ? field.onChange([...(field.value || []), channel.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                    (value) => value !== channel.id
                                                )
                                                );
                                        }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {channel.label}
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
          
          <Card className="bg-amber-50 border-amber-200 shadow-md">
            <CardHeader>
                <CardTitle className="text-amber-700 flex items-center"><AlertTriangle className="mr-2 h-5 w-5"/>Confirmation</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-amber-600">
                    Please review your message and recipient selection carefully. Mass notifications cannot be undone once sent. 
                    SMS and Email channels may incur costs.
                </p>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Send className="mr-2 h-5 w-5" /> Send Notification
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
