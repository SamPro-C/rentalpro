
'use client';
// This page can act as a hub for settings or redirect to the first settings sub-page (e.g., system)

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Bell, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SettingsHubPage() {
  const settingsSections = [
    { title: 'General Configuration', href: '/admin/settings/system', icon: Settings, description: 'Manage global platform settings.' },
    { title: 'Notifications & Announcements', href: '/admin/settings/notifications', icon: Bell, description: 'Control system-wide notifications and templates.' },
    { title: 'Roles & Permissions', href: '/admin/settings/roles', icon: ShieldCheck, description: 'Define user roles and their access rights.' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">System Settings Center</h1>
      <CardDescription>
        Manage and configure various aspects of the SmartRent platform.
      </CardDescription>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map(section => (
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
