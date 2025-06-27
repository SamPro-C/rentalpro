
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { LogIn, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/config';

const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean().default(false).optional(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const demoUsers = [
  { email: 'landlord@demo.com', password: 'password123', role: 'landlord', uid: 'demo-landlord-uid', fullName: 'Demo Landlord' },
  { email: 'tenant@demo.com', password: 'password123', role: 'tenant', uid: 'demo-tenant-uid', fullName: 'Demo Tenant' },
  { email: 'worker@demo.com', password: 'password123', role: 'worker', uid: 'demo-worker-uid', fullName: 'Demo Worker' },
  { email: 'shopmanager@demo.com', password: 'password123', role: 'shop_manager', uid: 'demo-shopmanager-uid', fullName: 'Demo Shop Manager' },
  { email: 'admin@demo.com', password: 'password123', role: 'admin', uid: 'demo-admin-uid', fullName: 'Demo Admin' },
];

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);

    // Check for demo user credentials
    const demoUser = demoUsers.find(
      (user) => user.email === data.email && user.password === data.password
    );

    if (demoUser) {
      toast({
        title: `Demo Login: ${demoUser.fullName}`,
        description: `Accessing ${demoUser.role} dashboard. This is a demo session.`,
      });
      // Simulate user object and redirect
      // Note: This won't create a real Firebase session.
      // For a real app, you'd set user context here if not using Firebase directly.
      switch (demoUser.role) {
        case 'landlord':
          router.push('/landlord/dashboard');
          break;
        case 'tenant':
          router.push('/tenant/dashboard');
          break;
        case 'worker':
          router.push('/worker/dashboard');
          break;
        case 'shop_manager':
          router.push('/shop-manager/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/');
      }
      setIsLoading(false);
      return;
    }

    // Supabase login
    const { data: user, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role, approved')
        .eq('id', user.user.id)
        .single();

      if (profileError || !profile) {
        toast({
          title: "User data not found",
          description: "User exists but no profile data found.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!profile.approved) {
        toast({
          title: "Login failed",
          description: "Your account is pending admin approval.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const role = profile.role;
      toast({
        title: 'Login Successful!',
        description: 'Welcome back! Redirecting...',
      });

      switch (role) {
        case 'landlord':
          router.push('/landlord/dashboard');
          break;
        case 'tenant':
          router.push('/tenant/dashboard');
          break;
        case 'worker':
          router.push('/worker/dashboard');
          break;
        case 'shop_manager':
          router.push('/shop-manager/dashboard');
          break;
        case 'admin': 
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/'); 
      }
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[--text-secondary]">Email Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="you@example.com" 
                  {...field} 
                  className="bg-transparent border-[--border] text-[--text-primary] placeholder:text-[--text-muted] focus:ring-2 focus:ring-[--primary] focus:border-[--primary] rounded-lg"
                />
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
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  className="bg-transparent border-[--border] text-[--text-primary] placeholder:text-[--text-muted] focus:ring-2 focus:ring-[--primary] focus:border-[--primary] rounded-lg"
                />
              </FormControl>
              <FormMessage className="text-red-400"/>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-[--border] data-[state=checked]:bg-[--primary] data-[state=checked]:border-[--primary]"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-[--text-secondary] font-normal">Remember me</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Link href="/auth/forgot-password" className="text-sm text-[--primary] hover:text-[--primary-light]">
            Forgot Password?
          </Link>
        </div>
        
        <div className="text-xs text-[--text-muted]">
          This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply (placeholder).
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[--accent] hover:bg-[--accent-light] text-white font-semibold rounded-lg py-3 text-base shadow-[var(--glow)] transition-all duration-300 ease-in-out transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Form>
  );
}
