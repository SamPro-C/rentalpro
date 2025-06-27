
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Settings, User, Lock, Briefcase, Bell, CreditCard, Save, Landmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email(),
  phone: z.string().min(10, "Valid phone number is required.").regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format."),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
});

const businessSchema = z.object({
    companyName: z.string().optional(),
    kraPin: z.string().optional(), 
    bankAccountName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    bankName: z.string().optional(),
    bankBranch: z.string().optional(),
    bankSwiftCode: z.string().optional(),
});

const notificationPreferencesSchema = z.object({
  emailNewServiceRequest: z.boolean().default(true),
  smsNewServiceRequest: z.boolean().default(false),
  emailPaymentConfirmationToTenant: z.boolean().default(true),
  smsPaymentConfirmationToTenant: z.boolean().default(true),
  emailLandlordPaymentReceived: z.boolean().default(true),
  smsLandlordPaymentReceived: z.boolean().default(true),
  emailTenantRegistrationConfirmation: z.boolean().default(true),
  emailSystemAnnouncements: z.boolean().default(true),
});

const paymentGatewaySchema = z.object({
    mpesaPaybill: z.string().optional(),
    mpesaConsumerKey: z.string().optional(), 
    mpesaConsumerSecret: z.string().optional(), 
    cardProcessorApiKey: z.string().optional(), 
    cardProcessorSecretKey: z.string().optional(),
});


export default function SettingsPage() {
  const { toast } = useToast();

  const initialProfileData = { fullName: 'Valued Landlord', email: 'landlord@example.com', phone: '0712345000' };
  const initialBusinessData = { companyName: 'Smart Properties Ltd', kraPin: 'P012345678X', bankAccountName: 'Smart Properties Ltd', bankAccountNumber:'0112233445566', bankName:'KCB Bank', bankBranch: 'Westlands Branch', bankSwiftCode: 'KCBLKENX' };
  const initialNotificationPrefs = { 
      emailNewServiceRequest: true, smsNewServiceRequest: false, 
      emailPaymentConfirmationToTenant: true, smsPaymentConfirmationToTenant: true, 
      emailLandlordPaymentReceived: true, smsLandlordPaymentReceived: true,
      emailTenantRegistrationConfirmation: true, emailSystemAnnouncements: true 
    };
  const initialPaymentGatewayData = { mpesaPaybill: '555222', mpesaConsumerKey: '', mpesaConsumerSecret: '', cardProcessorApiKey: '', cardProcessorSecretKey: ''};

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialProfileData,
  });
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: ''},
  });
  const businessForm = useForm<z.infer<typeof businessSchema>>({
    resolver: zodResolver(businessSchema),
    defaultValues: initialBusinessData,
  });
  const notificationsForm = useForm<z.infer<typeof notificationPreferencesSchema>>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: initialNotificationPrefs,
  });
   const paymentGatewayForm = useForm<z.infer<typeof paymentGatewaySchema>>({
    resolver: zodResolver(paymentGatewaySchema),
    defaultValues: initialPaymentGatewayData,
  });


  function onProfileSubmit(data: z.infer<typeof profileSchema>) {
    console.log('Profile Update Data:', data);
    toast({ title: "Profile Updated", description: "Your personal information has been saved."});
  }
  function onPasswordSubmit(data: z.infer<typeof passwordSchema>) {
    console.log('Password Change Data:', data);
    // TODO: API call, check current password
    toast({ title: "Password Change Attempted", description: "Password change logic to be implemented."});
    passwordForm.reset();
  }
  function onBusinessSubmit(data: z.infer<typeof businessSchema>) {
    console.log('Business Details Update Data:', data);
    toast({ title: "Business Details Updated", description: "Your business information has been saved."});
  }
  function onNotificationsSubmit(data: z.infer<typeof notificationPreferencesSchema>) {
    console.log('Notification Preferences Update Data:', data);
    toast({ title: "Notification Preferences Updated", description: "Your notification settings have been saved."});
  }
  function onPaymentGatewaySubmit(data: z.infer<typeof paymentGatewaySchema>) {
    console.log('Payment Gateway Settings Update Data:', data);
    toast({ title: "Payment Gateway Settings Updated", description: "Payment settings saved (sensitive fields should be handled securely)."});
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Settings</h1>

      {/* Profile Information */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5 text-primary"/>Profile Information</CardTitle>
          <CardDescription>Manage your personal details.</CardDescription>
        </CardHeader>
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <CardContent className="space-y-4">
              <FormField control={profileForm.control} name="fullName" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={profileForm.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={profileForm.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit"><Save className="mr-2 h-4 w-4"/>Save Profile</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Change Password */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Lock className="mr-2 h-5 w-5 text-primary"/>Change Password</CardTitle>
          <CardDescription>Update your login password.</CardDescription>
        </CardHeader>
         <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <CardContent className="space-y-4">
              <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={passwordForm.control} name="confirmNewPassword" render={({ field }) => (
                <FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit"><Save className="mr-2 h-4 w-4"/>Update Password</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {/* Business Details */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary"/>Business Details (Optional)</CardTitle>
          <CardDescription>Manage your company information if applicable for tax and payout purposes.</CardDescription>
        </CardHeader>
         <Form {...businessForm}>
          <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={businessForm.control} name="companyName" render={({ field }) => (
                  <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={businessForm.control} name="kraPin" render={({ field }) => (
                  <FormItem><FormLabel>KRA PIN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
              <Separator />
              <h3 className="text-lg font-semibold text-foreground flex items-center"><Landmark className="mr-2 h-5 w-5 text-primary/80"/>Bank Account for Direct Deposits (Payouts)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={businessForm.control} name="bankAccountName" render={({ field }) => (
                  <FormItem><FormLabel>Account Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={businessForm.control} name="bankAccountNumber" render={({ field }) => (
                  <FormItem><FormLabel>Account Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={businessForm.control} name="bankName" render={({ field }) => (
                  <FormItem><FormLabel>Bank Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={businessForm.control} name="bankBranch" render={({ field }) => (
                  <FormItem><FormLabel>Bank Branch</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={businessForm.control} name="bankSwiftCode" render={({ field }) => (
                  <FormItem className="md:col-span-2"><FormLabel>Bank SWIFT/BIC Code</FormLabel><FormControl><Input {...field} placeholder="e.g., KCBLKENX" /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit"><Save className="mr-2 h-4 w-4"/>Save Business Details</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Notification Preferences */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-primary"/>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified for various events.</CardDescription>
        </CardHeader>
        <Form {...notificationsForm}>
            <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}>
                <CardContent className="space-y-4">
                    <FormField control={notificationsForm.control} name="emailNewServiceRequest" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Email for New Service Requests</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )}/>
                    <FormField control={notificationsForm.control} name="smsNewServiceRequest" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>SMS for New Service Requests</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )}/>
                    <FormField control={notificationsForm.control} name="emailLandlordPaymentReceived" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Email When You Receive a Payment</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )}/>
                     <FormField control={notificationsForm.control} name="smsLandlordPaymentReceived" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>SMS When You Receive a Payment</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )}/>
                    <FormField control={notificationsForm.control} name="emailPaymentConfirmationToTenant" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Email Payment Confirmation to Tenant</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )}/>
                    <FormField control={notificationsForm.control} name="smsPaymentConfirmationToTenant" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>SMS Payment Confirmation to Tenant</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )}/>
                    <FormField control={notificationsForm.control} name="emailTenantRegistrationConfirmation" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Email for New Tenant Registrations (Confirmation)</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )}/>
                    <FormField control={notificationsForm.control} name="emailSystemAnnouncements" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Email for System Announcements</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )}/>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit"><Save className="mr-2 h-4 w-4"/>Save Notification Preferences</Button>
                </CardFooter>
            </form>
        </Form>
      </Card>

      {/* Payment Gateway Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary"/>Payment Gateway Settings</CardTitle>
          <CardDescription>Configure your M-Pesa and card payment details for rent collection. (Admin may also control parts of this)</CardDescription>
        </CardHeader>
         <Form {...paymentGatewayForm}>
          <form onSubmit={paymentGatewayForm.handleSubmit(onPaymentGatewaySubmit)}>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={paymentGatewayForm.control} name="mpesaPaybill" render={({ field }) => (
                    <FormItem><FormLabel>M-Pesa Paybill / Till Number</FormLabel><FormControl><Input {...field} placeholder="e.g., 555222" /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={paymentGatewayForm.control} name="mpesaConsumerKey" render={({ field }) => (
                    <FormItem><FormLabel>M-Pesa Consumer Key (Optional)</FormLabel><FormControl><Input type="password" {...field} placeholder="Enter if using direct M-Pesa API" /></FormControl><FormDescription className="text-xs text-destructive">Handle API keys with extreme care.</FormDescription><FormMessage /></FormItem>
                )}/>
                <FormField control={paymentGatewayForm.control} name="mpesaConsumerSecret" render={({ field }) => (
                    <FormItem><FormLabel>M-Pesa Consumer Secret (Optional)</FormLabel><FormControl><Input type="password" {...field} placeholder="Enter if using direct M-Pesa API" /></FormControl><FormDescription className="text-xs text-destructive">Handle API keys with extreme care.</FormDescription><FormMessage /></FormItem>
                )}/>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={paymentGatewayForm.control} name="cardProcessorApiKey" render={({ field }) => (
                    <FormItem><FormLabel>Card Processor API Key (Optional)</FormLabel><FormControl><Input type="password" {...field} placeholder="e.g., Stripe, Paystack API Key" /></FormControl><FormDescription className="text-xs text-destructive">Handle API keys with extreme care.</FormDescription><FormMessage /></FormItem>
                )}/>
                 <FormField control={paymentGatewayForm.control} name="cardProcessorSecretKey" render={({ field }) => (
                    <FormItem><FormLabel>Card Processor Secret Key (Optional)</FormLabel><FormControl><Input type="password" {...field} placeholder="e.g., Stripe, Paystack Secret Key" /></FormControl><FormDescription className="text-xs text-destructive">Handle API keys with extreme care.</FormDescription><FormMessage /></FormItem>
                )}/>
               </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit"><Save className="mr-2 h-4 w-4"/>Save Payment Settings</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* General App Settings - Placeholder */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5 text-primary"/>General App Settings</CardTitle>
          <CardDescription>Timezone and currency display (usually system-wide, view only for landlord).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
            <p><strong className="text-muted-foreground">Timezone:</strong> Africa/Nairobi (System Default)</p>
            <p><strong className="text-muted-foreground">Currency:</strong> KES (System Default)</p>
        </CardContent>
      </Card>

    </div>
  );
}
