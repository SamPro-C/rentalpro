
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Users, DollarSign, Search, Eye, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
    mockAdminShopMetrics, type AdminShopMetric,
    mockAdminGlobalProducts, type AdminGlobalProduct,
    mockAdminGlobalOrders, type AdminGlobalOrder 
} from '@/lib/mock-data';

const ProductTable = ({ products, searchTerm }: { products: AdminGlobalProduct[], searchTerm: string }) => {
    const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!filtered.length) return <p className="text-muted-foreground text-center py-4">No products found.</p>;
    return (
        <Table>
            <TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map(p => (<TableRow key={p.id}><TableCell>{p.sku}</TableCell><TableCell>{p.name}</TableCell><TableCell>{p.category}</TableCell><TableCell>KES {p.price.toLocaleString()}</TableCell><TableCell>{p.stock}</TableCell><TableCell><Badge variant={p.status === 'Active' ? 'default' : 'outline'}>{p.status}</Badge></TableCell></TableRow>))}</TableBody>
        </Table>
    );
};

const OrderTable = ({ orders, searchTerm }: { orders: AdminGlobalOrder[], searchTerm: string }) => {
    const filtered = orders.filter(o => o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
     if (!filtered.length) return <p className="text-muted-foreground text-center py-4">No orders found.</p>;
    return (
        <Table>
            <TableHeader><TableRow><TableHead>Order ID</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead><TableHead>Total</TableHead><TableHead>Payment</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map(o => (<TableRow key={o.orderId}><TableCell>{o.orderId}</TableCell><TableCell>{o.customerName}</TableCell><TableCell>{o.date}</TableCell><TableCell>KES {o.totalAmount.toLocaleString()}</TableCell><TableCell><Badge variant={o.paymentStatus === 'Paid' ? 'default' : 'secondary'}>{o.paymentStatus}</Badge></TableCell><TableCell><Badge variant={o.orderStatus === 'Delivered' ? 'default' : 'outline'}>{o.orderStatus}</Badge></TableCell></TableRow>))}</TableBody>
        </Table>
    );
};


export default function AdminEcommerceOversightPage() {
  const { toast } = useToast();
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const metrics: AdminShopMetric[] = mockAdminShopMetrics;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">E-commerce Platform Oversight</h1>
      <CardDescription>
        View key metrics, audit products and orders, and manage shop manager accounts.
      </CardDescription>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map(metric => (
            <Card key={metric.title} className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${metric.valueClass || 'text-primary'}`}>{metric.value}</div>
                    {metric.description && <p className="text-xs text-muted-foreground">{metric.description}</p>}
                </CardContent>
            </Card>
        ))}
    </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Package className="mr-2 h-5 w-5 text-primary" />Global Product Catalog Audit</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search products by SKU or Name..." className="pl-8 w-full md:w-1/3" value={productSearch} onChange={e => setProductSearch(e.target.value)}/>
            </div>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
            <ProductTable products={mockAdminGlobalProducts} searchTerm={productSearch} />
        </CardContent>
         <CardFooter className="border-t pt-3">
            <Button variant="outline" size="sm" onClick={() => toast({title: "Action: View All Products", description: "Navigating to full product catalog management."})}>View All Products</Button>
         </CardFooter>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ShoppingCart className="mr-2 h-5 w-5 text-primary" />Global Order Log Audit</CardTitle>
          <div className="relative mt-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search orders by ID or Customer..." className="pl-8 w-full md:w-1/3" value={orderSearch} onChange={e => setOrderSearch(e.target.value)}/>
            </div>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
            <OrderTable orders={mockAdminGlobalOrders} searchTerm={orderSearch} />
        </CardContent>
        <CardFooter className="border-t pt-3">
            <Button variant="outline" size="sm" onClick={() => toast({title: "Action: View All Orders", description: "Navigating to full order log management."})}>View All Orders</Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/>Shop Manager Accounts</CardTitle>
            <CardDescription>Access and manage shop manager user profiles.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button asChild>
                <Link href="/admin/users/shop-managers">Go to Shop Manager Management</Link>
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}

