
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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/config';

const registrationFormSchema = z.object({
  role: z.enum(['landlord', 'tenant', 'worker', 'shop_manager'], {
    required_error: "You need to select a role.",
  }),
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.').regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format."),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service and Privacy Policy.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], 
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

export default function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      role: undefined,
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const selectedRole = form.watch('role');

  async function onSubmit(data: RegistrationFormValues) {
    setIsLoading(true);

    // Check if email already exists in users table
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.email);

    if (fetchError) {
      toast({
        title: "Registration Failed",
        description: fetchError.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (existingUsers && existingUsers.length > 0) {
      toast({
        title: "Registration Failed",
        description: "An account with this email already exists.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { data: user, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          fullName: data.fullName,
          phone: data.phone,
          role: data.role,
          approved: false, // Set approved false for all new users, admin approval required
        },
      },
    });

    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "Registration Successful!",
      description: "Your account has been created. Please check your email to confirm and wait for admin approval.",
    });

    // Redirect to pending approval page instead of dashboard
    router.push('/pending-approval');
    setIsLoading(false);
  }

  const renderRoleSpecificInfo = () => {
    if (!selectedRole) return null;
    let title = '';
    let description = '';
    let canRegisterDirectly = true;

    switch (selectedRole) {
      case 'tenant':
        title = 'Tenant Registration Note';
        description = 'Tenants are typically registered by their Landlord. If your Landlord has invited you, please check your email/SMS for an activation link. Self-registration here will create an account, but you may need landlord approval/assignment.';
        canRegisterDirectly = true; // Allowing self-registration, but with a note
        break;
      case 'worker':
        title = 'Worker Registration Note';
        description = 'Workers are usually registered by their Landlord/Manager. If you\'ve been invited, please use the link provided. Self-registration here will create an account pending assignment.';
        canRegisterDirectly = true; // Allowing self-registration
        break;
      case 'shop_manager':
        title = 'Shop Manager Registration Note';
        description = 'Shop Manager accounts require approval from SmartRent administration. Your application will be reviewed.';
        canRegisterDirectly = true; // Allowing application
        break;
      default: // Landlord
        return null;
    }

    return (
      <Alert className="mt-4 bg-[--bg-glass] border-[--border] text-[--text-secondary] rounded-lg">
        <Info className="h-4 w-4 text-[--primary]" />
        <AlertTitle className="text-[--text-primary]">{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[--text-secondary]">I am a...</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-transparent border-[--border] text-[--text-primary] focus:ring-2 focus:ring-[--primary] focus:border-[--primary] rounded-lg">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[--bg-secondary] border-[--border] text-[--text-primary]">
                  <SelectItem value="landlord" className="hover:!bg-[--primary] focus:!bg-[--primary]">Landlord</SelectItem>
                  <SelectItem value="tenant" className="hover:!bg-[--primary] focus:!bg-[--primary]">Tenant</SelectItem>
                  <SelectItem value="worker" className="hover:!bg-[--primary] focus:!bg-[--primary]">Worker</SelectItem>
                  <SelectItem value="shop_manager" className="hover:!bg-[--primary] focus:!bg-[--primary]">Shop Manager</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400"/>
            </FormItem>
          )}
        />

        {renderRoleSpecificInfo()}

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[--text-secondary]">Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} className="bg-transparent border-[--border] text-[--text-primary] placeholder:text-[--text-muted] focus:ring-2 focus:ring-[--primary] focus:border-[--primary] rounded-lg"/>
              </FormControl>
              <FormMessage className="text-red-400"/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[--text-secondary]">Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} className="bg-transparent border-[--border] text-[--text-primary] placeholder:text-[--text-muted] focus:ring-2 focus:ring-[--primary] focus:border-[--primary] rounded-lg"/>
              </FormControl>
              <FormMessage className="text-red-400"/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[--text-secondary]">Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+254 712 345678" {...field} className="bg-transparent border-[--border] text-[--text-primary] placeholder:text-[--text-muted] focus:ring-2 focus:ring-[--primary] focus:border-[--primary] rounded-lg"/>
              </FormControl>
              <FormMessage className="text-red-400"/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[--text-secondary]">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Create a strong password" {...field} className="bg-transparent border-[--border] text-[--text-primary] placeholder:text-[--text-muted] focus:ring-2 focus:ring-[--primary] focus:border-[--primary] rounded-lg"/>
              </FormControl>
              <FormDescription className="text-[--text-muted] text-xs">Minimum 8 characters.</FormDescription>
              <FormMessage className="text-red-400"/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[--text-secondary]">Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm your password" {...field} className="bg-transparent border-[--border] text-[--text-primary] placeholder:text-[--text-muted] focus:ring-2 focus:ring-[--primary] focus:border-[--primary] rounded-lg"/>
              </FormControl>
              <FormMessage className="text-red-400"/>
            </FormItem>
          )}
        />
        
        <div className="text-xs text-[--text-muted] pt-2">
          This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply (placeholder).
        </div>

        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-[--border] data-[state=checked]:bg-[--primary] data-[state=checked]:border-[--primary]"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-[--text-secondary] font-normal">
                  I agree to the <a href="/terms" target="_blank" className="text-[--primary] hover:text-[--primary-light] underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-[--primary] hover:text-[--primary-light] underline">Privacy Policy</a>.
                </FormLabel>
                <FormMessage className="text-red-400"/>
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-[--accent] hover:bg-[--accent-light] text-white font-semibold rounded-lg py-3 text-base shadow-[var(--glow)] mt-4 transition-all duration-300 ease-in-out transform hover:scale-105"
          disabled={isLoading || !selectedRole}
        >
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
          {isLoading ? 'Processing...' : 'Register'}
        </Button>
        
        {(selectedRole === 'landlord' || selectedRole === 'shop_manager') && (
            <FormDescription className="text-center pt-2 text-[--text-muted] text-xs">
                Registrations for Landlords and Shop Managers may require Admin approval.
            </FormDescription>
        )}
      </form>
    </Form>
  );
}
