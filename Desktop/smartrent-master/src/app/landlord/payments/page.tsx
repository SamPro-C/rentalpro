
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, DollarSign, Search, Filter, Download, Users, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo } from 'react';
import { mockPaymentRecordsForLandlord, mockUnpaidRentRecordsForLandlord } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { initiateStkPush } from '@/lib/api/mpesa';

interface PaidPaymentRecord {
  id: string;
  tenantName: string;
  tenantId: string;
  apartmentName: string;
  unitName: string;
  roomNumber: string;
  amountPaid: number;
  paymentDate: string; // YYYY-MM-DD
  method: string;
  transactionId: string;
}

interface UnpaidPaymentRecord {
  id: string;
  tenantName: string;
  tenantId: string;
  apartmentName: string;
  unitName: string;
  roomNumber: string;
  amountDue: number;
  dueDate: string; // YYYY-MM-DD
}

type PaymentRecord = PaidPaymentRecord | UnpaidPaymentRecord;

// Mock apartment names for filter dropdown
const apartmentNamesForFilter = ['all', ...new Set(mockPaymentRecordsForLandlord.map(p => p.apartmentName).concat(mockUnpaidRentRecordsForLandlord.map(p=>p.apartmentName)))];
const monthsForFilter = ['all', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentYear = new Date().getFullYear();
const yearsForFilter = ['all', ...Array.from({length: 3}, (_, i) => (currentYear - i).toString())];


const PaymentTable = ({ records, type, searchTerm, filterApartment, filterMonth, filterYear }: { 
    records: PaymentRecord[], 
    type: 'paid' | 'unpaid',
    searchTerm: string,
    filterApartment: string,
    filterMonth: string,
    filterYear: string
}) => {

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
        const matchesSearch = record.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              record.tenantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              record.apartmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              record.unitName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const recordDate = type === 'paid' ? record.paymentDate : record.dueDate;
        const recordMonth = recordDate ? new Date(recordDate + 'T00:00:00').toLocaleString('default', { month: 'long' }) : ''; // Ensure date string is parsed correctly
        const recordYear = recordDate ? new Date(recordDate + 'T00:00:00').getFullYear().toString() : '';

        const matchesApartment = filterApartment === 'all' || record.apartmentName === filterApartment;
        const matchesMonth = filterMonth === 'all' || recordMonth === filterMonth;
        const matchesYear = filterYear === 'all' || recordYear === filterYear;

        return matchesSearch && matchesApartment && matchesMonth && matchesYear;
    });
  }, [records, searchTerm, filterApartment, filterMonth, filterYear, type]);


  if (filteredRecords.length === 0) {
    return <p className="text-muted-foreground text-center py-6">No {type} rent records found for the selected criteria.</p>;
  }
  return (
    <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tenant Name</TableHead>
          <TableHead>Apartment/Unit/Room</TableHead>
          {type === 'paid' ? <TableHead>Amount Paid</TableHead> : <TableHead>Amount Due</TableHead>}
          {type === 'paid' ? <TableHead>Payment Date</TableHead> : <TableHead>Due Date</TableHead>}
          {type === 'paid' && <TableHead>Method</TableHead>}
          {type === 'paid' && <TableHead>Transaction ID</TableHead>}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredRecords.map((record) => (
          <TableRow key={record.id}>
            <TableCell className="font-medium">{record.tenantName} <span className="text-xs text-muted-foreground">({record.tenantId})</span></TableCell>
            <TableCell>{record.apartmentName} / {record.unitName} / {record.roomNumber}</TableCell>
            <TableCell>KES {(type === 'paid' ? record.amountPaid : ('amountDue' in record ? record.amountDue : undefined))?.toLocaleString()}</TableCell>
            <TableCell>{type === 'paid' ? record.paymentDate : record.dueDate}</TableCell>
            {type === 'paid' && <TableCell>{record.method || '-'}</TableCell>}
            {type === 'paid' && <TableCell>{record.transactionId || '-'}</TableCell>}
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/landlord/tenants/${record.tenantId}`}>View Tenant</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
};


export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState(monthsForFilter[new Date().getMonth()+1]); // Default to current month + 'all'
  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [filterApartment, setFilterApartment] = useState('all');
  const { toast } = useToast();

  const [selectedTenant, setSelectedTenant] = useState<PaymentRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [mpesaPhone, setMpesaPhone] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExportPaid = () => {
      console.log("Exporting paid rent data based on filters:", {searchTerm, filterApartment, filterMonth, filterYear});
      toast({title: "Exporting Paid Rent", description: "Data export initiated (placeholder)."});
  }
  const handleExportUnpaid = () => {
      console.log("Exporting unpaid rent data based on filters:", {searchTerm, filterApartment, filterMonth, filterYear});
      toast({title: "Exporting Unpaid Rent", description: "Data export initiated (placeholder)."});
  }
  const handleSendReminders = () => {
      const unpaidTenantsToRemind = mockUnpaidRentRecordsForLandlord.filter(record => {
         const recordDate = record.dueDate;
         const recordMonth = recordDate ? new Date(recordDate + 'T00:00:00').toLocaleString('default', { month: 'long' }) : '';
         const recordYear = recordDate ? new Date(recordDate + 'T00:00:00').getFullYear().toString() : '';
         const matchesApartment = filterApartment === 'all' || record.apartmentName === filterApartment;
         const matchesMonth = filterMonth === 'all' || recordMonth === filterMonth;
         const matchesYear = filterYear === 'all' || recordYear === filterYear;
         return matchesApartment && matchesMonth && matchesYear;
      });

      if(unpaidTenantsToRemind.length > 0 && window.confirm(`Send payment reminders to ${unpaidTenantsToRemind.length} tenant(s) with unpaid rent?`)) {
        console.log("Sending payment reminders to unpaid tenants...", unpaidTenantsToRemind.map(t => t.tenantId));
        toast({title: "Reminders Sent", description: `Payment reminders sent to ${unpaidTenantsToRemind.length} tenant(s).`});
      } else if (unpaidTenantsToRemind.length === 0) {
        toast({title: "No Reminders Sent", description: "No tenants with unpaid rent match current filters."});
      }
  }

  const handleInitiatePayment = async () => {
    if (!selectedTenant) {
      toast({ title: "No Tenant Selected", description: "Please select a tenant to make a payment.", variant: "destructive" });
      return;
    }
    if (!paymentAmount || paymentAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid payment amount.", variant: "destructive" });
      return;
    }
    if (!paymentMethod) {
      toast({ title: "No Payment Method", description: "Please select a payment method.", variant: "destructive" });
      return;
    }
    if (paymentMethod === 'M-Pesa' && !mpesaPhone) {
      toast({ title: "Phone Number Required", description: "Please enter a phone number for M-Pesa payment.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      if (paymentMethod === 'M-Pesa') {
        // Fetch landlord's M-Pesa credentials from backend or context
        const landlordMpesaCredentials = await fetchLandlordMpesaCredentials(selectedTenant.tenantId);
        if (!landlordMpesaCredentials) {
          toast({ title: "Missing M-Pesa Credentials", description: "Landlord's M-Pesa credentials are not configured.", variant: "destructive" });
          setIsProcessing(false);
          return;
        }
        const response = await initiateStkPush(mpesaPhone, paymentAmount, selectedTenant.tenantId, `Rent payment for ${selectedTenant.apartmentName}`, landlordMpesaCredentials);
        if (response.ResponseCode === '0') {
          toast({ title: "STK Push Sent", description: `M-Pesa STK push sent to ${mpesaPhone} for KES ${paymentAmount}. Please complete the payment on your phone.` });
          // TODO: Create payment record with status 'Pending'
        } else {
          toast({ title: "STK Push Failed", description: response.ResponseDescription || 'Failed to initiate payment.', variant: 'destructive' });
        }
      } else {
        // Handle other payment methods here
        toast({ title: "Payment Method Not Supported", description: "Currently only M-Pesa payments are supported.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Payment Error", description: "Failed to process payment. Please try again later.", variant: "destructive" });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Placeholder function to fetch landlord's M-Pesa credentials
  async function fetchLandlordMpesaCredentials(tenantId: string) {
    // TODO: Implement API call to fetch landlord's M-Pesa credentials based on tenantId
    // For now, return sandbox credentials as example
    return {
      consumerKey: 'KyGJwXLfkGaArkWQEkJ3fBDqptToNaW0Oodx2LxCqAzc5PJi',
      consumerSecret: 'uBFwdkwz92uVTggI1tt1QQj5HWGv47IzG7OviwTs6LfBUoGeg6IDF6vRgZFNCZE9',
      shortcode: '174379',
      passkey: process.env.NEXT_PUBLIC_MPESA_PASSKEY || '',
    };
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Payments & Financials</h1>
        <div className="flex gap-2 flex-wrap">
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                <Link href="/landlord/payments/manual">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Manual Payment
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/landlord/payments/expenses">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Manage Expenses
                </Link>
            </Button>
        </div>
      </div>

    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
            <CardDescription>Refine payment records by month, year, apartment, or tenant.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 border-b bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Search by Tenant Name/ID, Unit..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="monthFilterPay" className="text-sm font-medium text-muted-foreground">Month</label>
                    <Select value={filterMonth} onValueChange={setFilterMonth}>
                        <SelectTrigger id="monthFilterPay"><SelectValue placeholder="All Months" /></SelectTrigger>
                        <SelectContent>{monthsForFilter.map(m => <SelectItem key={m} value={m} className="capitalize">{m === 'all' ? "All Months" : m}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="yearFilterPay" className="text-sm font-medium text-muted-foreground">Year</label>
                    <Select value={filterYear} onValueChange={setFilterYear}>
                        <SelectTrigger id="yearFilterPay"><SelectValue placeholder="All Years" /></SelectTrigger>
                        <SelectContent>{yearsForFilter.map(y => <SelectItem key={y} value={y}>{y === 'all' ? "All Years" : y}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                 <div>
                    <label htmlFor="apartmentFilterPay" className="text-sm font-medium text-muted-foreground">Apartment</label>
                    <Select value={filterApartment} onValueChange={setFilterApartment}>
                        <SelectTrigger id="apartmentFilterPay"><SelectValue placeholder="All Apartments" /></SelectTrigger>
                        <SelectContent>{apartmentNamesForFilter.map(name => <SelectItem key={name} value={name} className="capitalize">{name === 'all' ? 'All Apartments' : name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>
        </CardContent>

        <Tabs defaultValue="paid" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paid" className="text-base">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-600"/> Paid Rent
                </TabsTrigger>
                <TabsTrigger value="unpaid" className="text-base">
                    <AlertTriangle className="mr-2 h-5 w-5 text-red-600"/> Unpaid Rent
                </TabsTrigger>
            </TabsList>
            <TabsContent value="paid">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle>Paid Rent Records</CardTitle>
                            <CardDescription>Tenants who have completed their payments for the selected period.</CardDescription>
                        </div>
                        <Button onClick={handleExportPaid} variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export Paid</Button>
                    </CardHeader>
                    <CardContent>
                        <PaymentTable records={mockPaymentRecordsForLandlord} type="paid" searchTerm={searchTerm} filterApartment={filterApartment} filterMonth={filterMonth} filterYear={filterYear}/>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="unpaid">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle>Unpaid Rent Records</CardTitle>
                            <CardDescription>Tenants with outstanding payments for the selected period.</CardDescription>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button onClick={handleSendReminders} variant="outline" size="sm" className="border-orange-500 text-orange-600 hover:bg-orange-500/10"><MessageSquare className="mr-2 h-4 w-4" />Send Reminders</Button>
                            <Button onClick={handleExportUnpaid} variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export Unpaid</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <PaymentTable records={mockUnpaidRentRecordsForLandlord} type="unpaid" searchTerm={searchTerm} filterApartment={filterApartment} filterMonth={filterMonth} filterYear={filterYear} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </Card>

      <Card className="shadow-lg mt-6 p-4">
        <CardHeader>
          <CardTitle>Make a Payment</CardTitle>
          <CardDescription>Select a tenant and enter payment details to initiate M-Pesa payment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="tenantSelect" className="block mb-1 font-medium text-muted-foreground">Tenant</label>
            <select
              id="tenantSelect"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={selectedTenant?.id || ''}
              onChange={(e) => {
                const tenant = mockPaymentRecordsForLandlord.find(t => t.id === e.target.value) || null;
                setSelectedTenant(tenant);
                setPaymentAmount(tenant?.amountDue);
              }}
            >
              <option value="">Select Tenant</option>
              {mockUnpaidRentRecordsForLandlord.map(tenant => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.tenantName} - {tenant.apartmentName} / {tenant.unitName} / {tenant.roomNumber} (Due: KES {tenant.amountDue?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="paymentAmount" className="block mb-1 font-medium text-muted-foreground">Amount (KES)</label>
            <Input
              id="paymentAmount"
              type="number"
              value={paymentAmount || ''}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              min={1}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block mb-1 font-medium text-muted-foreground">Payment Method</label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M-Pesa">M-Pesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === 'M-Pesa' && (
            <div>
              <label htmlFor="mpesaPhone" className="block mb-1 font-medium text-muted-foreground">Phone Number</label>
              <Input
                id="mpesaPhone"
                type="tel"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                placeholder="Enter phone number for M-Pesa payment"
                className="w-full"
              />
            </div>
          )}

          <Button
            onClick={handleInitiatePayment}
            disabled={isProcessing}
            className="mt-4"
          >
            {isProcessing ? 'Processing...' : `Pay KES ${paymentAmount?.toLocaleString() || ''}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
