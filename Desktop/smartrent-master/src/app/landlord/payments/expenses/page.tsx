
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, DollarSign, Edit3, Trash2, Search, Filter, Download, CalendarDays } from 'lucide-react';
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
import { format } from 'date-fns';
import { mockExpensesForLandlord } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
// Assuming DateRangePicker might be created or imported from a shared UI location
// import { DateRangePicker } from '@/components/ui/date-range-picker'; 
// import type { DateRange } from 'react-day-picker';

interface Expense {
  id: string;
  date: string; // Should be Date object in real app, using YYYY-MM-DD string from mock
  amount: number;
  type: string;
  description: string;
  apartmentName?: string; 
  addedBy: string; 
}

const expenseTypesForFilter = ['all', 'Maintenance', 'Utilities', 'Repairs', 'Cleaning', 'Salaries', 'Supplies', 'Marketing', 'Legal Fees', 'Other'];
const apartmentNamesForFilter = ['all', ...new Set(mockExpensesForLandlord.map(exp => exp.apartmentName).filter(Boolean) as string[]), 'Not Specified'];


export default function ExpensesManagementPage() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpensesForLandlord);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterApartment, setFilterApartment] = useState('all');
  // const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const { toast } = useToast();


  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
        const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || expense.type === filterType;
        const matchesApartment = filterApartment === 'all' || 
                                 (filterApartment === 'Not Specified' && !expense.apartmentName) || 
                                 expense.apartmentName === filterApartment;
        
        // Date range filtering (placeholder if DateRangePicker not fully implemented)
        // let matchesDate = true;
        // if (dateRange?.from && expense.date) {
        //     matchesDate = new Date(expense.date) >= dateRange.from;
        // }
        // if (dateRange?.to && expense.date && matchesDate) {
        //     matchesDate = new Date(expense.date) <= dateRange.to;
        // }
        // return matchesSearch && matchesType && matchesApartment && matchesDate;
        return matchesSearch && matchesType && matchesApartment;
    });
  }, [expenses, searchTerm, filterType, filterApartment/*, dateRange*/]);

  const handleEditExpense = (expenseId: string) => {
      console.log('Edit expense:', expenseId);
      toast({title: "Edit Expense", description: `Editing expense ${expenseId}. Form would appear.`});
  }
  const handleDeleteExpense = (expenseId: string) => {
    if (window.confirm(`Are you sure you want to delete expense ${expenseId}?`)) {
      console.log('Delete expense:', expenseId);
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
      toast({title: "Expense Deleted", description: `Expense ${expenseId} removed.`, variant: "destructive"});
    }
  };
  const handleExport = () => {
      console.log("Exporting expense data:", filteredExpenses);
      toast({title: "Exporting Expenses", description: "Data export initiated (placeholder)."});
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Expenses Management</h1>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/landlord/payments/expenses/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Expense
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-6 w-6 text-primary" />
            All Expenses
          </CardTitle>
          <CardDescription>
            Track and manage all operational expenses for your properties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by Description..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="typeFilterExpense" className="text-sm font-medium text-muted-foreground">Filter by Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger id="typeFilterExpense"><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent>{expenseTypesForFilter.map(type => <SelectItem key={type} value={type} className="capitalize">{type === 'all' ? 'All Types' : type}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="apartmentFilterExpense" className="text-sm font-medium text-muted-foreground">Filter by Apartment</label>
                <Select value={filterApartment} onValueChange={setFilterApartment}>
                  <SelectTrigger id="apartmentFilterExpense"><SelectValue placeholder="All Apartments" /></SelectTrigger>
                  <SelectContent>{apartmentNamesForFilter.map(name => <SelectItem key={name} value={name} className="capitalize">{name === 'all' ? 'All Apartments' : name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {/* <div>
                <Label htmlFor="dateRangeExpense" className="text-sm font-medium text-muted-foreground">Date Range</Label>
                 <DateRangePicker date={dateRange} onDateChange={setDateRange} id="dateRangeExpense" /> 
                 <Input type="text" placeholder="Date Range Picker (To be implemented)" disabled className="h-10" />
              </div> */}
              <Button onClick={handleExport} variant="outline" className="self-end">
                <Download className="mr-2 h-4 w-4" /> Export Results
              </Button>
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="text-center py-10">
              <DollarSign className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">No expenses match your criteria.</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters, or add a new expense.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount (KES)</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Apartment</TableHead>
                  <TableHead>Added By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell className="font-medium">{expense.amount.toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline">{expense.type}</Badge></TableCell>
                    <TableCell className="max-w-xs truncate" title={expense.description}>{expense.description}</TableCell>
                    <TableCell>{expense.apartmentName || <span className="italic text-muted-foreground">N/A</span>}</TableCell>
                    <TableCell>{expense.addedBy}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditExpense(expense.id)} title="Edit Expense">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title="Delete Expense">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
