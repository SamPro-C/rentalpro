
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, Search, Filter, CalendarDays } from 'lucide-react';
import { useState, useMemo } from 'react';
import { mockAdminAuditLogEntries, type AdminAuditLogEntry } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const userRolesForFilter = ['all', 'Admin', 'Landlord', 'Tenant', 'Worker', 'Shop Manager', 'System'];
const actionTypesForFilter = ['all', 'LoginSuccess', 'LoginFailed', 'Logout', 'UserCreated', 'UserUpdated', 'UserDeactivated', 'PropertyAdded', 'PropertyUpdated', 'SettingChanged', 'FinancialTransaction', 'SecurityEvent', 'TaskCreated', 'TaskUpdated'];

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLogEntry[]>(mockAdminAuditLogEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUserRole, setFilterUserRole] = useState('all');
  const [filterActionType, setFilterActionType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (log.affectedEntityId && log.affectedEntityId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (log.ipAddress && log.ipAddress.includes(searchTerm));
      
      let matchesDate = true;
      if (startDate && log.timestamp) {
          matchesDate = new Date(log.timestamp) >= new Date(startDate);
      }
      if (endDate && log.timestamp && matchesDate) {
          matchesDate = new Date(log.timestamp) <= new Date(new Date(endDate).setHours(23,59,59,999)); 
      }

      const matchesRole = filterUserRole === 'all' || log.role === filterUserRole;
      const matchesAction = filterActionType === 'all' || log.action.startsWith(filterActionType);

      return matchesSearch && matchesDate && matchesRole && matchesAction;
    });
  }, [logs, searchTerm, startDate, endDate, filterUserRole, filterActionType]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">System Audit Logs</h1>
      <CardDescription>
        Track critical system events and user actions for security, compliance, and troubleshooting.
      </CardDescription>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Activity className="mr-2 h-6 w-6 text-primary" />Activity Logs</CardTitle>
           <div className="mt-4 p-4 border rounded-lg bg-muted/50 space-y-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search logs (e.g., User, Action, Entity ID, IP)..."
                        className="pl-8 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="startDateAudit" className="text-sm font-medium text-muted-foreground">Start Date</label>
                        <Input id="startDateAudit" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10"/>
                    </div>
                     <div>
                        <label htmlFor="endDateAudit" className="text-sm font-medium text-muted-foreground">End Date</label>
                        <Input id="endDateAudit" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10"/>
                    </div>
                    <div>
                        <label htmlFor="roleFilterAudit" className="text-sm font-medium text-muted-foreground">User Role</label>
                        <Select value={filterUserRole} onValueChange={setFilterUserRole}>
                            <SelectTrigger id="roleFilterAudit" className="h-10">
                                <SelectValue placeholder="Filter by User Role" />
                            </SelectTrigger>
                            <SelectContent>
                                {userRolesForFilter.map(role => (
                                    <SelectItem key={role} value={role} className="capitalize">
                                        {role === 'all' ? 'All Roles' : role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <label htmlFor="actionFilterAudit" className="text-sm font-medium text-muted-foreground">Action Type</label>
                         <Select value={filterActionType} onValueChange={setFilterActionType}>
                            <SelectTrigger id="actionFilterAudit" className="h-10">
                                <SelectValue placeholder="Filter by Action Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {actionTypesForFilter.map(action => (
                                    <SelectItem key={action} value={action} className="capitalize">
                                        {action === 'all' ? 'All Actions' : action}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredLogs.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">
                <Activity className="mx-auto h-16 w-16 mb-4" />
                <p className="text-lg font-semibold">No audit logs match your criteria.</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Affected Entity</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs whitespace-nowrap">{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell><Badge variant="secondary">{log.role}</Badge></TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.affectedEntityId || 'N/A'}</TableCell>
                      <TableCell>{log.ipAddress || 'N/A'}</TableCell>
                      <TableCell className="text-xs max-w-sm truncate" title={log.details}>{log.details || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Log retention policy: 90 days. For older logs, please contact support.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
