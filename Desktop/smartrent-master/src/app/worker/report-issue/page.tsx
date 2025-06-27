
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
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
import { ClipboardEdit, Send, ArrowLeft, Upload, Building, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useState } from 'react';
import NextImage from 'next/image'; // Renamed to avoid conflict
import { mockWorkerProfiles } from '@/app/landlord/workers/[workerId]/page';
import { useSearchParams } from 'next/navigation';

// Simulate fetching data for a specific worker (e.g., worker001)
const currentWorker = mockWorkerProfiles.find(w => w.id === 'worker001');

const reportIssueSchema = z.object({
  title: z.string().min(5, 'Report title is required (min 5 chars).'),
  associatedApartmentId: z.string({ required_error: "Apartment selection is required." }),
  associatedUnit: z.string().optional(), // e.g. "Unit A-101" or "Common Area"
  description: z.string().min(10, 'Detailed description is required (min 10 chars).'),
  attachedMedia: z.array(z.instanceof(File)).max(3, "You can upload a maximum of 3 files.").optional(),
});

type ReportIssueFormValues = z.infer<typeof reportIssueSchema>;

export default function WorkerReportIssuePage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const prefillTaskId = searchParams.get('taskId'); // For pre-filling if navigated from a task

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const form = useForm<ReportIssueFormValues>({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: {
      title: prefillTaskId ? `Issue regarding Task ${prefillTaskId}` : '',
      associatedApartmentId: undefined,
      description: '',
      attachedMedia: [],
    },
  });
  
  if (!currentWorker) {
    return <div className="text-center text-destructive p-8">Error: Could not load worker data.</div>;
  }

  const assignedApartmentOptions = currentWorker.assignedApartments.map(apt => ({label: apt.name, value: apt.id}));


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

  function onSubmit(data: ReportIssueFormValues) {
    const submissionData = { ...data, attachedMediaBlobs: uploadedFiles, workerId: currentWorker?.id };
    console.log('New Issue Report Data:', submissionData);
    // TODO: Implement API call to submit issue report
    toast({
      title: 'Issue Report Submitted (Placeholder)',
      description: `Your report "${data.title}" has been sent to the landlord.`,
      variant: 'default',
    });
    form.reset({ title: '', associatedApartmentId: undefined, associatedUnit: '', description: '', attachedMedia: [] });
    setUploadedFiles([]);
    setFilePreviews([]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Report an Issue</h1>
        {/* Optionally, add a back button if navigated from tasks page */}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center"><ClipboardEdit className="mr-2 h-6 w-6 text-primary" />Issue Details</CardTitle>
              <CardDescription>Report any problems or observations to your landlord.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Report Title / Subject</FormLabel><FormControl><Input placeholder="E.g., Damaged Fixture in Common Area" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="associatedApartmentId" render={({ field }) => (
                  <FormItem><FormLabel className="flex items-center"><Building className="mr-1 h-4 w-4"/>Associated Apartment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select apartment" /></SelectTrigger></FormControl>
                      <SelectContent>{assignedApartmentOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="associatedUnit" render={({ field }) => (
                  <FormItem><FormLabel className="flex items-center"><Home className="mr-1 h-4 w-4"/>Specific Unit/Area (Optional)</FormLabel><FormControl><Input placeholder="E.g., Unit B-201, Lobby, Parking Lot" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Detailed Description of the Issue</FormLabel>
                  <FormControl><Textarea placeholder="Explain the problem clearly, including when you noticed it..." {...field} rows={5} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              
              <FormItem>
                <FormLabel className="flex items-center"><Upload className="mr-2 h-4 w-4"/>Attach Photos/Videos (Optional, Max 3)</FormLabel>
                <FormControl>
                    <Input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} disabled={uploadedFiles.length >= 3}/>
                </FormControl>
                <FormDescription>Helps the landlord understand the issue better. Max file size 5MB each.</FormDescription>
                <FormMessage />
                {filePreviews.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {filePreviews.map((previewUrl, index) => (
                            <div key={index} className="relative group">
                                <NextImage src={previewUrl} alt={`Preview ${index + 1}`} width={100} height={100} className="rounded-md object-cover w-full h-24 border" data-ai-hint="issue evidence"/>
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
              <Send className="mr-2 h-5 w-5" /> Submit Report
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

