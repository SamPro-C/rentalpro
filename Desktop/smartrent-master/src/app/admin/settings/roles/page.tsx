'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck, PlusCircle, Edit3, UserCircle, Users, Building, DollarSign, SettingsIcon, ShoppingCart, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockAdminUserRoles, type AdminUserRole, type AdminPermission } from '@/lib/mock-data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const permissionIcons: { [key: string]: React.ElementType } = {
  Users: UserCircle,
  Properties: Building,
  Financials: DollarSign,
  Settings: SettingsIcon,
  Ecommerce: ShoppingCart,
  ServiceRequests: ClipboardList,
  Default: ShieldCheck
};

export default function AdminRolesPermissionsPage() {
  const [roles, setRoles] = useState<AdminUserRole[]>(mockAdminUserRoles);
  const { toast } = useToast();

  const handleEditRole = (roleId: string) => {
    toast({ title: "Edit Role Permissions", description: `Modal/page to edit permissions for role ${roleId} would open.` });
    // In a real app, you might open a dialog with checkboxes for each permission
  };
  
  const handleAddRole = () => {
    toast({ title: "Add New Role", description: "Form to define a new role and its permissions would appear." });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Roles & Permissions Management</h1>
      <CardDescription>
        Define and manage permissions for different user roles within the SmartRent system.
      </CardDescription>

      <div className="flex justify-end">
        <Button onClick={handleAddRole} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Role
        </Button>
      </div>

      {roles.length === 0 ? (
        <Card className="shadow-lg">
            <CardContent className="text-center py-10 text-muted-foreground">
                <ShieldCheck className="mx-auto h-16 w-16 mb-4" />
                <p className="text-lg font-semibold">No roles defined yet.</p>
                <p className="text-sm">Click "Add New Role" to get started.</p>
            </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="w-full space-y-4">
            {roles.map((role) => (
                <AccordionItem value={role.id} key={role.id} className="border rounded-lg shadow-md bg-card">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-primary"/>
                            <div>
                                <h3 className="text-lg font-semibold">{role.name}</h3>
                                <p className="text-xs text-muted-foreground">{role.description}</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                        <h4 className="text-md font-medium mb-3 text-foreground/90">Permissions:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {Object.entries(role.permissions).map(([module, actions]) => {
                                const Icon = permissionIcons[module] || permissionIcons.Default;
                                return (
                                <div key={module} className="space-y-2 p-3 border rounded-md bg-muted/30">
                                    <h5 className="font-semibold flex items-center"><Icon className="mr-2 h-4 w-4 text-primary/80"/>{module}</h5>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                        {Object.entries(actions).map(([action, granted]) => (
                                            <div key={action} className="flex items-center space-x-1.5">
                                                <Checkbox id={`${role.id}-${module}-${action}`} checked={granted as boolean} disabled className="opacity-70" />
                                                <label htmlFor={`${role.id}-${module}-${action}`} className="text-xs text-muted-foreground capitalize">{action}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )})}
                        </div>
                        <div className="mt-4 text-right">
                            <Button variant="outline" size="sm" onClick={() => handleEditRole(role.id)}>
                                <Edit3 className="mr-2 h-4 w-4"/> Edit Permissions
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      )}
    </div>
  );
}