
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function UserManagementHubPage() {
  const userManagementSections = [
    { title: 'User Approval Queue', href: '/admin/users/approvals', icon: ShieldCheck, description: 'Review and approve new user registrations.' },
    { title: 'Manage Landlords', href: '/admin/users/landlords', icon: Users, description: 'View, edit, and manage landlord accounts.' },
    { title: 'Manage Tenants', href: '/admin/users/tenants', icon: Users, description: 'Oversee all tenant accounts across the platform.' },
    { title: 'Manage Workers', href: '/admin/users/workers', icon: Users, description: 'Manage worker profiles and system access.' },
    { title: 'Manage Shop Managers', href: '/admin/users/shop-managers', icon: Users, description: 'Control shop manager accounts and access.' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">User Management Center</h1>
      <CardDescription>
        Access and manage all user roles within the SmartRent system. Use the sections below to navigate to specific user management areas.
      </CardDescription>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {userManagementSections.map(section => (
          <Card key={section.href} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <section.icon className="mr-3 h-6 w-6 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
              <Button asChild className="w-full">
                <Link href={section.href}>Go to {section.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
