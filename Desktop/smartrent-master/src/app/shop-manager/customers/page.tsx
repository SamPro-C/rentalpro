
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Search, Eye, Download } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ShopCustomer {
  id: string; // Tenant ID from SmartRent core
  name: string;
  apartmentUnit: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

const mockShopCustomers: ShopCustomer[] = [
  { id: 'tenant001', name: 'John Doe', apartmentUnit: 'Greenwood A-101', totalOrders: 5, totalSpent: 6500, lastOrderDate: '2024-07-10' },
  { id: 'tenant002', name: 'Jane Smith', apartmentUnit: 'Greenwood A-102', totalOrders: 2, totalSpent: 1500, lastOrderDate: '2024-07-05' },
  { id: 'tenant003', name: 'Alice Brown', apartmentUnit: 'Riverside B-201', totalOrders: 8, totalSpent: 12000, lastOrderDate: '2024-07-12' },
];

export default function ShopCustomerManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = mockShopCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.apartmentUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => console.log("Exporting customer data:", filteredCustomers);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Shop Customer Management</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2 h-6 w-6 text-primary" />Customer Overview</CardTitle>
          <CardDescription>View tenants who have placed orders through your shop.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-lg bg-muted/50 flex flex-col sm:flex-row gap-4 items-end">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by Customer Name, Unit, Tenant ID..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleExport} variant="outline"><Download className="mr-2 h-4 w-4" /> Export List</Button>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="mx-auto h-16 w-16 mb-4" />
              <p className="text-lg font-semibold">No customers match your criteria or no orders placed yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Tenant ID</TableHead>
                    <TableHead>Apartment/Unit</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Total Spent (KES)</TableHead>
                    <TableHead>Last Order Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                       <TableCell className="font-mono text-xs">{customer.id}</TableCell>
                      <TableCell>{customer.apartmentUnit}</TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell>{customer.totalSpent.toLocaleString()}</TableCell>
                      <TableCell>{customer.lastOrderDate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          {/* Link to a detailed customer view page (to be created) showing their order history */}
                          <Link href={`/shop-manager/customers/${customer.id}`}><Eye className="mr-1 h-4 w-4" />View History</Link>
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
