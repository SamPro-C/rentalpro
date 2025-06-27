
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Filter, Eye, Download } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Order {
  id: string;
  customerName: string; // Tenant Name
  apartmentUnit: string;
  orderDate: string;
  totalAmount: number;
  status: 'New' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Canceled';
  paymentStatus: 'Paid' | 'Pending';
}

const mockOrders: Order[] = [
  { id: 'ORD1023', customerName: 'Tenant A', apartmentUnit: 'Greenwood A-101', orderDate: '2024-07-15', totalAmount: 1200, status: 'Processing', paymentStatus: 'Paid' },
  { id: 'ORD1022', customerName: 'Tenant B', apartmentUnit: 'Riverside B-203', orderDate: '2024-07-15', totalAmount: 850, status: 'Delivered', paymentStatus: 'Paid' },
  { id: 'ORD1021', customerName: 'Tenant C', apartmentUnit: 'Acacia C-105', orderDate: '2024-07-14', totalAmount: 2500, status: 'Delivered', paymentStatus: 'Paid' },
  { id: 'ORD1020', customerName: 'Tenant D', apartmentUnit: 'Greenwood A-102', orderDate: '2024-07-14', totalAmount: 500, status: 'New', paymentStatus: 'Pending' },
];

const orderStatuses = ['all', 'New', 'Processing', 'Out for Delivery', 'Delivered', 'Canceled'];
const paymentStatuses = ['all', 'Paid', 'Pending'];

export default function ShopOrderManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.apartmentUnit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPayment = filterPaymentStatus === 'all' || order.paymentStatus === filterPaymentStatus;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleExport = () => console.log("Exporting orders:", filteredOrders);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Order Management</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ShoppingCart className="mr-2 h-6 w-6 text-primary" />All Shop Orders</CardTitle>
          <CardDescription>View, track, and update orders placed by tenants.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by Order ID, Customer, Unit..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="orderStatusFilter" className="text-sm font-medium text-muted-foreground">Order Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="orderStatusFilter"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>{orderStatuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s === 'all' ? 'All Statuses' : s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="paymentStatusFilterOrders" className="text-sm font-medium text-muted-foreground">Payment Status</label>
                <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
                  <SelectTrigger id="paymentStatusFilterOrders"><SelectValue placeholder="All Payment Statuses" /></SelectTrigger>
                  <SelectContent>{paymentStatuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s === 'all' ? 'All Payment Statuses' : s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={handleExport} variant="outline"><Download className="mr-2 h-4 w-4" /> Export Results</Button>
            </div>
            {/* TODO: Add Date Range Filters */}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <ShoppingCart className="mx-auto h-16 w-16 mb-4" />
              <p className="text-lg font-semibold">No orders match your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Apartment/Unit</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id}</TableCell>
                      <TableCell className="font-medium">{order.customerName}</TableCell>
                      <TableCell>{order.apartmentUnit}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>KES {order.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={order.paymentStatus === 'Paid' ? 'default' : 'destructive'}
                               className={order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                               className={order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                          order.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                          order.status === 'Out for Delivery' ? 'bg-orange-100 text-orange-700' :
                                          'bg-gray-100 text-gray-700' /* Canceled */
                                          }>
                            {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                           {/* Link to a detailed order view page (to be created) */}
                          <Link href={`/shop-manager/orders/${order.id}`}><Eye className="mr-1 h-4 w-4" />View</Link>
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
