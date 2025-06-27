
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Settings, Store, Bell, CreditCard, Truck, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const shopInfoSchema = z.object({
  shopName: z.string().min(3, "Shop name is required."),
  contactEmail: z.string().email("Invalid email address."),
  contactPhone: z.string().min(10, "Valid phone number is required."),
  operatingHours: z.string().optional(),
});

const deliverySettingsSchema = z.object({
  deliveryZones: z.string().optional(), // Could be more complex, e.g. array of objects
  standardDeliveryFee: z.coerce.number().min(0).optional(),
  freeDeliveryThreshold: z.coerce.number().min(0).optional(),
});

const paymentGatewaySchemaShop = z.object({
    mpesaPaybillShop: z.string().optional(),
    cardProcessorApiKeyShop: z.string().optional(), // Sensitive
});

const notificationPreferencesSchemaShop = z.object({
  emailNewOrder: z.boolean().default(true),
  smsNewOrder: z.boolean().default(false),
  emailOrderUpdatesToCustomer: z.boolean().default(true),
});


export default function ShopSettingsPage() {
  const { toast } = useToast();

  const initialShopInfo = { shopName: 'SmartRent Local Mart', contactEmail: 'shop@smartrent.com', contactPhone: '0712345001', operatingHours: 'Mon-Sat: 9 AM - 6 PM' };
  const initialDeliverySettings = { standardDeliveryFee: 200, freeDeliveryThreshold: 3000 };
  const initialPaymentGatewayShop = { mpesaPaybillShop: '777888' };
  const initialNotificationPrefsShop = { emailNewOrder: true, smsNewOrder: true, emailOrderUpdatesToCustomer: true };


  const shopInfoForm = useForm<z.infer<typeof shopInfoSchema>>({
    resolver: zodResolver(shopInfoSchema),
    defaultValues: initialShopInfo,
  });
  const deliveryForm = useForm<z.infer<typeof deliverySettingsSchema>>({
    resolver: zodResolver(deliverySettingsSchema),
    defaultValues: initialDeliverySettings,
  });
  const paymentGatewayForm = useForm<z.infer<typeof paymentGatewaySchemaShop>>({
    resolver: zodResolver(paymentGatewaySchemaShop),
    defaultValues: initialPaymentGatewayShop,
  });
  const notificationsForm = useForm<z.infer<typeof notificationPreferencesSchemaShop>>({
    resolver: zodResolver(notificationPreferencesSchemaShop),
    defaultValues: initialNotificationPrefsShop,
  });

  function onShopInfoSubmit(data: z.infer<typeof shopInfoSchema>) {
    console.log('Shop Info Update:', data);
    toast({ title: "Shop Information Updated", description: "Your shop details have been saved."});
  }
  function onDeliverySubmit(data: z.infer<typeof deliverySettingsSchema>) {
    console.log('Delivery Settings Update:', data);
    toast({ title: "Delivery Settings Updated", description: "Delivery configurations saved."});
  }
  function onPaymentGatewaySubmit(data: z.infer<typeof paymentGatewaySchemaShop>) {
    console.log('Shop Payment Gateway Update:', data);
    toast({ title: "Payment Settings Updated", description: "Shop payment gateway info saved."});
  }
  function onNotificationsSubmit(data: z.infer<typeof notificationPreferencesSchemaShop>) {
    console.log('Shop Notification Preferences Update:', data);
    toast({ title: "Notification Preferences Updated", description: "Shop notification settings saved."});
  }


  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Shop Settings</h1>

      {/* Shop Information */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Store className="mr-2 h-5 w-5 text-primary"/>Shop Information</CardTitle>
          <CardDescription>Manage your shop's public details and contact information.</CardDescription>
        </CardHeader>
        <Form {...shopInfoForm}>
          <form onSubmit={shopInfoForm.handleSubmit(onShopInfoSubmit)}>
            <CardContent className="space-y-4">
              <FormField control={shopInfoForm.control} name="shopName" render={({ field }) => (
                <FormItem><FormLabel>Shop Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={shopInfoForm.control} name="contactEmail" render={({ field }) => (
                <FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={shopInfoForm.control} name="contactPhone" render={({ field }) => (
                <FormItem><FormLabel>Contact Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={shopInfoForm.control} name="operatingHours" render={({ field }) => (
                <FormItem><FormLabel>Operating Hours (Optional)</FormLabel><FormControl><Input placeholder="e.g., Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit"><Save className="mr-2 h-4 w-4"/>Save Shop Info</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Delivery Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Truck className="mr-2 h-5 w-5 text-primary"/>Delivery Settings</CardTitle>
          <CardDescription>Configure delivery zones, fees, and thresholds.</CardDescription>
        </CardHeader>
        <Form {...deliveryForm}>
          <form onSubmit={deliveryForm.handleSubmit(onDeliverySubmit)}>
            <CardContent className="space-y-4">
                <FormField control={deliveryForm.control} name="deliveryZones" render={({ field }) => (
                    <FormItem><FormLabel>Delivery Zones (e.g., Kilimani, Westlands)</FormLabel><FormControl><Textarea placeholder="Enter comma-separated delivery zones or describe areas" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={deliveryForm.control} name="standardDeliveryFee" render={({ field }) => (
                    <FormItem><FormLabel>Standard Delivery Fee (KES)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={deliveryForm.control} name="freeDeliveryThreshold" render={({ field }) => (
                    <FormItem><FormLabel>Free Delivery Threshold (KES)</FormLabel><FormControl><Input type="number" placeholder="e.g., 3000 (0 for no threshold)" {...field} /></FormControl><FormDescription>Order total above which delivery is free.</FormDescription><FormMessage /></FormItem>
                )}/>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit"><Save className="mr-2 h-4 w-4"/>Save Delivery Settings</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {/* Payment Gateway Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary"/>Payment Gateway Settings (Shop)</CardTitle>
          <CardDescription>Configure payment methods for shop transactions.</CardDescription>
        </CardHeader>
         <Form {...paymentGatewayForm}>
          <form onSubmit={paymentGatewayForm.handleSubmit(onPaymentGatewaySubmit)}>
            <CardContent className="space-y-4">
                <FormField control={paymentGatewayForm.control} name="mpesaPaybillShop" render={({ field }) => (
                    <FormItem><FormLabel>M-Pesa Paybill / Till (Shop)</FormLabel><FormControl><Input {...field} placeholder="e.g., 777888" /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={paymentGatewayForm.control} name="cardProcessorApiKeyShop" render={({ field }) => (
                    <FormItem><FormLabel>Card Processor API Key (Shop)</FormLabel><FormControl><Input type="password" {...field} placeholder="Enter API Key for shop card payments" /></FormControl><FormDescription className="text-xs text-destructive">Handle API keys with extreme care.</FormDescription><FormMessage /></FormItem>
                )}/>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit"><Save className="mr-2 h-4 w-4"/>Save Payment Settings</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Notification Preferences */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-primary"/>Shop Notification Preferences</CardTitle>
          <CardDescription>Choose how you and customers are notified about shop activity.</CardDescription>
        </CardHeader>
        <Form {...notificationsForm}>
            <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}>
                <CardContent className="space-y-4">
                    <FormField control={notificationsForm.control} name="emailNewOrder" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Email for New Orders (to Shop)</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )}/>
                    <FormField control={notificationsForm.control} name="smsNewOrder" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>SMS for New Orders (to Shop Phone)</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )}/>
                    <FormField control={notificationsForm.control} name="emailOrderUpdatesToCustomer" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Email Order Updates to Customer</FormLabel><FormDescription className="text-xs"> (e.g., Order Confirmed, Shipped, Delivered)</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )}/>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit"><Save className="mr-2 h-4 w-4"/>Save Notification Preferences</Button>
                </CardFooter>
            </form>
        </Form>
      </Card>
    </div>
  );
}
