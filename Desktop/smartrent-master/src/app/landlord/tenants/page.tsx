
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Users, Eye, Edit3, Trash2, Search, Filter, Download } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from 'react';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  apartmentName: string;
  unitName: string;
  roomNumber: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
}

const mockTenants: Tenant[] = [
  { id: 'tenant001', name: 'John Doe', email: 'john.doe@example.com', phone: '0712345678', apartmentName: 'Greenwood Heights', unitName: 'A-101', roomNumber: '1', paymentStatus: 'Paid' },
  { id: 'tenant002', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '0723456789', apartmentName: 'Greenwood Heights', unitName: 'A-102', roomNumber: 'Main', paymentStatus: 'Unpaid' },
  { id: 'tenant003', name: 'Alice Brown', email: 'alice.brown@example.com', phone: '0734567890', apartmentName: 'Riverside Towers', unitName: 'B-201', roomNumber: 'Studio', paymentStatus: 'Paid' },
  { id: 'tenant004', name: 'Bob Johnson', email: 'bob.johnson@example.com', phone: '0745678901', apartmentName: 'Acacia Park View', unitName: 'C-305', roomNumber: '2B', paymentStatus: 'Partial' },
];

export default function TenantManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterApartment, setFilterApartment] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');

  // Mock apartment names for filter dropdown
  const apartmentNames = ['all', ...new Set(mockTenants.map(t => t.apartmentName))];

  const filteredTenants = mockTenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tenant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tenant.phone.includes(searchTerm) ||
                          tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesApartment = filterApartment === 'all' || tenant.apartmentName === filterApartment;
    const matchesPaymentStatus = filterPaymentStatus === 'all' || tenant.paymentStatus.toLowerCase() === filterPaymentStatus;
    return matchesSearch && matchesApartment && matchesPaymentStatus;
  });

  const handleViewProfile = (tenantId: string) => console.log('View profile for tenant:', tenantId);
  const handleEditTenant = (tenantId: string) => console.log('Edit tenant:', tenantId);
  const handleRemoveTenant = (tenantId: string) => {
    if (window.confirm(`Are you sure you want to remove tenant ${tenantId}? This action may mark their room as vacant.`)) {
      console.log('Remove tenant:', tenantId);
    }
  };
  const handleExport = () => console.log("Exporting tenant data:", filteredTenants);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Tenant Management</h1>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/landlord/tenants/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Register New Tenant
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-6 w-6 text-primary" />
            All Tenants
          </CardTitle>
          <CardDescription>
            View, search, filter, and manage all tenants registered under your properties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by Name, ID, Phone, Email..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="apartmentFilter" className="text-sm font-medium text-muted-foreground">Filter by Apartment</label>
                <Select value={filterApartment} onValueChange={setFilterApartment}>
                  <SelectTrigger id="apartmentFilter">
                    <SelectValue placeholder="All Apartments" />
                  </SelectTrigger>
                  <SelectContent>
                    {apartmentNames.map(name => (
                      <SelectItem key={name} value={name} className="capitalize">{name === 'all' ? 'All Apartments' : name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="paymentStatusFilter" className="text-sm font-medium text-muted-foreground">Filter by Payment Status</label>
                <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
                  <SelectTrigger id="paymentStatusFilter">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export Results
              </Button>
            </div>
          </div>

          {filteredTenants.length === 0 ? (
            <div className="text-center py-10">
              <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">No tenants match your criteria.</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters, or register a new tenant.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Tenant ID</TableHead>
                    <TableHead>Apartment</TableHead>
                    <TableHead>Unit/Room</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>{tenant.id}</TableCell>
                      <TableCell>{tenant.apartmentName}</TableCell>
                      <TableCell>{tenant.unitName} / {tenant.roomNumber}</TableCell>
                      <TableCell>
                        <div>{tenant.email}</div>
                        <div className="text-xs text-muted-foreground">{tenant.phone}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                            variant={tenant.paymentStatus === 'Paid' ? 'default' : (tenant.paymentStatus === 'Unpaid' ? 'destructive' : 'secondary')}
                            className={
                                tenant.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 
                                tenant.paymentStatus === 'Unpaid' ? 'bg-red-100 text-red-700' : 
                                'bg-yellow-100 text-yellow-700'
                            }
                        >
                          {tenant.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewProfile(tenant.id)} asChild title="View Tenant Profile">
                           <Link href={`/landlord/tenants/${tenant.id}`}><Eye className="h-4 w-4" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditTenant(tenant.id)} title="Edit Tenant">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveTenant(tenant.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title="Remove Tenant">
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
