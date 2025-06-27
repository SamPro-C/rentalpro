'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, Edit3, UserX, UserCheck, Search, Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockAdminShopManagerUsers, type AdminShopManagerUser } from '@/lib/mock-data';


export default function ManageShopManagersAdminPage() {
  const [shopManagers, setShopManagers] = useState<AdminShopManagerUser[]>(mockAdminShopManagerUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredShopManagers = shopManagers.filter(manager =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.phone.includes(searchTerm) ||
    manager.shopManagerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (managerId: string, currentStatus: 'Active' | 'Inactive') => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    if (window.confirm(`Are you sure you want to set shop manager ${managerId} to ${newStatus}?`)) {
      setShopManagers(prev => prev.map(m => m.shopManagerId === managerId ? { ...m, status: newStatus } : m));
      toast({ title: 'Shop Manager Status Updated', description: `Shop Manager ${managerId} is now ${newStatus}.` });
    }
  };

  const handleDelete = (managerId: string) => {
    if (window.confirm(`Are you sure you want to DELETE shop manager ${managerId}? This action is permanent.`)) {
      setShopManagers(prev => prev.filter(m => m.shopManagerId !== managerId));
      toast({ title: 'Shop Manager Deleted', description: `Shop Manager ${managerId} has been deleted.`, variant: 'destructive' });
    }
  };
  
  const handleViewProfile = (managerId: string) => toast({title: "View Profile", description: `Viewing profile for shop manager ${managerId} (placeholder).`});
  const handleEditDetails = (managerId: string) => toast({title: "Edit Details", description: `Editing details for shop manager ${managerId} (placeholder).`});


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Manage Shop Managers</h1>
      <CardDescription>
        Oversee all shop manager accounts for the e-commerce platform.
      </CardDescription>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ShoppingCart className="mr-2 h-6 w-6 text-primary" />All Shop Managers</CardTitle>
           <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by Name, Email, Phone, ID..."
                className="pl-8 w-full md:w-1/2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredShopManagers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <ShoppingCart className="mx-auto h-16 w-16 mb-4" />
              <p className="text-lg font-semibold">No shop managers found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Manager ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Shop Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShopManagers.map((manager) => (
                    <TableRow key={manager.shopManagerId}>
                      <TableCell className="font-medium">{manager.name}</TableCell>
                      <TableCell>{manager.shopManagerId}</TableCell>
                      <TableCell>{manager.email}</TableCell>
                      <TableCell>{manager.phone}</TableCell>
                      <TableCell>{manager.shopName || 'Platform Default Shop'}</TableCell>
                      <TableCell>
                        <Badge variant={manager.status === 'Active' ? 'default' : 'destructive'}
                               className={manager.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {manager.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewProfile(manager.shopManagerId)} title="View Profile">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditDetails(manager.shopManagerId)} title="Edit Details">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleToggleStatus(manager.shopManagerId, manager.status)} 
                            title={manager.status === 'Active' ? 'Deactivate' : 'Activate'}
                            className={manager.status === 'Active' ? 'text-orange-500 hover:text-orange-600' : 'text-green-500 hover:text-green-600'}
                        >
                          {manager.status === 'Active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(manager.shopManagerId)} title="Delete Shop Manager" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                          <Trash2 className="h-4 w-4" />
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
