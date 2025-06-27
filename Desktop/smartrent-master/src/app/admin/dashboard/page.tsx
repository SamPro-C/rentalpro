
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, ShieldCheck, ShoppingCart, DollarSign, Activity, AlertTriangle, Cog, FileText, UserCircle, MessageSquare, Star } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { mockAdminDashboardActivity, type AdminDashboardActivityItem } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

interface AdminMetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  actionLink?: string;
  actionText?: string;
  className?: string;
}

function AdminMetricCard({ title, value, icon: Icon, description, actionLink, actionText, className }: AdminMetricCardProps) {
  return (
    <Card className={`shadow-sm hover:shadow-lg transition-shadow duration-200 rounded-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
        {actionLink && actionText && (
          <Button asChild variant="link" className="px-0 pt-2 text-sm font-medium text-accent hover:text-accent/80">
            <Link href={actionLink}>{actionText}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

const activityIconMap: { [key: string]: LucideIcon } = {
  'New User': UserCircle,
  'Property Added': Building2,
  'System Update': Cog,
  'Security Alert': ShieldCheck,
  'High Volume': ShoppingCart,
  'Payout Processed': DollarSign,
  'Report Generated': FileText,
  'Feedback Received': MessageSquare,
  'Tenant Review': Star,
};


export default function AdminDashboardPage() {
  const adminName = "System Admin"; 

  const metrics: AdminMetricCardProps[] = [
    { title: "Total Landlords", value: 5, icon: Users, actionLink: "/admin/users/landlords", actionText: "Manage Landlords" },
    { title: "Total Tenants", value: 150, icon: Users, actionLink: "/admin/users/tenants", actionText: "Manage Tenants" },
    { title: "Total Workers", value: 20, icon: Users, actionLink: "/admin/users/workers", actionText: "Manage Workers" },
    { title: "Total Shop Managers", value: 2, icon: Users, actionLink: "/admin/users/shop-managers", actionText: "Manage Shop Managers" },
    { title: "Total Apartments", value: 25, icon: Building2, actionLink: "/admin/properties", actionText: "View All Properties" },
    { title: "Pending Approvals", value: 3, icon: ShieldCheck, description: "New user registrations", actionLink: "/admin/users/approvals", actionText: "Review Approvals", className: "bg-white border-yellow-400" },
    { title: "Active Service Requests", value: 12, icon: Activity, actionLink: "/admin/service-requests", actionText: "View Requests" },
    { title: "Shop Orders Today", value: 8, icon: ShoppingCart, actionLink: "/admin/ecommerce", actionText: "View E-commerce" },
  ];
  
  const systemHealth = [
      { name: "Payment Gateway", status: "Online", icon: DollarSign, color: "text-green-600"},
      { name: "SMS Service", status: "Online", icon: Users, color: "text-green-600"},
      { name: "Email Service", status: "Issues Detected", icon: AlertTriangle, color: "text-orange-500"},
  ];

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-6 md:gap-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Admin Panel, {adminName}!</h1>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground/90">System Overview</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {metrics.map((metric) => (
              <AdminMetricCard key={metric.title} {...metric} />
            ))}
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground/90">System Health</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {systemHealth.map(service => (
                  <Card key={service.name} className="shadow-sm">
                      <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center justify-between">
                              {service.name}
                              <service.icon className={`h-4 w-4 ${service.color}`} />
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className={`text-lg font-semibold ${service.color}`}>{service.status}</p>
                      </CardContent>
                  </Card>
              ))}
          </div>
        </section>

         <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground/90">Quick Actions</h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              <Button asChild variant="outline"><Link href="/admin/users/approvals">Approve Users</Link></Button>
              <Button asChild variant="outline"><Link href="/admin/settings/system">System Config</Link></Button>
              <Button asChild variant="outline"><Link href="/admin/reports">Generate Report</Link></Button>
              <Button asChild variant="outline"><Link href="/admin/settings/notifications">Send Announcement</Link></Button>
              <Button asChild variant="outline"><Link href="/admin/audit-logs">View Audit Logs</Link></Button>
          </div>
        </section>

        <section>
          <Card className="shadow-md">
              <CardHeader><CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5"/>Recent System Activity</CardTitle></CardHeader>
              <CardContent>
                  {mockAdminDashboardActivity.length > 0 ? (
                      <ul className="space-y-3">
                          {mockAdminDashboardActivity.map((activity) => {
                              const Icon = activityIconMap[activity.type] || Activity;
                              return (
                                  <li key={activity.id} className="flex items-start space-x-3 p-3 border-b last:border-b-0 hover:bg-muted/30 rounded-md">
                                      <div className={`p-2 rounded-full bg-primary/10 text-primary`}>
                                          <Icon className="h-5 w-5" />
                                      </div>
                                      <div className="flex-1">
                                          <p className="text-sm font-medium text-foreground">{activity.description}</p>
                                          <p className="text-xs text-muted-foreground">{activity.timestamp} {activity.user && `by ${activity.user}`}</p>
                                          {activity.details && <Badge variant="outline" className="mt-1 text-xs">{activity.details}</Badge>}
                                      </div>
                                  </li>
                              );
                          })}
                      </ul>
                  ) : (
                      <div className="text-center text-muted-foreground py-8">
                          No recent system activity to display.
                      </div>
                  )}
              </CardContent>
          </Card>
        </section>
      </div>
    </ErrorBoundary>
  );
}
