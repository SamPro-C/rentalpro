
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  actionLink?: string;
  actionText?: string;
}

function MetricCard({ title, value, icon: Icon, description, actionLink, actionText }: MetricCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
        {actionLink && actionText && (
          <Button asChild variant="link" className="px-0 pt-2 text-sm">
            <Link href={actionLink}>{actionText}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function ShopManagerDashboardPage() {
  const shopManagerName = "Shop Manager"; 

  const metrics: MetricCardProps[] = [
    { title: "Today's Sales", value: "KES 12,500", icon: DollarSign, description: "+5% from yesterday" },
    { title: "New Orders", value: 15, icon: ShoppingCart, description: "Ready for processing", actionLink: "/shop-manager/orders", actionText: "View Orders" },
    { title: "Products in Stock", value: 250, icon: Package, description: "Across all categories", actionLink: "/shop-manager/products", actionText: "Manage Products"},
    { title: "Low Stock Alerts", value: 3, icon: AlertCircle, description: "Items needing reorder", actionLink: "/shop-manager/products?filter=lowstock", actionText: "View Alerts", },
  ];
  
  const recentOrders = [ 
    { id: 'ORD1023', customer: 'Tenant A', total: 'KES 1,200', status: 'Processing', time: '1 hr ago' },
    { id: 'ORD1022', customer: 'Tenant B', total: 'KES 850', status: 'Delivered', time: '3 hrs ago' },
    { id: 'ORD1021', customer: 'Tenant C', total: 'KES 2,500', status: 'Delivered', time: '5 hrs ago' },
  ];


  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
        Welcome, {shopManagerName}!
      </h1>
      
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground/90">Shop Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>
      </section>
      
      <section>
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>A quick look at the latest orders placed by tenants.</CardDescription>
            </CardHeader>
            <CardContent>
                {recentOrders.length > 0 ? (
                    <div className="space-y-3">
                        {recentOrders.map(order => (
                            <div key={order.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50">
                                <div>
                                    <Link href={`/shop-manager/orders/${order.id}`} className="font-medium text-primary hover:underline">{order.id}</Link>
                                    <p className="text-xs text-muted-foreground">By {order.customer} - {order.time}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{order.total}</p>
                                    <p className={`text-xs font-medium ${order.status === 'Delivered' ? 'text-green-600' : 'text-orange-500'}`}>{order.status}</p>
                                </div>
                            </div>
                        ))}
                         <Button variant="link" asChild className="float-right">
                            <Link href="/shop-manager/orders">View All Orders</Link>
                        </Button>
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-4">No recent orders.</p>
                )}
            </CardContent>
        </Card>
      </section>

       <section>
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5"/>Sales Trends</CardTitle>
                <CardDescription>Performance over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground">
                <p>Sales chart visualization will be displayed here.</p>
            </CardContent>
        </Card>
      </section>


    </div>
  );
}

