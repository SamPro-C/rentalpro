
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Download, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import { mockAdminGlobalFinancialMetrics, mockAdminRevenueData, type AdminGlobalFinancialMetric } from '@/lib/mock-data';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

const chartConfig = {
  revenue: { label: "Revenue (KES)", color: "hsl(var(--chart-1))" },
  payouts: { label: "Payouts (KES)", color: "hsl(var(--chart-2))" },
};

const MetricDisplayCard = ({ title, value, icon: Icon, description, valueClass }: { title: string; value: string; icon: React.ElementType; description?: string, valueClass?: string }) => (
    <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className={`text-2xl font-bold ${valueClass || 'text-primary'}`}>{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);


export default function AdminFinancialOverviewPage() {
  
  const handleDownloadReport = (reportType: string) => {
    alert(`Downloading ${reportType} report (placeholder).`);
  }

  const metrics: AdminGlobalFinancialMetric[] = mockAdminGlobalFinancialMetrics;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Global Financial Overview</h1>
      <CardDescription>
        View aggregated financial data and trends for the entire SmartRent system.
      </CardDescription>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><DollarSign className="mr-2 h-6 w-6 text-primary" />System-Wide Financials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {metrics.map(metric => (
                     <MetricDisplayCard 
                        key={metric.title}
                        title={metric.title}
                        value={metric.value}
                        icon={metric.icon}
                        description={metric.description}
                        valueClass={metric.valueClass}
                    />
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-green-600"/>Monthly Revenue & Payouts Trend</CardTitle>
                    <CardDescription>Last 6 months (Mock Data)</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockAdminRevenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis tickFormatter={(value) => `KES ${value/1000}k`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="payouts" fill="var(--color-payouts)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            
            <div>
                <h3 className="text-lg font-semibold mb-2">Download Reports</h3>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => handleDownloadReport('Full Financial Statement')}><Download className="mr-2 h-4 w-4"/>Full Financial Statement</Button>
                    <Button variant="outline" onClick={() => handleDownloadReport('Revenue Breakdown')}><Download className="mr-2 h-4 w-4"/>Revenue Breakdown</Button>
                    <Button variant="outline" onClick={() => handleDownloadReport('Payout Summary')}><Download className="mr-2 h-4 w-4"/>Payout Summary</Button>
                </div>
            </div>
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">
                Note: Access to individual transaction details is restricted for privacy. This overview provides aggregated data only.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
