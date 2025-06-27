
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, User, Home, Phone, Mail, ShoppingCart, DollarSign, Eye } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock data - In a real app, this would be fetched
interface CustomerOrderHistoryItem {
  id: string; // Order ID
  orderDate: string;
  totalAmount: number;
  status: 'New' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Canceled';
}
interface CustomerDetails {
  id: string; // Tenant ID
  name: string;
  email: string;
  phone: string;
  apartmentName: string;
  unitName: string;
  registrationDate: string; // When they first became a SmartRent tenant
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  orderHistory: CustomerOrderHistoryItem[];
}

const mockCustomerDetailsList: CustomerDetails[] = [
  { 
    id: 'tenant001', 
    name: 'John Doe', 
    email: 'john.doe@example.com',
    phone: '0712345678',
    apartmentName: 'Greenwood Heights',
    unitName: 'A-101',
    registrationDate: '2023-01-15',
    totalOrders: 5, 
    totalSpent: 6500, 
    averageOrderValue: 1300,
    orderHistory: [
      { id: 'ORD1023', orderDate: '2024-07-15', totalAmount: 670, status: 'Processing' },
      { id: 'ORD1015', orderDate: '2024-07-01', totalAmount: 2200, status: 'Delivered' },
      { id: 'ORD1005', orderDate: '2024-06-10', totalAmount: 1500, status: 'Delivered' },
    ]
  },
  { 
    id: 'tenant002', 
    name: 'Jane Smith', 
    email: 'jane.smith@example.com',
    phone: '0723456789',
    apartmentName: 'Greenwood Heights',
    unitName: 'A-102',
    registrationDate: '2022-08-01',
    totalOrders: 2, 
    totalSpent: 1500, 
    averageOrderValue: 750,
    orderHistory: [
      { id: 'ORD1022', orderDate: '2024-07-15', totalAmount: 500, status: 'Delivered' },
      { id: 'ORD1010', orderDate: '2024-06-20', totalAmount: 1000, status: 'Delivered' },
    ]
  },
];

export default function ShopCustomerDetailPage() {
  const params = useParams();
  const customerId = params.customerId as string;
  const { toast } = useToast();

  const [customer, setCustomer] = useState<CustomerDetails | undefined>(undefined);

  useEffect(() => {
    const foundCustomer = mockCustomerDetailsList.find(c => c.id === customerId);
    setCustomer(foundCustomer);
  }, [customerId]);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <User className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-muted-foreground mb-2">Customer Not Found</h2>
        <p className="text-muted-foreground mb-6">The customer with ID "{customerId}" could not be found.</p>
        <Button asChild variant="outline">
          <Link href="/shop-manager/customers">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers List
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link href="/shop-manager/customers">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
            <User className="mr-3 h-8 w-8 text-primary" />
            Customer: {customer.name}
          </h1>
          <p className="text-muted-foreground">Tenant ID: {customer.id}</p>
        </div>
        {/* Add actions like "Send Promotional Message" if needed later */}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
          <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/> {customer.email}</p>
            <p className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground"/> {customer.phone}</p>
            <Separator className="my-2"/>
            <p className="flex items-center"><Home className="mr-2 h-4 w-4 text-muted-foreground"/> {customer.apartmentName} - {customer.unitName}</p>
            <p className="text-xs text-muted-foreground">SmartRent User Since: {customer.registrationDate}</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 shadow-md">
          <CardHeader><CardTitle className="flex items-center"><DollarSign className="mr-2 h-5 w-5"/>Spending Summary</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><strong className="text-muted-foreground">Total Orders:</strong> {customer.totalOrders}</p>
            <p><strong className="text-muted-foreground">Total Spent:</strong> KES {customer.totalSpent.toLocaleString()}</p>
            <p><strong className="text-muted-foreground">Average Order Value:</strong> KES {customer.averageOrderValue.toLocaleString()}</p>
            {/* Could add a loyalty status or last order date here */}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ShoppingCart className="mr-2 h-5 w-5"/>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {customer.orderHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Amount (KES)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.orderHistory.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>{order.totalAmount.toLocaleString()}</TableCell>
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
                        <Link href={`/shop-manager/orders/${order.id}`}><Eye className="mr-1 h-4 w-4"/>View Order</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-6">No order history found for this customer.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
