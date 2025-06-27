
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, Edit3, UserX, UserCheck, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockAdminTenantUsers, type AdminTenantUser } from '@/lib/mock-data';

export default function ManageTenantsAdminPage() {
  const [tenants, setTenants] = useState<AdminTenantUser[]>(mockAdminTenantUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone.includes(searchTerm) ||
    tenant.tenantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.apartmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (tenantId: string, currentStatus: 'Active' | 'Inactive') => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    if (window.confirm(`Are you sure you want to set tenant ${tenantId} to ${newStatus}?`)) {
      setTenants(prev => prev.map(t => t.tenantId === tenantId ? { ...t, status: newStatus } : t));
      toast({ title: 'Tenant Status Updated', description: `Tenant ${tenantId} is now ${newStatus}.` });
    }
  };

  const handleDelete = (tenantId: string) => {
    if (window.confirm(`Are you sure you want to DELETE tenant ${tenantId}? This action is permanent.`)) {
      setTenants(prev => prev.filter(t => t.tenantId !== tenantId));
      toast({ title: 'Tenant Deleted', description: `Tenant ${tenantId} has been deleted.`, variant: 'destructive' });
    }
  };
  
  const handleViewProfile = (tenantId: string) => toast({title: "View Profile", description: `Viewing profile for tenant ${tenantId} (placeholder).`});
  const handleEditDetails = (tenantId: string) => toast({title: "Edit Details", description: `Editing details for tenant ${tenantId} (placeholder).`});

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Manage All Tenants</h1>
      <CardDescription>
        Oversee all tenant accounts across the platform.
      </CardDescription>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2 h-6 w-6 text-primary" />All System Tenants</CardTitle>
           <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by Name, Email, Phone, Tenant ID, Apartment..."
                className="pl-8 w-full md:w-1/2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTenants.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="mx-auto h-16 w-16 mb-4" />
              <p className="text-lg font-semibold">No tenants found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Tenant ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Apartment/Unit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map((tenant) => (
                    <TableRow key={tenant.tenantId}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>{tenant.tenantId}</TableCell>
                      <TableCell>{tenant.email}</TableCell>
                      <TableCell>{tenant.phone}</TableCell>
                      <TableCell>{tenant.apartmentName} / {tenant.unitName}</TableCell>
                      <TableCell>
                        <Badge variant={tenant.status === 'Active' ? 'default' : 'destructive'}
                               className={tenant.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {tenant.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewProfile(tenant.tenantId)} title="View Profile">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditDetails(tenant.tenantId)} title="Edit Details">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleToggleStatus(tenant.tenantId, tenant.status)} 
                            title={tenant.status === 'Active' ? 'Deactivate' : 'Activate'}
                            className={tenant.status === 'Active' ? 'text-orange-500 hover:text-orange-600' : 'text-green-500 hover:text-green-600'}
                        >
                          {tenant.status === 'Active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(tenant.tenantId)} title="Delete Tenant" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
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
      </Card> {/* This was the missing closing tag */}
    </div>
  );
}
