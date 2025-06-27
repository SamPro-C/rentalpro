
'use client';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, Briefcase, ClipboardList, DollarSign, PlusCircle, FileText, Activity, TrendingUp, AlertTriangle, MessagesSquare, UserPlus, Settings, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import MpesaCredentialsForm from '../payments/mpesa-credentials-form';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  actionLink?: string;
  actionText?: string;
  className?: string;
}

function MetricCard({ title, value, icon: Icon, description, actionLink, actionText, className }: MetricCardProps) {
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

interface QuickActionProps {
  title: string;
  icon: LucideIcon;
  href: string;
}

function QuickActionButton({ title, icon: Icon, href }: QuickActionProps) {
    return (
        <Button asChild variant="outline" className="flex flex-col items-center justify-center h-28 sm:h-32 shadow-sm hover:shadow-lg transition-shadow duration-200 rounded-lg p-4 text-center">
            <Link href={href} className="flex flex-col items-center justify-center">
                <Icon className="h-8 w-8 mb-2 text-accent" />
                <span className="text-sm font-medium text-foreground">{title}</span>
            </Link>
        </Button>
    );
}

export default function LandlordDashboardPage() {
  const landlordName = "Valued Landlord"; // Placeholder

  const metrics: MetricCardProps[] = [
    { title: "Total Apartments", value: 3, icon: Building2, description: "Managed properties", actionLink: "/landlord/apartments", actionText: "View Apartments" },
    { title: "Total Units", value: "25 / 35", icon: Users, description: "Occupied / Total" },
    { title: "Total Tenants", value: 25, icon: Users, description: "Currently residing", actionLink: "/landlord/tenants", actionText: "View Tenants" },
    { title: "Total Workers", value: 5, icon: Briefcase, description: "Assigned personnel", actionLink: "/landlord/workers", actionText: "View Workers" },
    { title: "Pending Service Requests", value: 2, icon: ClipboardList, description: "Awaiting action", actionLink: "/landlord/service-requests", actionText: "View All"},
    { title: "Unpaid Rent", value: "KES 30,000", icon: AlertTriangle, description: "This month (2 Tenants)", actionLink: "/landlord/payments", actionText: "View Payments", className: "bg-destructive/10 border-destructive/50"},
    { title: "Recent Payments", value: "KES 150,000", icon: DollarSign, description: "Last 7 days", actionLink: "/landlord/payments", actionText: "View Payments"},
  ];

  const quickActions: QuickActionProps[] = [
    { title: "Add Apartment", icon: PlusCircle, href: "/landlord/apartments/new" },
    { title: "Register Tenant", icon: UserPlus, href: "/landlord/tenants/new" },
    { title: "Register Worker", icon: Briefcase, href: "/landlord/workers/new" },
    { title: "Service Requests", icon: ClipboardList, href: "/landlord/service-requests" },
    { title: "My Planner", icon: CalendarDays, href: "/landlord/planner" },
    { title: "Generate Report", icon: FileText, href: "/landlord/reports" },
    { title: "Settings", icon: Settings, href: "/landlord/settings"},
  ];
  
  const recentActivity = [
    { id: 1, description: "Payment of KES 15,000 received from Tenant John Doe (A-101).", time: "2 hours ago", icon: DollarSign, type: 'payment', link: '/landlord/tenants/tenant001' },
    { id: 2, description: "New service request: 'Leaking tap in kitchen' from Tenant Jane Smith (B-203).", time: "5 hours ago", icon: ClipboardList, type: 'service_request', link: '/landlord/service-requests/SR005' },
    { id: 3, description: "Worker Mark Lee completed task: 'Fix faulty wiring in Unit C-301'.", time: "1 day ago", icon: Briefcase, type: 'worker_update', link: '/landlord/workers/worker001' },
    { id: 4, description: "Expense added: KES 3,500 for plumbing supplies.", time: "2 days ago", icon: TrendingUp, type: 'expense', link: '/landlord/payments/expenses' },
    { id: 5, description: "Tenant Sarah Williams (D-405) registered.", time: "3 days ago", icon: Users, type: 'new_tenant', link: '/landlord/tenants/tenantXYZ'}, 
    { id: 6, description: "New notification: 'System maintenance scheduled.'", time: "4 days ago", icon: MessagesSquare, type: 'notification', link: '/landlord/notifications'},
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Welcome back, {landlordName}!</h1>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/landlord/apartments/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Apartment
          </Link>
        </Button>
      </div>
      
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground/90">Portfolio At-a-Glance</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground/90">Quick Actions</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7"> 
            {quickActions.map(action => (
                <QuickActionButton key={action.title} {...action} />
            ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground/90">Recent Activity</h2>
        <Card className="shadow-sm rounded-lg">
          <CardContent className="pt-6">
            {recentActivity.length > 0 ? (
              <ul className="space-y-4">
                {recentActivity.map(activity => (
                  <li key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-muted/50 rounded-md transition-colors">
                    <div className={`flex-shrink-0 pt-1 p-2 rounded-full ${
                        activity.type === 'payment' ? 'bg-green-100' :
                        activity.type === 'service_request' ? 'bg-blue-100' :
                        activity.type === 'worker_update' ? 'bg-purple-100' :
                        activity.type === 'expense' ? 'bg-orange-100' :
                        activity.type === 'new_tenant' ? 'bg-teal-100' :
                        'bg-gray-100'
                    }`}>
                      <activity.icon className={`h-5 w-5 ${
                        activity.type === 'payment' ? 'text-green-700' :
                        activity.type === 'service_request' ? 'text-blue-700' :
                        activity.type === 'worker_update' ? 'text-purple-700' :
                        activity.type === 'expense' ? 'text-orange-700' :
                        activity.type === 'new_tenant' ? 'text-teal-700' :
                        'text-gray-700'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.link ? <Link href={activity.link} className="hover:underline">{activity.description}</Link> : activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No recent activity to display.</p>
                <p className="text-xs text-muted-foreground">New activities will appear here.</p>
              </div>
            )}
            <div className="mt-4 text-right">
                <Button variant="link" size="sm" asChild>
                    <Link href="/landlord/activity-log">View All Activity</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground/90">M-Pesa Credentials</h2>
        <MpesaCredentialsForm landlordId="landlord-id-placeholder" />
      </section>
    </div>
  );
}
