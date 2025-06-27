
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, User, Home, CalendarDays, DollarSign, Edit3, Truck, PackageIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock data - In a real app, this would be fetched
interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
interface OrderDetails {
  id: string;
  customerName: string;
  tenantId: string; // For linking to tenant profile if needed
  apartmentUnit: string;
  orderDate: string;
  status: 'New' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Canceled';
  paymentStatus: 'Paid' | 'Pending';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  deliveryAddress: string;
  notes?: string;
}

const mockOrderDetailsList: OrderDetails[] = [
  { 
    id: 'ORD1023', 
    customerName: 'Tenant A (John Doe)', 
    tenantId: 'tenant001',
    apartmentUnit: 'Greenwood A-101', 
    orderDate: '2024-07-15 10:30 AM', 
    status: 'Processing', 
    paymentStatus: 'Paid',
    items: [
      { id: 'item1', productName: 'Fresh Milk 1L', sku: 'FM001', quantity: 2, unitPrice: 120, totalPrice: 240 },
      { id: 'item2', productName: 'Bread Sliced', sku: 'BR002', quantity: 1, unitPrice: 80, totalPrice: 80 },
      { id: 'item3', productName: 'Eggs (Dozen)', sku: 'EG001', quantity: 1, unitPrice: 300, totalPrice: 300 },
    ],
    subtotal: 620, deliveryFee: 50, totalAmount: 670, 
    deliveryAddress: 'Greenwood Heights, Apt A-101, Kilimani',
    notes: 'Please deliver after 5 PM if possible.'
  },
  { 
    id: 'ORD1022', 
    customerName: 'Tenant B (Jane Smith)', 
    tenantId: 'tenant002',
    apartmentUnit: 'Riverside B-203', 
    orderDate: '2024-07-15 08:15 AM', 
    status: 'Delivered', 
    paymentStatus: 'Paid',
    items: [
      { id: 'item4', productName: 'All-Purpose Cleaner', sku: 'CL005', quantity: 1, unitPrice: 350, totalPrice: 350 },
      { id: 'item5', productName: 'Dish Soap', sku: 'DS001', quantity: 1, unitPrice: 150, totalPrice: 150 },
    ],
    subtotal: 500, deliveryFee: 0, totalAmount: 500, 
    deliveryAddress: 'Riverside Towers, Apt B-203, Westlands',
  },
];

const availableStatuses: OrderDetails['status'][] = ['New', 'Processing', 'Out for Delivery', 'Delivered', 'Canceled'];


export default function ShopOrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { toast } = useToast();

  const [order, setOrder] = useState<OrderDetails | undefined>(undefined);

  useEffect(() => {
    const foundOrder = mockOrderDetailsList.find(o => o.id === orderId);
    setOrder(foundOrder);
  }, [orderId]);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-muted-foreground mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">The order with ID "{orderId}" could not be found.</p>
        <Button asChild variant="outline">
          <Link href="/shop-manager/orders">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders List
          </Link>
        </Button>
      </div>
    );
  }
  
  const handleStatusUpdate = (newStatus: OrderDetails['status']) => {
    if (order.status === 'Delivered' || order.status === 'Canceled') {
        toast({title: "Cannot Update", description: `Order is already ${order.status}.`, variant: "destructive"});
        return;
    }
    setOrder(prev => prev ? { ...prev, status: newStatus } : undefined);
    toast({title: "Order Status Updated", description: `Order ${order.id} status changed to ${newStatus}.`});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link href="/shop-manager/orders">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
            <ShoppingCart className="mr-3 h-8 w-8 text-primary" />
            Order Details: {order.id}
          </h1>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant={order.paymentStatus === 'Paid' ? 'default' : 'destructive'}
                   className={`text-sm ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                Payment: {order.paymentStatus}
            </Badge>
            <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                   className={`text-sm ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                   order.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                   order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                   order.status === 'Out for Delivery' ? 'bg-orange-100 text-orange-700' :
                                   'bg-gray-100 text-gray-700' 
                                   }`}>
                Order: {order.status}
            </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
          <CardHeader><CardTitle className="flex items-center"><User className="mr-2 h-5 w-5"/>Customer Information</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><strong className="text-muted-foreground">Name:</strong> {order.customerName}</p>
            <p><strong className="text-muted-foreground">Unit:</strong> {order.apartmentUnit}</p>
            <p><strong className="text-muted-foreground">Delivery Address:</strong></p>
            <p className="pl-2">{order.deliveryAddress}</p>
             <Button variant="link" size="sm" asChild className="px-0">
                <Link href={`/shop-manager/customers/${order.tenantId}`}>View Customer Details</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 shadow-md">
          <CardHeader><CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5"/>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><strong className="text-muted-foreground">Order Date:</strong> {order.orderDate}</p>
            <p><strong className="text-muted-foreground">Subtotal:</strong> KES {order.subtotal.toLocaleString()}</p>
            <p><strong className="text-muted-foreground">Delivery Fee:</strong> KES {order.deliveryFee.toLocaleString()}</p>
            <p className="text-base font-semibold"><strong className="text-muted-foreground">Total Amount:</strong> KES {order.totalAmount.toLocaleString()}</p>
            {order.notes && <p className="pt-2"><strong className="text-muted-foreground">Customer Notes:</strong> <span className="italic">{order.notes}</span></p>}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><PackageIcon className="mr-2 h-5 w-5"/>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">KES {item.unitPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-right">KES {item.totalPrice.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader><CardTitle className="flex items-center"><Truck className="mr-2 h-5 w-5"/>Update Order Status</CardTitle></CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-grow">
                    <label htmlFor="orderStatusUpdate" className="text-sm font-medium text-muted-foreground">New Status</label>
                    <Select onValueChange={(value) => handleStatusUpdate(value as OrderDetails['status'])} defaultValue={order.status}>
                        <SelectTrigger id="orderStatusUpdate">
                            <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableStatuses.map(stat => (
                                <SelectItem key={stat} value={stat} disabled={order.status === stat || ( (order.status === 'Delivered' || order.status === 'Canceled') && stat !== order.status )}>
                                    {stat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-xs text-muted-foreground sm:w-1/3">
                    Updating status will notify the customer.
                </p>
            </div>
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">Order history and internal notes will be displayed here.</p>
        </CardFooter>
      </Card>
    </div>
  );
}

