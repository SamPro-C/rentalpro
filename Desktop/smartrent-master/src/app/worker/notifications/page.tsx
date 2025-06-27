
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Eye, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkerNotification {
  id: string;
  type: 'New Task' | 'Schedule Change' | 'Announcement' | 'Urgent Alert';
  subject: string;
  snippet: string;
  timestamp: Date;
  isRead: boolean;
  link?: string; // Optional link to relevant page e.g., /worker/tasks/TSK001
}

const mockWorkerNotifications: WorkerNotification[] = [
  { id: 'wnotif001', type: 'New Task', subject: 'New Task Assigned: TSK015', snippet: 'A new plumbing task "Fix shower drain in Unit C-402" has been assigned to you.', timestamp: new Date(Date.now() - 30 * 60 * 1000), isRead: false, link: '/worker/tasks/TSK015' },
  { id: 'wnotif002', type: 'Schedule Change', subject: 'Your Shift on July 18th Updated', snippet: 'Your shift for July 18th has been changed to 10:00 AM - 18:00 PM for Greenwood Heights.', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), isRead: true, link: '/worker/schedule' },
  { id: 'wnotif003', type: 'Announcement', subject: 'Team Meeting Reminder', snippet: 'Reminder: All maintenance staff meeting tomorrow at 8:00 AM in the main office.', timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000), isRead: false },
  { id: 'wnotif004', type: 'Urgent Alert', subject: 'Emergency: Water Leak Reported at Riverside Towers', snippet: 'An urgent water leak has been reported at Riverside Towers, Unit D-10. Please attend immediately if on duty and nearby.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), isRead: false },
];

const notificationTypesForFilter = ['all', 'New Task', 'Schedule Change', 'Announcement', 'Urgent Alert'];
const readStatusForFilter = ['all', 'Read', 'Unread'];

export default function WorkerNotificationsPage() {
  const [notifications, setNotifications] = useState<WorkerNotification[]>(mockWorkerNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterReadStatus, setFilterReadStatus] = useState('all');

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notif.snippet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesReadStatus = filterReadStatus === 'all' || (filterReadStatus === 'Read' && notif.isRead) || (filterReadStatus === 'Unread' && !notif.isRead);
    return matchesSearch && matchesType && matchesReadStatus;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: true} : n));
  };
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, isRead: true})));
  };
  const handleDeleteNotification = (id: string) => {
    if(window.confirm("Are you sure you want to delete this notification?")) {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">My Notifications</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Bell className="mr-2 h-6 w-6 text-primary" />Your Inbox</CardTitle>
          <CardDescription>Updates, alerts, and task assignments from your landlord.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-lg bg-muted/50 space-y-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search notifications..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
              <div>
                <label htmlFor="typeFilterNotifWorker" className="text-sm font-medium text-muted-foreground">Filter by Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger id="typeFilterNotifWorker"><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent>{notificationTypesForFilter.map(t => <SelectItem key={t} value={t} className="capitalize">{t === 'all' ? 'All Types' : t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="readStatusFilterNotifWorker" className="text-sm font-medium text-muted-foreground">Filter by Status</label>
                <Select value={filterReadStatus} onValueChange={setFilterReadStatus}>
                  <SelectTrigger id="readStatusFilterNotifWorker"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>{readStatusForFilter.map(s => <SelectItem key={s} value={s} className="capitalize">{s === 'all' ? 'All Statuses' : s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={handleMarkAllAsRead} variant="outline" className="w-full md:w-auto">Mark All as Read</Button>
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="text-center py-10">
              <Bell className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
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
                                    {formatDistanceToNow(notif.timestamp, { addSuffix: true })}
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
