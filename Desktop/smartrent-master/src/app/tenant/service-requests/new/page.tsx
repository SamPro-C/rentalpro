
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Send, ArrowLeft, Upload, Building, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

const requestTypes = ['Plumbing', 'Electrical', 'HVAC', 'Pest Control', 'Leak', 'Appliance Repair', 'General Maintenance', 'Other'];
const locationsInUnit = ['Bathroom', 'Kitchen', 'Living Room', 'Bedroom 1', 'Bedroom 2', 'Balcony', 'General Area', 'Other'];
const priorities = ['Normal', 'Urgent', 'Low'];

const serviceRequestSchema = z.object({
  requestType: z.string({ required_error: "Request type is required." }),
  locationOfIssue: z.string({ required_error: "Location of issue is required." }),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  priority: z.enum(['Urgent', 'Normal', 'Low']).default('Normal'),
  attachedMedia: z.array(z.instanceof(File)).max(3, "You can upload a maximum of 3 files.").optional(),
});

type ServiceRequestFormValues = z.infer<typeof serviceRequestSchema>;

export default function SubmitServiceRequestPage() {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const form = useForm<ServiceRequestFormValues>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      requestType: undefined,
      locationOfIssue: undefined,
      description: '',
      priority: 'Normal',
      attachedMedia: [],
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + uploadedFiles.length > 3) {
        toast({ title: "Upload Limit Exceeded", description: "You can only upload a maximum of 3 files.", variant: "destructive" });
        return;
    }
    setUploadedFiles(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setFilePreviews(prev => [...prev, ...newPreviews]);
    
    form.setValue('attachedMedia', [...(form.getValues('attachedMedia') || []), ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
    form.setValue('attachedMedia', (form.getValues('attachedMedia') || []).filter((_,i) => i !== index));
  };


  function onSubmit(data: ServiceRequestFormValues) {
    // Include uploadedFiles in the data sent to the backend
    const submissionData = { ...data, attachedMediaBlobs: uploadedFiles };
    console.log('New Service Request Data:', submissionData);
    // TODO: Implement API call to submit service request, including file uploads
    toast({
      title: 'Service Request Submitted (Placeholder)',
      description: `Your request for ${data.requestType} has been sent.`,
      variant: 'default',
    });
    form.reset();
    setUploadedFiles([]);
    setFilePreviews([]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Submit New Service Request</h1>
        <Button variant="outline" asChild>
          <Link href="/tenant/service-requests"><ArrowLeft className="mr-2 h-4 w-4"/>Back to My Requests</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><ClipboardList className="mr-2 h-6 w-6 text-primary" />Request Details</CardTitle>
              <CardDescription>Please provide as much detail as possible about the issue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="requestType" render={({ field }) => (
                  <FormItem><FormLabel>Type of Issue</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select issue type" /></SelectTrigger></FormControl>
                      <SelectContent>{requestTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="locationOfIssue" render={({ field }) => (
                  <FormItem><FormLabel>Location of Issue (in your unit)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger></FormControl>
                      <SelectContent>{locationsInUnit.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )}/>
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Detailed Description of the Issue</FormLabel>
                  <FormControl><Textarea placeholder="Explain the problem clearly..." {...field} rows={5} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              
              <FormField control={form.control} name="priority" render={({ field }) => (
                  <FormItem><FormLabel>Priority (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger></FormControl>
                      <SelectContent>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormDescription>Let us know how urgent this request is.</FormDescription>
                    <FormMessage />
                  </FormItem>
              )}/>

              <FormItem>
                <FormLabel className="flex items-center"><Upload className="mr-2 h-4 w-4"/>Attach Photos/Videos (Optional, Max 3)</FormLabel>
                <FormControl>
                    <Input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} disabled={uploadedFiles.length >= 3}/>
                </FormControl>
                <FormDescription>Helps us understand the issue better. Max file size 5MB each.</FormDescription>
                <FormMessage />
                {filePreviews.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {filePreviews.map((previewUrl, index) => (
                            <div key={index} className="relative group">
                                <Image src={previewUrl} alt={`Preview ${index + 1}`} width={100} height={100} className="rounded-md object-cover w-full h-24 border" />
                                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeFile(index)}>
                                    <Trash2 className="h-3 w-3"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
              </FormItem>

            </CardContent>
          </Card>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Send className="mr-2 h-5 w-5" /> Submit Request
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
