'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoginForm from '@/components/auth/LoginForm';
import RegistrationForm from '@/components/auth/RegistrationForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/config';
import { Loader2, ShieldQuestion } from 'lucide-react';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') || 'login';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && (tab === 'login' || tab === 'register')) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch user profile to get role
          const { data: profile, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (!error && profile) {
            switch (profile.role) {
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
          } else {
            // fallback redirect
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/');
      } finally {
        setIsLoadingUser(false);
      }
    };

    checkSession();
  }, [router]);

  if (isLoadingUser) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[--bg-primary] to-[--bg-secondary] text-[--text-primary] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[--primary]" />
        <p className="mt-4 text-lg">Loading user session...</p>
      </div>
    );
  }

  // Removed demoCredentials array and demo accounts card

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[--bg-primary] to-[--bg-secondary] text-[--text-primary]">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12 flex flex-col items-center justify-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2 bg-[--bg-glass] border border-[--border] rounded-lg p-1 backdrop-blur-sm">
            <TabsTrigger 
              value="login" 
              className="text-[--text-secondary] data-[state=active]:text-[--text-primary] data-[state=active]:bg-[--primary] data-[state=active]:shadow-[var(--glow)] rounded-md"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="text-[--text-secondary] data-[state=active]:text-[--text-primary] data-[state=active]:bg-[--primary] data-[state=active]:shadow-[var(--glow)] rounded-md"
            >
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="mt-4 bg-[--bg-card] border border-[--border] shadow-[var(--shadow-lg-futuristic)] rounded-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-3xl font-headline text-center bg-clip-text text-transparent bg-gradient-to-r from-[--primary-light] to-[--accent]">Welcome Back!</CardTitle>
                <CardDescription className="text-center text-[--text-muted]">Login to access your SmartRent dashboard.</CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card className="mt-4 bg-[--bg-card] border border-[--border] shadow-[var(--shadow-lg-futuristic)] rounded-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-3xl font-headline text-center bg-clip-text text-transparent bg-gradient-to-r from-[--primary-light] to-[--accent]">Create Your Account</CardTitle>
                <CardDescription className="text-center text-[--text-muted]">Join SmartRent to manage properties or enhance your living.</CardDescription>
              </CardHeader>
              <CardContent>
                <RegistrationForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
