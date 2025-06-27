
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Bell, Search, Filter, Eye, Trash2, Send, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItem {
  id: string;
  type: 'Payment' | 'Service Request' | 'Worker Update' | 'System' | 'Tenant Registration';
  subject: string;
  snippet: string;
  sender: string; // "System", "Tenant: John Doe", "Worker: Mark Lee"
  timestamp: Date;
  isRead: boolean;
  link?: string; // Optional link to relevant page e.g. /landlord/tenants/tenant001
}

const mockNotifications: NotificationItem[] = [
  { id: 'notif001', type: 'Payment', subject: 'New Payment Received', snippet: 'KES 25,000 received from John Doe for Unit A-101.', sender: 'System', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), isRead: false, link: '/landlord/payments' },
  { id: 'notif002', type: 'Service Request', subject: 'New Service Request SR005', snippet: 'Tenant Bob Johnson submitted: Pest control needed for ants...', sender: 'Tenant: Bob Johnson', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), isRead: true, link: '/landlord/service-requests/SR005' },
  { id: 'notif003', type: 'Worker Update', subject: 'Task Completed by Mark Lee', snippet: 'Worker Mark Lee marked task TSK001 (Fix leaking pipe) as completed.', sender: 'Worker: Mark Lee', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), isRead: true, link: '/landlord/workers/worker001' },
  { id: 'notif004', type: 'System', subject: 'Scheduled Maintenance', snippet: 'System maintenance scheduled for June 15th, 2AM - 4AM.', sender: 'System Admin', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), isRead: false },
  { id: 'notif005', type: 'Tenant Registration', subject: 'New Tenant Registered', snippet: 'Tenant Sarah Williams has been successfully registered to Unit D-405.', sender: 'System', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), isRead: true, link: '/landlord/tenants/tenantXYZ' },
];

const notificationTypesForFilter = ['all', 'Payment', 'Service Request', 'Worker Update', 'System', 'Tenant Registration'];
const readStatusForFilter = ['all', 'Read', 'Unread'];


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterReadStatus, setFilterReadStatus] = useState('all');

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notif.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notif.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesReadStatus = filterReadStatus === 'all' || (filterReadStatus === 'Read' && notif.isRead) || (filterReadStatus === 'Unread' && !notif.isRead);
    return matchesSearch && matchesType && matchesReadStatus;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: true} : n));
    console.log("Mark notification as read:", id);
  };
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, isRead: true})));
    console.log("Marking all as read");
  };
  const handleDeleteNotification = (id: string) => {
    if(window.confirm("Are you sure you want to delete this notification?")) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        console.log("Delete notification:", id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Notifications & Communication</h1>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/landlord/notifications/send">
            <Send className="mr-2 h-5 w-5" />
            Send New Notification
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-6 w-6 text-primary" />
            Your Notifications
          </CardTitle>
          <CardDescription>
            View and manage all system alerts and communications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-lg bg-muted/50 space-y-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search notifications by subject, content, or sender..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
              <div>
                <label htmlFor="typeFilterNotif" className="text-sm font-medium text-muted-foreground">Filter by Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger id="typeFilterNotif"><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent>{notificationTypesForFilter.map(t => <SelectItem key={t} value={t} className="capitalize">{t === 'all' ? 'All Types' : t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="readStatusFilterNotif" className="text-sm font-medium text-muted-foreground">Filter by Status</label>
                <Select value={filterReadStatus} onValueChange={setFilterReadStatus}>
                  <SelectTrigger id="readStatusFilterNotif"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>{readStatusForFilter.map(s => <SelectItem key={s} value={s} className="capitalize">{s === 'all' ? 'All Statuses' : s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={handleMarkAllAsRead} variant="outline" className="w-full md:w-auto">Mark All as Read</Button>
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">No notifications match your criteria.</p>
              <p className="text-sm text-muted-foreground">You're all caught up or try adjusting filters.</p>
            </div>
          ) : (
            <ul className="space-y-4">
                {filteredNotifications.map((notif) => (
                    <li key={notif.id} className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow ${!notif.isRead ? 'bg-primary/5 border-primary/20' : 'bg-background'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className={`text-lg font-semibold ${!notif.isRead ? 'text-primary' : 'text-foreground'}`}>{notif.subject}</h3>
                                <Badge variant="outline" className="text-xs capitalize mb-1">{notif.type}</Badge>
                                <p className="text-sm text-muted-foreground mt-1">{notif.snippet}</p>
                                <p className="text-xs text-muted-foreground/80 mt-2">
                                    From: {notif.sender} &bull; {formatDistanceToNow(notif.timestamp, { addSuffix: true })}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-1 items-end sm:items-center shrink-0 ml-2">
                                {!notif.isRead && (
                                    <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notif.id)} title="Mark as Read">
                                        <Eye className="h-4 w-4 text-green-600"/>
                                    </Button>
                                )}
                                {notif.link && (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={notif.link}>View Details</Link>
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteNotification(notif.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title="Delete Notification">
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
