'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UserCircle, Save, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function AdminProfilePage() {
  const { toast } = useToast();
  // In a real app, fetch admin's current details
  const adminUser = {
      fullName: "System Administrator",
      email: "admin@smartrent.com",
      phone: "0700000000",
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log("Admin Profile Update:", data);
    toast({ title: "Profile Updated", description: "Your admin profile details have been saved (placeholder)." });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log("Admin Password Change:", data);
    if (data.adminNewPassword !== data.adminConfirmNewPassword) {
        toast({ title: "Password Mismatch", description: "New passwords do not match.", variant: "destructive"});
        return;
    }
    if ((data.adminNewPassword as string).length < 8) {
         toast({ title: "Weak Password", description: "New password must be at least 8 characters.", variant: "destructive"});
        return;
    }
    toast({ title: "Password Updated", description: "Your password has been changed (placeholder)." });
    // Reset password fields
    (e.target as HTMLFormElement).reset();
  };
  
  const handleSetup2FA = () => {
    toast({ title: "Setup 2FA Initiated", description: "Two-Factor Authentication setup process would begin here (e.g., show QR code for authenticator app)." });
  }


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">My Admin Profile</h1>
      <CardDescription>
        Manage your personal administrator account details and security settings.
      </CardDescription>

      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={handleProfileSubmit} className="space-y-6">
            <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center"><UserCircle className="mr-2 h-5 w-5 text-primary"/>My Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="adminFullName">Full Name</Label>
                    <Input id="adminFullName" name="adminFullName" defaultValue={adminUser.fullName} />
                </div>
                <div>
                    <Label htmlFor="adminEmail">Email Address</Label>
                    <Input id="adminEmail" name="adminEmail" type="email" defaultValue={adminUser.email} />
                </div>
                <div>
                    <Label htmlFor="adminPhone">Phone Number</Label>
                    <Input id="adminPhone" name="adminPhone" defaultValue={adminUser.phone} />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" size="sm"><Save className="mr-2 h-4 w-4"/>Save Details</Button>
            </CardFooter>
            </Card>
        </form>

        <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="adminCurrentPassword">Current Password</Label>
                        <Input id="adminCurrentPassword" name="adminCurrentPassword" type="password" placeholder="Enter current password" required/>
                    </div>
                    <div>
                        <Label htmlFor="adminNewPassword">New Password</Label>
                        <Input id="adminNewPassword" name="adminNewPassword" type="password" placeholder="Enter new password (min 8 chars)" required/>
                    </div>
                    <div>
                        <Label htmlFor="adminConfirmNewPassword">Confirm New Password</Label>
                        <Input id="adminConfirmNewPassword" name="adminConfirmNewPassword" type="password" placeholder="Confirm new password" required/>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button type="submit" size="sm"><Save className="mr-2 h-4 w-4"/>Update Password</Button>
                </CardFooter>
            </Card>
        </form>
      </div>
        
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary"/>Two-Factor Authentication (2FA)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-3">Enhance your account security by enabling 2FA.</p>
          {/* This would show current 2FA status and options */}
          <div className="flex items-center gap-4">
            <p className="text-sm">Current Status: <span className="font-semibold text-destructive">Not Enabled</span></p>
            <Button onClick={handleSetup2FA} variant="outline">
                <ShieldCheck className="mr-2 h-4 w-4"/> Setup 2FA
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">You will be guided through setting up an authenticator app (e.g., Google Authenticator, Authy).</p>
        </CardContent>
      </Card>
        
    </div>
  );
}