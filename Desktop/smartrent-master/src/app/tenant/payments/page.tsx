'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge'; 
import { CreditCard, DollarSign, FileText, Upload, Eye, Download } from 'lucide-react';
import { mockTenantProfiles } from '@/app/landlord/tenants/[tenantId]/page'; 
import { useToast } from '@/hooks/use-toast';
import { initiateStkPush } from '@/lib/api/mpesa';

export default function TenantPaymentsPage() {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [amountDue, setAmountDue] = useState(0);
  const { toast } = useToast();

  // Mock current tenant - replace with actual authentication logic
  const currentTenant = mockTenantProfiles[0]; // This should come from your auth context

  useEffect(() => {
    // Set the amount due based on tenant data
    // This should be calculated based on rent amount, late fees, etc.
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const existingPayment = currentTenant.paymentHistory.find(p => p.monthYear === currentMonth && p.status === 'Paid');
    
    if (!existingPayment) {
      setAmountDue(currentTenant.rentAmount || 50000); // Default rent amount
    } else {
      setAmountDue(0); // Already paid
    }
  }, [currentTenant]);

  const handleMakePayment = () => {
    if (!paymentMethod) {
      toast({ title: "Payment Error", description: "Please select a payment method.", variant: "destructive" });
      return;
    }
    if (amountDue <= 0) {
      toast({ title: "No Payment Due", description: "You have no outstanding balance for the current month.", variant: "default" });
      return;
    }
    console.log("Processing payment:", { tenantId: currentTenant.id, amount: amountDue, method: paymentMethod, mpesaPhone, proofOfPayment });
    toast({ title: "Payment Submitted (Placeholder)", description: `Payment of KES ${amountDue} via ${paymentMethod} is being processed.`});
  };

  const handleViewReceipt = (paymentId: string) => {
    const payment = currentTenant.paymentHistory.find(p => p.id === paymentId);
    if (payment) {
      const receiptWindow = window.open('', '_blank');
      if (receiptWindow) {
        receiptWindow.document.write(`
          <html>
            <head>
              <title>Payment Receipt - ${payment.transactionId || payment.id}</title>
              <style>
                body { font-family: sans-serif; margin: 20px; color: #333; }
                .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                h1 { text-align: center; color: #4CAF50; }
                p { margin-bottom: 10px; line-height: 1.6; }
                strong { color: #555; }
                .details-grid { display: grid; grid-template-columns: 150px 1fr; gap: 8px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 30px; font-size: 0.8em; color: #777; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Payment Receipt</h1>
                <p>Thank you for your payment, ${currentTenant.fullName}.</p>
                <div class="details-grid">
                  <strong>Receipt ID:</strong><span>${payment.transactionId || payment.id}</span>
                  <strong>Payment Date:</strong><span>${payment.paymentDate}</span>
                  <strong>Month/Year:</strong><span>${payment.monthYear}</span>
                  <strong>Amount Paid:</strong><span>KES ${payment.amountPaid.toLocaleString()}</span>
                  <strong>Payment Method:</strong><span>${payment.method}</span>
                  <strong>Apartment:</strong><span>${currentTenant.apartmentName} - ${currentTenant.unitName}</span>
                  <strong>Tenant ID:</strong><span>${currentTenant.id}</span>
                </div>
                <div class="footer">
                  SmartRent Property Management
                </div>
              </div>
            </body>
          </html>
        `);
        receiptWindow.document.close();
      } else {
        toast({ title: "Error", description: "Could not open receipt window. Please disable pop-up blockers.", variant: "destructive" });
      }
    } else {
      toast({ title: "Error", description: "Payment record not found.", variant: "destructive" });
    }
  };
  
  const handleDownloadHistory = () => {
    if (!currentTenant || currentTenant.paymentHistory.length === 0) {
      toast({ title: "No Data", description: "No payment history available to download.", variant: "default" });
      return;
    }

    const headers = [
      "Month/Year", 
      "Amount Due (KES)", 
      "Amount Paid (KES)", 
      "Payment Date", 
      "Method", 
      "Transaction ID", 
      "Status"
    ];
    const csvRows = [headers.join(',')];

    currentTenant.paymentHistory.forEach(p => {
      const row = [
        `"${p.monthYear}"`,
        p.amountDue,
        p.amountPaid,
        `"${p.paymentDate}"`,
        `"${p.method}"`,
        `"${p.transactionId || '-'}"`,
        `"${p.status}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      const dateSuffix = new Date().toLocaleDateString('en-CA').replace(/-/g, '');
      link.setAttribute('href', url);
      link.setAttribute('download', `payment-history-${currentTenant.id}-${dateSuffix}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: "Download Started", description: "Your payment history CSV is downloading." });
    } else {
      toast({ title: "Download Failed", description: "CSV download is not supported by your browser.", variant: "destructive" });
    }
  };

  const handleInitiateStkPush = async () => {
    try {
      const phone = mpesaPhone || currentTenant.phone;
      const accountRef = `${currentTenant.unitName}${currentTenant.roomNumber}`;
      const description = `Rent payment for ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`;

      const response = await initiateStkPush(phone, amountDue, accountRef, description);
      if (response.ResponseCode === '0') {
        toast({ title: "STK Push Sent", description: `M-Pesa STK push sent to ${phone} for KES ${amountDue}. Please complete the payment on your phone.` });
        // Optionally, create a payment record with status 'Pending'
      } else {
        toast({ title: "STK Push Failed", description: response.ResponseDescription || 'Failed to initiate payment.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: "Error", description: 'Failed to initiate M-Pesa payment. Please try again later.', variant: 'destructive' });
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">My Payments</h1>
      
      <Tabs defaultValue="make-payment" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="make-payment">Make a Payment</TabsTrigger>
          <TabsTrigger value="payment-history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="make-payment">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><CreditCard className="mr-2 h-6 w-6 text-primary"/>Make Rent Payment</CardTitle>
              <CardDescription>Current Month: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="paymentAmountDisplay">Amount to Pay (KES)</Label>
                <Input 
                  id="paymentAmountDisplay" 
                  type="number" 
                  value={amountDue.toString()} 
                  readOnly 
                  className="mt-1 bg-muted/50 cursor-default text-lg font-semibold"
                />
                 {amountDue > 0 ? (
                  <p className="text-sm text-muted-foreground mt-1">This is your current outstanding balance.</p>
                ) : (
                  <p className="text-sm text-green-600 mt-1">No outstanding balance for this month. Thank you!</p>
                )}
              </div>

              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select onValueChange={setPaymentMethod} value={paymentMethod} disabled={amountDue <= 0}>
                  <SelectTrigger id="paymentMethod" className="mt-1">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                    <SelectItem value="Card">Credit/Debit Card</SelectItem>
                    <SelectItem value="BankTransfer">Bank Transfer (Upload Proof)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === 'M-Pesa' && amountDue > 0 && (
                <div className="p-4 border rounded-md bg-muted/50 space-y-3">
                  <h3 className="font-semibold">M-Pesa Payment</h3>
                  <p className="text-sm">Instructions: Go to M-Pesa menu, select Lipa na M-Pesa, then Paybill.</p>
                  <p className="text-sm"><strong>Business Number:</strong> XXXXXX (Provided by Landlord)</p>
                  <p className="text-sm"><strong>Account Number:</strong> {currentTenant.unitName}{currentTenant.roomNumber}</p>
                  <div>
                    <Label htmlFor="mpesaPhone">Confirm M-Pesa Phone Number for STK Push (Optional)</Label>
                    <Input id="mpesaPhone" value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} placeholder={currentTenant.phone} className="mt-1"/>
                  </div>
                  <Button onClick={handleInitiateStkPush} className="w-full bg-green-600 hover:bg-green-700 text-white">Initiate STK Push (Placeholder)</Button>
                </div>
              )}

              {paymentMethod === 'Card' && amountDue > 0 && (
                 <div className="p-4 border rounded-md bg-muted/50 space-y-3">
                    <h3 className="font-semibold">Card Payment</h3>
                    <div><Label htmlFor="cardNumber">Card Number</Label><Input id="cardNumber" placeholder="•••• •••• •••• ••••" className="mt-1" /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><Label htmlFor="cardExpiry">Expiry (MM/YY)</Label><Input id="cardExpiry" placeholder="MM/YY" className="mt-1"/></div>
                        <div><Label htmlFor="cardCvv">CVV</Label><Input id="cardCvv" placeholder="•••" className="mt-1"/></div>
                    </div>
                     <p className="text-xs text-muted-foreground">Secure payment processing by Stripe (Placeholder).</p>
                </div>
              )}
              
              {paymentMethod === 'BankTransfer' && amountDue > 0 && (
                <div className="p-4 border rounded-md bg-muted/50 space-y-3">
                    <h3 className="font-semibold">Bank Transfer</h3>
                    <p className="text-sm">Bank Name: XYZ Bank Kenya (Provided by Landlord)</p>
                    <p className="text-sm">Account Name: SmartRent Properties Ltd</p>
                    <p className="text-sm">Account Number: 0123456789012</p>
                    <p className="text-sm">Branch: Westlands</p>
                    <p className="text-sm font-semibold mt-2">After transfer, please upload proof of payment:</p>
                    <div>
                        <Label htmlFor="popUpload" className="flex items-center"><Upload className="mr-2 h-4 w-4"/>Upload Proof of Payment</Label>
                        <Input id="popUpload" type="file" onChange={(e) => setProofOfPayment(e.target.files ? e.target.files[0] : null)} className="mt-1"/>
                        {proofOfPayment && <p className="text-xs text-muted-foreground mt-1">Selected: {proofOfPayment.name}</p>}
                    </div>
                </div>
              )}

              <Button 
                onClick={handleMakePayment} 
                className="w-full mt-4 text-lg py-3 bg-accent hover:bg-accent/90 text-accent-foreground" 
                disabled={!paymentMethod || amountDue <= 0}
              >
                <DollarSign className="mr-2 h-5 w-5" /> Pay KES {amountDue.toLocaleString()}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-history">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <CardTitle className="flex items-center"><FileText className="mr-2 h-6 w-6 text-primary"/>Payment History</CardTitle>
                <CardDescription>Your past rent payment records.</CardDescription>
              </div>
              <Button variant="outline" onClick={handleDownloadHistory} className="mt-2 sm:mt-0">
                <Download className="mr-2 h-4 w-4"/> Download History
              </Button>
            </CardHeader>
            <CardContent>
              {currentTenant.paymentHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month/Year</TableHead>
                      <TableHead>Amount Due</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTenant.paymentHistory.map(p => (
                      <TableRow key={p.id}>
                        <TableCell>{p.monthYear}</TableCell>
                        <TableCell>KES {p.amountDue.toLocaleString()}</TableCell>
                        <TableCell>KES {p.amountPaid.toLocaleString()}</TableCell>
                        <TableCell>{p.paymentDate}</TableCell>
                        <TableCell>{p.method}</TableCell>
                        <TableCell>{p.transactionId || '-'}</TableCell>
                        <TableCell>
                           <Badge variant={p.status === 'Paid' ? 'default' : (p.status === 'Unpaid' ? 'destructive' : 'secondary')}
                                       className={p.status === 'Paid' ? 'bg-green-100 text-green-700' : p.status === 'Unpaid' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}>
                                    {p.status}
                           </Badge>
                        </TableCell>
                        <TableCell>
                            {p.status === 'Paid' && 
                              <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleViewReceipt(p.id)}>
                                <Eye className="mr-1 h-3 w-3"/>View
                              </Button>
                            }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-6">No payment history found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}