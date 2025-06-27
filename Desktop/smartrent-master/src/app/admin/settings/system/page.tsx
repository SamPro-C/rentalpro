
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Settings, CreditCard, Mail, MessageSquare, FileTextIcon, Save, Key, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function AdminSystemSettingsPage() {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("System Settings Submitted:", data);
    toast({
      title: "System Settings Updated (Placeholder)",
      description: "Your system configurations have been saved.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">System Configuration</h1>
      <CardDescription>
        Manage global settings that affect the entire SmartRent platform.
      </CardDescription>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary"/>Payment Gateway Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <Label htmlFor="mpesaPaybillGlobal">Global M-Pesa Paybill/Till</Label>
                <Input id="mpesaPaybillGlobal" name="mpesaPaybillGlobal" placeholder="e.g., 123456" defaultValue="123456"/>
            </div>
            <div>
                <Label htmlFor="cardApiKey">Card Processor API Key (e.g., Stripe PK)</Label>
                <Input id="cardApiKey" name="cardApiKey" type="password" placeholder="pk_live_************************"/>
            </div>
             <div>
                <Label htmlFor="cardApiSecret">Card Processor Secret Key (e.g., Stripe SK)</Label>
                <Input id="cardApiSecret" name="cardApiSecret" type="password" placeholder="sk_live_************************"/>
            </div>
             <div>
                <Label htmlFor="transactionFees">Platform Transaction Fee (%)</Label>
                <Input id="transactionFees" name="transactionFees" type="number" placeholder="e.g., 2.5" defaultValue="2.5" step="0.1"/>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><Mail className="mr-2 h-5 w-5 text-primary"/>Email & <MessageSquare className="ml-1 mr-2 h-5 w-5 text-primary"/>SMS Service Config</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <Label htmlFor="smsApiKey">SMS Gateway API Key (e.g., Africa's Talking)</Label>
                <Input id="smsApiKey" name="smsApiKey" type="password" placeholder="Enter SMS API Key"/>
            </div>
            <div>
                <Label htmlFor="smsApiUsername">SMS Gateway Username (Optional)</Label>
                <Input id="smsApiUsername" name="smsApiUsername" placeholder="Enter SMS API Username"/>
            </div>
            <div>
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input id="smtpHost" name="smtpHost" placeholder="e.g., smtp.example.com" defaultValue="smtp.mailgun.org"/>
            </div>
             <div>
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input id="smtpPort" name="smtpPort" placeholder="e.g., 587" defaultValue="587"/>
            </div>
             <div>
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input id="smtpUser" name="smtpUser" placeholder="e.g., postmaster@mg.example.com"/>
            </div>
            <div>
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input id="smtpPassword" name="smtpPassword" type="password" placeholder="Enter SMTP Password"/>
            </div>
            <div>
                <Label htmlFor="defaultFromEmail">Default "From" Email Address</Label>
                <Input id="defaultFromEmail" name="defaultFromEmail" type="email" placeholder="noreply@smartrent.app" defaultValue="noreply@smartrent.app"/>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><Key className="mr-2 h-5 w-5 text-primary"/>API Key Management</CardTitle>
            <CardDescription>Manage third-party API keys used by the system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <Label htmlFor="googleMapsApiKey">Google Maps API Key</Label>
                <Input id="googleMapsApiKey" name="googleMapsApiKey" type="password" placeholder="Enter Google Maps API Key"/>
            </div>
             <div>
                <Label htmlFor="someOtherServiceApiKey">Another Service API Key (Example)</Label>
                <Input id="someOtherServiceApiKey" name="someOtherServiceApiKey" type="password" placeholder="Enter API Key"/>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><FileTextIcon className="mr-2 h-5 w-5 text-primary"/>Legal & General App Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <Label htmlFor="appName">Application Name</Label>
                <Input id="appName" name="appName" defaultValue="SmartRent"/>
            </div>
            <div>
                <Label htmlFor="currency">Default Currency</Label>
                <Input id="currency" name="currency" defaultValue="KES"/>
            </div>
             <div>
                <Label htmlFor="timezone">Default Timezone</Label>
                <Input id="timezone" name="timezone" defaultValue="Africa/Nairobi"/>
            </div>
            <div>
                <Label htmlFor="termsOfServiceUrl">Terms of Service URL</Label>
                <Input id="termsOfServiceUrl" name="termsOfServiceUrl" placeholder="https://smartrent.app/terms" defaultValue="https://smartrent.app/terms"/>
            </div>
            <div>
                <Label htmlFor="privacyPolicyUrl">Privacy Policy URL</Label>
                <Input id="privacyPolicyUrl" name="privacyPolicyUrl" placeholder="https://smartrent.app/privacy" defaultValue="https://smartrent.app/privacy"/>
            </div>
            <div>
                <Label htmlFor="supportEmail">Support Email Address</Label>
                <Input id="supportEmail" name="supportEmail" type="email" placeholder="support@smartrent.app" defaultValue="support@smartrent.app"/>
            </div>
          </CardContent>
           <CardFooter className="border-t pt-4 flex justify-end">
            <Button type="submit" size="lg">
                <Save className="mr-2 h-4 w-4"/> Save System Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
