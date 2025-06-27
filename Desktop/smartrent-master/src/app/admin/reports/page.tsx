
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Download, Filter, CalendarDays, Building, Users, DollarSign, ClipboardList, PieChartIcon, AlertTriangleIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { mockAdminReportData } from '@/lib/mock-data';
import { Input } from '@/components/ui/input'; 
import { useToast } from '@/hooks/use-toast';

const reportTypes = [
    { value: 'user_stats', label: 'User Statistics', icon: Users, dataKey: 'userStats' },
    { value: 'financial_summary', label: 'Financial Summary', icon: DollarSign, dataKey: 'financialSummary' },
    { value: 'property_occupancy', label: 'Property Occupancy', icon: Building, dataKey: 'propertyOccupancy' },
    { value: 'service_request_trends', label: 'Service Request Trends', icon: ClipboardList, dataKey: 'serviceRequestTrends' },
];

const chartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function AdminSystemReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState(reportTypes[0].value);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { toast } = useToast();
  const [generatedReportData, setGeneratedReportData] = useState<any | null>(null); 
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = () => {
    setIsLoading(true);
    console.log("Generating report with filters:", { selectedReportType, startDate, endDate });
    
    setTimeout(() => {
        const reportKey = reportTypes.find(rt => rt.value === selectedReportType)?.dataKey;
        if (reportKey && mockAdminReportData[reportKey as keyof typeof mockAdminReportData]) {
             setGeneratedReportData(mockAdminReportData[reportKey as keyof typeof mockAdminReportData]);
             toast({ title: "Report Generated", description: `Report for ${reportTypes.find(rt=>rt.value === selectedReportType)?.label} is ready.` });
        } else {
            setGeneratedReportData(null);
            toast({ title: "Error Generating Report", description: `Could not fetch data for ${reportTypes.find(rt=>rt.value === selectedReportType)?.label}.`, variant: "destructive" });
        }
        setIsLoading(false);
    }, 1000);
  };
  
  const generateCSV = (data: any, reportType: string): string => {
    if (!data) return "";
    let headers: string[] = [];
    let rows: string[][] = [];

    switch(reportType) {
        case 'user_stats':
            headers = ["Role", "Count"];
            rows = data.byRole.map((item: {role: string, count: number}) => [item.role, item.count.toString()]);
            rows.push(["Total Users", data.totalUsers.toString()]);
            rows.push(["Growth Last 30 Days", data.growthLast30Days.toString()]);
            break;
        case 'financial_summary':
            headers = ["Metric", "Amount (KES)"];
            rows = [
                ["Total Revenue", data.totalRevenue.toString()],
                ["Total Payouts", data.totalPayouts.toString()],
                ["Platform Fees", data.platformFees.toString()],
                ["Average Rent", data.averageRent.toString()],
            ];
            break;
        case 'property_occupancy':
            headers = ["Metric", "Value"];
            rows = [
                ["Total Properties", data.totalProperties.toString()],
                ["Total Units", data.totalUnits.toString()],
                ["Total Occupied Units", data.totalOccupiedUnits.toString()],
                ["Total Vacant Units", data.totalVacantUnits.toString()],
                ["Overall Occupancy Rate (%)", data.overallOccupancyRate.toFixed(2)],
            ];
            break;
        case 'service_request_trends':
            headers = ["Status", "Count"];
            rows = data.byStatus.map((item: {status: string, count: number}) => [item.status, item.count.toString()]);
            rows.push(["Total Requests Last 30 Days", data.totalRequestsLast30Days.toString()]);
            rows.push(["Average Resolution Time (Hours)", data.averageResolutionTimeHours.toString()]);
            break;
        default:
            return "";
    }
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    return csvContent;
  }

  const downloadCSV = (csvString: string, filename: string) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
  }

  const handleDownloadReport = (format: 'csv' | 'excel' | 'pdf') => {
    if (format !== 'csv') {
      toast({ title: "Not Supported", description: `${format.toUpperCase()} export is not available yet.`, variant: "destructive" });
      return;
    }
    if (!generatedReportData) {
        toast({ title: "No Data", description: "Please generate a report first to download.", variant: "destructive" });
        return;
    }

    const reportName = reportTypes.find(rt => rt.value === selectedReportType)?.label || "Report";
    const csvData = generateCSV(generatedReportData, selectedReportType);
    if (csvData) {
        downloadCSV(csvData, `admin_${reportName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        toast({ title: "Download Started", description: `${reportName} CSV is downloading.` });
    } else {
        toast({ title: "Download Failed", description: "Could not generate CSV data for this report type.", variant: "destructive" });
    }
  };

  const renderReportContent = () => {
    if (isLoading) return <p className="text-center text-muted-foreground py-8">Generating report...</p>;
    if (!generatedReportData) return <p className="text-center text-muted-foreground py-8">No data to display. Please generate a report using the filters above.</p>;

    switch(selectedReportType) {
        case 'user_stats':
            return (
                <ChartContainer config={{count: {label: "User Count", color: "hsl(var(--chart-1))"}}} className="min-h-[300px] w-full">
                    <BarChart data={generatedReportData.byRole}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="role" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegendContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={[4,4,0,0]} name="User Count"/>
                    </BarChart>
                </ChartContainer>
            );
        case 'financial_summary':
            const financialData = [
                { name: 'Total Revenue', value: generatedReportData.totalRevenue },
                { name: 'Total Payouts', value: generatedReportData.totalPayouts },
                { name: 'Platform Fees', value: generatedReportData.platformFees },
            ];
            return (
                 <ChartContainer config={{value: {label: "Amount (KES)"}}} className="min-h-[300px] w-full">
                    <PieChart>
                        <Pie data={financialData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                            {financialData.map((entry, index) => ( <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} /> ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent formatter={(value) => `KES ${Number(value).toLocaleString()}`} />} />
                        <Legend />
                    </PieChart>
                </ChartContainer>
            );
        case 'property_occupancy':
             const occupancyData = [
                { name: "Occupied Units", value: generatedReportData.totalOccupiedUnits, fill: "hsl(var(--chart-1))" },
                { name: "Vacant Units", value: generatedReportData.totalVacantUnits, fill: "hsl(var(--chart-2))" },
            ];
            return (
                <ChartContainer config={{value: {label: "Unit Count"}}} className="min-h-[300px] w-full">
                    <PieChart>
                        <Pie data={occupancyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({name, value}) => `${name}: ${value}`}>
                           {occupancyData.map((entry, index) => ( <Cell key={`cell-${index}`} fill={entry.fill} /> ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                    </PieChart>
                </ChartContainer>
            );
        case 'service_request_trends':
            return (
                 <ChartContainer config={{count: {label: "Request Count", color: "hsl(var(--chart-3))"}}} className="min-h-[300px] w-full">
                    <BarChart data={generatedReportData.byStatus}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegendContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={[4,4,0,0]} name="Request Count"/>
                    </BarChart>
                </ChartContainer>
            );
        default:
            return <p className="text-center text-muted-foreground py-8">Report view for this type is not available.</p>;
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">System Reports & Analytics</h1>
      <CardDescription>
        Generate comprehensive reports on user statistics, financial performance, and operational metrics.
      </CardDescription>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-6 w-6 text-primary" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div>
                <label htmlFor="reportTypeFilterAdmin" className="text-sm font-medium text-muted-foreground">Report Type</label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                    <SelectTrigger id="reportTypeFilterAdmin">
                        <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                        {reportTypes.map(rt => (
                            <SelectItem key={rt.value} value={rt.value}>
                                <rt.icon className="inline-block h-4 w-4 mr-2 text-muted-foreground" /> {rt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-2 gap-2">
                <div>
                    <label htmlFor="startDateFilterAdmin" className="text-sm font-medium text-muted-foreground">Start Date</label>
                    <Input id="startDateFilterAdmin" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10"/>
                </div>
                <div>
                    <label htmlFor="endDateFilterAdmin" className="text-sm font-medium text-muted-foreground">End Date</label>
                    <Input id="endDateFilterAdmin" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10"/>
                </div>
            </div>
          </div>
           <Button onClick={handleGenerateReport} disabled={isLoading} size="lg" className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
            <BarChart3 className="mr-2 h-5 w-5" /> {isLoading ? "Generating..." : "Generate Report"}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle>Report Output: {reportTypes.find(rt => rt.value === selectedReportType)?.label}</CardTitle>
                <CardDescription>View the generated report data below. Use download options for offline use.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button onClick={() => handleDownloadReport('csv')} variant="outline" size="sm" disabled={!generatedReportData || isLoading}><Download className="mr-2 h-4 w-4"/>CSV</Button>
                <Button onClick={() => handleDownloadReport('excel')} variant="outline" size="sm" disabled={true}><Download className="mr-2 h-4 w-4"/>Excel</Button>
                <Button onClick={() => handleDownloadReport('pdf')} variant="outline" size="sm" disabled={true}><Download className="mr-2 h-4 w-4"/>PDF</Button>
            </div>
        </CardHeader>
        <CardContent className="min-h-[350px]">
          {renderReportContent()}
        </CardContent>
      </Card>
    </div>
  );
}

