'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Building2, Eye, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockAdminGlobalProperties, type AdminGlobalProperty } from '@/lib/mock-data';

export default function AdminPropertyOversightPage() {
  const [properties, setProperties] = useState<AdminGlobalProperty[]>(mockAdminGlobalProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.landlordName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (propertyId: string) => {
    toast({ title: "View Property Details", description: `Viewing details for property ${propertyId} (placeholder). This would navigate to a detailed audit page.` });
    // router.push(`/admin/properties/${propertyId}/audit`);
  };
  
  const handleFlagForAudit = (propertyId: string) => {
    toast({ title: "Property Flagged", description: `Property ${propertyId} has been flagged for audit.` });
    // Potentially update property status in backend/mock data
     setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, auditStatus: 'Pending Audit' } : p));
  };

  const getStatusBadgeVariant = (status: AdminGlobalProperty['auditStatus']): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'Verified': return 'default'; // Green
      case 'Pending Audit': return 'secondary'; // Yellow/Orange
      case 'Issues Found': return 'destructive'; // Red
      default: return 'outline';
    }
  };
   const getStatusBadgeClasses = (status: AdminGlobalProperty['auditStatus']): string => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-700';
      case 'Pending Audit': return 'bg-yellow-100 text-yellow-700';
      case 'Issues Found': return 'bg-red-100 text-red-700';
      default: return '';
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Global Property Oversight</h1>
      <CardDescription>
        View and audit all properties registered on the SmartRent platform.
      </CardDescription>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Building2 className="mr-2 h-6 w-6 text-primary" />All Registered Apartments</CardTitle>
           <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by Name, Landlord, Location..."
                className="pl-8 w-full md:w-1/2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProperties.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Building2 className="mx-auto h-16 w-16 mb-4" />
              <p className="text-lg font-semibold">No properties found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property Name</TableHead>
                    <TableHead>Landlord</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Total Units</TableHead>
                    <TableHead>Occupancy Rate</TableHead>
                    <TableHead>Audit Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.name}</TableCell>
                      <TableCell>{property.landlordName}</TableCell>
                      <TableCell>{property.location}</TableCell>
                      <TableCell>{property.totalUnits}</TableCell>
                      <TableCell>{property.occupancyRate.toFixed(1)}%</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(property.auditStatus)} className={getStatusBadgeClasses(property.auditStatus)}>
                          {property.auditStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(property.id)} title="View Details/Audit History">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(property.auditStatus === 'Verified' || property.auditStatus === 'Issues Found') && (
                          <Button variant="ghost" size="icon" onClick={() => handleFlagForAudit(property.id)} title="Flag for Audit" className="text-orange-500 hover:text-orange-600">
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}