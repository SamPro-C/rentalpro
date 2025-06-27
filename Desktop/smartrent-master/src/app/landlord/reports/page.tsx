
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Download, Filter, CalendarDays, Building, Users, DollarSign, ClipboardList, Activity, BarChartHorizontal } from 'lucide-react';
import { useState } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockApartmentList } from '@/lib/mock-data'; 
import { mockWorkerProfiles } from '@/lib/mock-data'; 
import { useToast } from '@/hooks/use-toast';


// Mock data for charts and reports
const monthlyRentCollectedData = [
  { month: "Jan", total: Math.floor(Math.random() * 50000) + 10000 },
  { month: "Feb", total: Math.floor(Math.random() * 50000) + 10000 },
  { month: "Mar", total: Math.floor(Math.random() * 50000) + 10000 },
  { month: "Apr", total: Math.floor(Math.random() * 50000) + 10000 },
  { month: "May", total: Math.floor(Math.random() * 50000) + 10000 },
  { month: "Jun", total: Math.floor(Math.random() * 50000) + 10000 },
];
const chartConfigRent = {
  total: { label: "Rent Collected (KES)", color: "hsl(var(--primary))" },
};

const occupancyData = [
  { name: "Occupied Units", value: 25, fill: "hsl(var(--chart-1))" },
  { name: "Vacant Units", value: 10, fill: "hsl(var(--chart-2))" },
];
const chartConfigOccupancy = {
  occupied: { label: "Occupied Units", color: "hsl(var(--chart-1))" },
  vacant: { label: "Vacant Units", color: "hsl(var(--chart-2))" },
};


const expenseCategoryData = [
    { name: "Maintenance", value: 15000, fill: "hsl(var(--chart-1))"},
    { name: "Utilities", value: 8000, fill: "hsl(var(--chart-2))"},
    { name: "Repairs", value: 12000, fill: "hsl(var(--chart-3))"},
    { name: "Cleaning", value: 5000, fill: "hsl(var(--chart-4))"},
    { name: "Other", value: 3000, fill: "hsl(var(--chart-5))"},
];
const chartConfigExpenses = {
  maintenance: { label: "Maintenance", color: "hsl(var(--chart-1))"},
  utilities: { label: "Utilities", color: "hsl(var(--chart-2))"},
  repairs: { label: "Repairs", color: "hsl(var(--chart-3))"},
  cleaning: { label: "Cleaning", color: "hsl(var(--chart-4))"},
  other: { label: "Other", color: "hsl(var(--chart-5))"},
};

const mockServiceRequestStatusData = [
    { status: "Pending", count: 5 + Math.floor(Math.random() * 5) },
    { status: "In Progress", count: 8 + Math.floor(Math.random() * 7) },
    { status: "Completed", count: 20 + Math.floor(Math.random() * 10) },
    { status: "Canceled", count: 2 + Math.floor(Math.random() * 3) },
];
const chartConfigServiceRequests = {
    count: { label: "Request Count", color: "hsl(var(--accent))" },
};

const mockWorkerPerformanceData = mockWorkerProfiles.slice(0, 5).map(worker => ({
    name: worker.fullName,
    role: worker.role,
    tasksCompleted: Math.floor(Math.random() * 50) + 10,
    avgRating: (Math.random() * 2 + 3).toFixed(1) 
}));

const mockApartmentPerformanceData = mockApartmentList.map(apt => ({
    name: apt.name,
    occupancyRate: apt.totalUnits > 0 ? ((apt.occupiedUnits / apt.totalUnits) * 100).toFixed(1) : "0.0",
    netIncome: Math.floor(Math.random() * 200000) + 50000 
}));


const reportTypes = [
    { value: 'payment', label: 'Payment Reports', icon: DollarSign },
    { value: 'tenant', label: 'Tenant Reports', icon: Users },
    { value: 'worker', label: 'Worker Performance', icon: Activity }, 
    { value: 'service_request', label: 'Service Requests', icon: ClipboardList },
    { value: 'expense', label: 'Expense Reports', icon: DollarSign },
    { value: 'apartment_performance', label: 'Apartment Performance', icon: Building },
];
const mockApartmentsForFilter = ['all', ...mockApartmentList.map(apt => apt.name)];


export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState(reportTypes[0].value);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterApartment, setFilterApartment] = useState('all');
  const { toast } = useToast();
  const [reportData, setReportData] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = () => {
    setIsLoading(true);
    console.log("Generating report with filters:", { selectedReportType, startDate, endDate, filterApartment });
    
    setTimeout(() => {
        let dataToSet = [];
        switch(selectedReportType) {
            case 'payment': dataToSet = monthlyRentCollectedData; break;
            case 'tenant': dataToSet = occupancyData; break; // This is for Pie chart, CSV will be different
            case 'expense': dataToSet = expenseCategoryData; break; // This is for Pie chart
            case 'worker': dataToSet = mockWorkerPerformanceData; break;
            case 'service_request': dataToSet = mockServiceRequestStatusData; break; // This for Bar chart
            case 'apartment_performance': dataToSet = mockApartmentPerformanceData; break;
            default: dataToSet = [];
        }
        setReportData(dataToSet);
        setIsLoading(false);
        toast({ title: "Report Generated", description: `Report for ${reportTypes.find(rt=>rt.value === selectedReportType)?.label} is ready.` });
    }, 1000);
  };
  
  const generateCSV = (data: any[], reportType: string): string => {
    if (!data || data.length === 0) return "";
    let headers: string[] = [];
    let rows: string[][] = [];

    switch(reportType) {
        case 'payment':
            headers = ["Month", "Total Rent Collected (KES)"];
            rows = data.map(item => [item.month, item.total.toString()]);
            break;
        case 'tenant': // For Pie chart, data is {name, value}
            headers = ["Category", "Count"];
            rows = data.map(item => [item.name, item.value.toString()]);
            break;
        case 'expense': // For Pie chart
            headers = ["Expense Category", "Amount (KES)"];
            rows = data.map(item => [item.name, item.value.toString()]);
            break;
        case 'worker':
            headers = ["Worker Name", "Role", "Tasks Completed", "Average Rating"];
            rows = data.map(item => [item.name, item.role, item.tasksCompleted.toString(), item.avgRating.toString()]);
            break;
        case 'service_request':
            headers = ["Status", "Request Count"];
            rows = data.map(item => [item.status, item.count.toString()]);
            break;
        case 'apartment_performance':
            headers = ["Apartment Name", "Occupancy Rate (%)", "Net Income (KES)"];
            rows = data.map(item => [item.name, item.occupancyRate.toString(), item.netIncome.toString()]);
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
    if (!reportData.length) {
        toast({ title: "No Data", description: "Please generate a report first to download.", variant: "destructive" });
        return;
    }

    const reportName = reportTypes.find(rt => rt.value === selectedReportType)?.label || "Report";
    const csvData = generateCSV(reportData, selectedReportType);
    if (csvData) {
        downloadCSV(csvData, `${reportName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        toast({ title: "Download Started", description: `${reportName} CSV is downloading.` });
    } else {
        toast({ title: "Download Failed", description: "Could not generate CSV data for this report type.", variant: "destructive" });
    }
  };


  const renderReportContent = () => {
    if(isLoading) return <p className="text-center text-muted-foreground py-8">Generating report...</p>;
    if(!reportData.length && !isLoading) return <p className="text-center text-muted-foreground py-8">No data to display for the selected criteria. Generate a report.</p>;

    switch(selectedReportType) {
        case 'payment':
            return (
                <ChartContainer config={chartConfigRent} className="min-h-[300px] w-full">
                    <BarChart accessibilityLayer data={reportData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis tickFormatter={(value) => `KES ${value/1000}k`} />
                        <Tooltip content={<ChartTooltipContent cursor={false} />} />
                        <Legend content={<ChartLegendContent />} />
                        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                    </BarChart>
                </ChartContainer>
            );
        case 'tenant': 
             return (
                <ChartContainer config={chartConfigOccupancy} className="min-h-[300px] w-full">
                    <PieChart>
                        <Tooltip content={<ChartTooltipContent nameKey="name" hideLabel/>} />
                        <Pie data={reportData} dataKey="value" nameKey="name" labelLine={false} label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)` }>
                             {reportData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Legend content={<ChartLegendContent nameKey="name"/>} />
                    </PieChart>
                </ChartContainer>
            );
        case 'expense':
             return (
                <ChartContainer config={chartConfigExpenses} className="min-h-[300px] w-full">
                    <PieChart>
                         <Tooltip content={<ChartTooltipContent nameKey="name" formatter={(value) => `KES ${Number(value).toLocaleString()}`} hideLabel />} />
                        <Pie data={reportData} dataKey="value" nameKey="name" labelLine={false} label={({name, value}) => `${name} (KES ${value.toLocaleString()})` }>
                            {reportData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Legend content={<ChartLegendContent nameKey="name"/>} />
                    </PieChart>
                </ChartContainer>
            );
        case 'worker':
            return (
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader><TableRow><TableHead>Worker Name</TableHead><TableHead>Role</TableHead><TableHead>Tasks Completed</TableHead><TableHead>Avg. Rating</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {reportData.map((worker, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{worker.name}</TableCell>
                                <TableCell>{worker.role}</TableCell>
                                <TableCell>{worker.tasksCompleted}</TableCell>
                                <TableCell><Badge variant={parseFloat(worker.avgRating) >= 4 ? "default" : "secondary"}>{worker.avgRating} ★</Badge></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            );
        case 'service_request':
            return (
                 <ChartContainer config={chartConfigServiceRequests} className="min-h-[300px] w-full">
                    <BarChart accessibilityLayer data={reportData} layout="vertical">
                        <CartesianGrid horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="status" type="category" tickLine={false} axisLine={false} width={80}/>
                        <Tooltip content={<ChartTooltipContent cursor={false}/>} />
                        <Legend content={<ChartLegendContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={[0,4,4,0]} />
                    </BarChart>
                </ChartContainer>
            );
        case 'apartment_performance':
            return (
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader><TableRow><TableHead>Apartment Name</TableHead><TableHead>Occupancy Rate (%)</TableHead><TableHead>Net Income (KES)</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {reportData.map((apt, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{apt.name}</TableCell>
                                <TableCell>{apt.occupancyRate}</TableCell>
                                <TableCell>{apt.netIncome.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            );
        default:
            return <p className="text-center text-muted-foreground py-8">Report view for this type is not available.</p>;
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-6 w-6 text-primary" />
            Generate Custom Reports
          </CardTitle>
          <CardDescription>
            Select report type and apply filters to generate and download reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div>
                <label htmlFor="reportTypeFilter" className="text-sm font-medium text-muted-foreground">Report Type</label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                    <SelectTrigger id="reportTypeFilter">
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
                    <label htmlFor="startDateFilterLandlord" className="text-sm font-medium text-muted-foreground">Start Date</label>
                    <Input id="startDateFilterLandlord" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10"/>
                </div>
                <div>
                    <label htmlFor="endDateFilterLandlord" className="text-sm font-medium text-muted-foreground">End Date</label>
                    <Input id="endDateFilterLandlord" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10"/>
                </div>
            </div>
            <div>
                <label htmlFor="apartmentFilterReport" className="text-sm font-medium text-muted-foreground">Specific Apartment(s)</label>
                 <Select value={filterApartment} onValueChange={setFilterApartment}>
                    <SelectTrigger id="apartmentFilterReport"><SelectValue placeholder="All Apartments" /></SelectTrigger>
                    <SelectContent>{mockApartmentsForFilter.map(name => <SelectItem key={name} value={name} className="capitalize">{name === 'all' ? 'All Apartments' : name}</SelectItem>)}</SelectContent>
                </Select>
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
                <Button onClick={() => handleDownloadReport('csv')} variant="outline" size="sm" disabled={!reportData.length || isLoading}><Download className="mr-2 h-4 w-4"/>CSV</Button>
                <Button onClick={() => handleDownloadReport('excel')} variant="outline" size="sm" disabled={true}><Download className="mr-2 h-4 w-4"/>Excel</Button>
                <Button onClick={() => handleDownloadReport('pdf')} variant="outline" size="sm" disabled={true}><Download className="mr-2 h-4 w-4"/>PDF</Button>
            </div>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {renderReportContent()}
        </CardContent>
      </Card>
    </div>
  );
}

