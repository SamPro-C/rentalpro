'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BellRing, Send, Edit3, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockAdminNotificationTemplates, type AdminNotificationTemplate } from '@/lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminSystemNotificationsPage() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<AdminNotificationTemplate[]>(mockAdminNotificationTemplates);

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic form data retrieval for demo
    const formData = new FormData(e.target as HTMLFormElement);
    const target = formData.get('announcementTarget');
    const subject = formData.get('announcementSubject');
    const message = formData.get('announcementMessage');
    console.log("Sending announcement:", {target, subject, message});
    toast({ title: "Announcement Sent (Placeholder)", description: `Announcement "${subject}" is being sent to ${target}.`});
    (e.target as HTMLFormElement).reset();
  };

  const handleEditTemplate = (templateId: string) => {
    toast({ title: "Edit Template", description: `Editing template ${templateId} (UI placeholder).`});
    // Actual navigation or modal for editing
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">System Notifications & Announcements</h1>
      <CardDescription>
        Manage notification templates and send system-wide announcements.
      </CardDescription>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><Send className="mr-2 h-5 w-5 text-primary"/>Send System Announcement</CardTitle>
        </CardHeader>
        <form onSubmit={handleSendAnnouncement}>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="announcementTarget">Target Audience</Label>
                <Select name="announcementTarget" required>
                    <SelectTrigger id="announcementTarget">
                        <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all_users">All Users</SelectItem>
                        <SelectItem value="all_landlords">All Landlords</SelectItem>
                        <SelectItem value="all_tenants">All Tenants</SelectItem>
                        <SelectItem value="all_workers">All Workers</SelectItem>
                        <SelectItem value="all_shop_managers">All Shop Managers</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="announcementSubject">Subject</Label>
                <Input id="announcementSubject" name="announcementSubject" placeholder="e.g., Scheduled System Maintenance" required/>
            </div>
            <div>
                <Label htmlFor="announcementMessage">Message</Label>
                <Textarea id="announcementMessage" name="announcementMessage" placeholder="Enter your announcement content..." rows={5} required/>
            </div>
            {/* Placeholder for delivery channels (In-App, Email, SMS) */}
            <div className="text-sm text-muted-foreground">
                Delivery channels (In-App, Email, SMS) will be configurable here.
            </div>
        </CardContent>
        <CardFooter>
            <Button type="submit" size="lg"><Send className="mr-2 h-4 w-4"/> Send Announcement</Button>
        </CardFooter>
        </form>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex items-center"><BellRing className="mr-2 h-5 w-5 text-primary"/>Manage Notification Templates</CardTitle>
          <Button variant="outline" size="sm" onClick={() => toast({title: "Add Template", description: "UI for adding new template."})}>
            <PlusCircle className="mr-2 h-4 w-4"/> Add New Template
          </Button>
        </CardHeader>
        <CardContent>
            {templates.length === 0 ? (
                 <div className="text-center py-10 text-muted-foreground">
                    <BellRing className="mx-auto h-12 w-12 mb-2"/>
                    <p className="text-lg font-medium">No notification templates found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Template Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Channels</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {templates.map(template => (
                                <TableRow key={template.id}>
                                    <TableCell className="font-medium">{template.name}</TableCell>
                                    <TableCell>{template.type}</TableCell>
                                    <TableCell>{template.channels.join(', ')}</TableCell>
                                    <TableCell>{template.lastUpdated}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template.id)}>
                                            <Edit3 className="mr-2 h-4 w-4"/> Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
