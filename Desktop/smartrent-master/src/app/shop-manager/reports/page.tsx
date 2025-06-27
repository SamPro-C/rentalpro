
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Download, Filter, CalendarDays, Package, ShoppingCart, DollarSign, Users } from 'lucide-react'; 
import { useState } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Input } from '@/components/ui/input'; 
import { useToast } from '@/hooks/use-toast';
import { mockShopProducts, mockShopCustomers, mockAdminGlobalOrders } from '@/lib/mock-data'; // Using some admin data for orders


const salesData = [
  { month: "Jan", sales: Math.floor(Math.random() * 20000) + 5000 },
  { month: "Feb", sales: Math.floor(Math.random() * 20000) + 5000 },
  { month: "Mar", sales: Math.floor(Math.random() * 20000) + 5000 },
  { month: "Apr", sales: Math.floor(Math.random() * 20000) + 5000 },
  { month: "May", sales: Math.floor(Math.random() * 20000) + 5000 },
  { month: "Jun", sales: Math.floor(Math.random() * 20000) + 5000 },
];
const chartConfig = {
  sales: { label: "Sales (KES)", color: "hsl(var(--primary))" },
};

const reportTypes = [
    { value: 'sales_overview', label: 'Sales Overview', icon: DollarSign },
    { value: 'product_performance', label: 'Product Performance', icon: Package },
    { value: 'order_summary', label: 'Order Summary', icon: ShoppingCart },
    { value: 'customer_insights', label: 'Customer Insights', icon: Users },
];
const mockProductCategories = ['all', ...new Set(mockShopProducts.map(p => p.category))];


export default function ShopReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState(reportTypes[0].value);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const { toast } = useToast();
  const [reportData, setReportData] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = () => {
    setIsLoading(true);
    console.log("Generating shop report with filters:", { selectedReportType, startDate, endDate, filterCategory });
    
    setTimeout(() => {
        let dataToSet = [];
        switch(selectedReportType) {
            case 'sales_overview': dataToSet = salesData; break;
            case 'product_performance': dataToSet = mockShopProducts.map(p => ({ name: p.name, sku: p.sku, category: p.category, price: p.price, stock: p.stock, salesCount: Math.floor(Math.random() * 50) + 5 })); break; // Mock sales count
            case 'order_summary': dataToSet = mockAdminGlobalOrders.map(o => ({ orderId: o.orderId, customerName: o.customerName, date: o.date, totalAmount: o.totalAmount, status: o.orderStatus })); break;
            case 'customer_insights': dataToSet = mockShopCustomers.map(c => ({ name: c.name, apartmentUnit: c.apartmentUnit, totalOrders: c.totalOrders, totalSpent: c.totalSpent, lastOrderDate: c.lastOrderDate})); break;
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
        case 'sales_overview':
            headers = ["Month", "Sales (KES)"];
            rows = data.map(item => [item.month, item.sales.toString()]);
            break;
        case 'product_performance':
            headers = ["Product Name", "SKU", "Category", "Price (KES)", "Stock", "Sales Count"];
            rows = data.map(item => [item.name, item.sku, item.category, item.price.toString(), item.stock.toString(), item.salesCount.toString()]);
            break;
        case 'order_summary':
            headers = ["Order ID", "Customer Name", "Date", "Total Amount (KES)", "Status"];
            rows = data.map(item => [item.orderId, item.customerName, item.date, item.totalAmount.toString(), item.status]);
            break;
        case 'customer_insights':
            headers = ["Customer Name", "Apartment/Unit", "Total Orders", "Total Spent (KES)", "Last Order Date"];
            rows = data.map(item => [item.name, item.apartmentUnit, item.totalOrders.toString(), item.totalSpent.toString(), item.lastOrderDate]);
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
    const reportName = reportTypes.find(rt => rt.value === selectedReportType)?.label || "ShopReport";
    const csvData = generateCSV(reportData, selectedReportType);

    if (csvData) {
        downloadCSV(csvData, `shop_${reportName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        toast({ title: "Download Started", description: `${reportName} CSV is downloading.` });
    } else {
        toast({ title: "Download Failed", description: "Could not generate CSV data for this report type.", variant: "destructive" });
    }
  };

  const renderReportContent = () => {
    if(isLoading) return <p className="text-center text-muted-foreground py-8">Generating report...</p>;
    if(!reportData.length && !isLoading) return <p className="text-center text-muted-foreground py-8">No data to display. Please generate a report.</p>;

    switch(selectedReportType) {
        case 'sales_overview':
            return (
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <BarChart accessibilityLayer data={reportData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis tickFormatter={(value) => `KES ${value/1000}k`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                    </BarChart>
                </ChartContainer>
            );
        case 'product_performance':
        case 'order_summary':
        case 'customer_insights':
            const headersMap = {
                product_performance: ["Product Name", "SKU", "Category", "Price (KES)", "Stock", "Sales Count"],
                order_summary: ["Order ID", "Customer Name", "Date", "Total Amount (KES)", "Status"],
                customer_insights: ["Customer Name", "Apartment/Unit", "Total Orders", "Total Spent (KES)", "Last Order Date"],
            };
            const dataKeysMap = {
                product_performance: ["name", "sku", "category", "price", "stock", "salesCount"],
                order_summary: ["orderId", "customerName", "date", "totalAmount", "status"],
                customer_insights: ["name", "apartmentUnit", "totalOrders", "totalSpent", "lastOrderDate"],
            }
            const headers = headersMap[selectedReportType as keyof typeof headersMap];
            const dataKeys = dataKeysMap[selectedReportType as keyof typeof dataKeysMap];

            return (
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader><TableRow>{headers.map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
                    <TableBody>
                        {reportData.map((item, idx) => (
                            <TableRow key={idx}>
                                {dataKeys.map(key => <TableCell key={key}>{item[key]}</TableCell>)}
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
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Shop Reports & Analytics</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2 h-6 w-6 text-primary" />Report Filters</CardTitle>
          <CardDescription>Select report type and apply filters to generate insights.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div>
                <label htmlFor="shopReportTypeFilter" className="text-sm font-medium text-muted-foreground">Report Type</label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                    <SelectTrigger id="shopReportTypeFilter"><SelectValue placeholder="Select report type" /></SelectTrigger>
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
                    <label htmlFor="startDateFilterShop" className="text-sm font-medium text-muted-foreground">Start Date</label>
                    <Input id="startDateFilterShop" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10"/>
                </div>
                <div>
                    <label htmlFor="endDateFilterShop" className="text-sm font-medium text-muted-foreground">End Date</label>
                    <Input id="endDateFilterShop" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10"/>
                </div>
            </div>
            { (selectedReportType === 'product_performance' || selectedReportType === 'sales_overview') &&
              <div>
                  <label htmlFor="categoryFilterShopReport" className="text-sm font-medium text-muted-foreground">Product Category</label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger id="categoryFilterShopReport"><SelectValue placeholder="All Categories" /></SelectTrigger>
                      <SelectContent>{mockProductCategories.map(name => <SelectItem key={name} value={name} className="capitalize">{name === 'all' ? 'All Categories' : name}</SelectItem>)}</SelectContent>
                  </Select>
              </div>
            }
          </div>
           <Button onClick={handleGenerateReport} disabled={isLoading} size="lg" className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
            <BarChart3 className="mr-2 h-5 w-5" /> {isLoading ? "Generating..." : "Generate Report"}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle>Report Output: {reportTypes.find(rt=>rt.value === selectedReportType)?.label}</CardTitle>
                <CardDescription>View the generated report data below.</CardDescription>
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

