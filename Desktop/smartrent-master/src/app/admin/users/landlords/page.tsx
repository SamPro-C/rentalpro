
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, Edit3, Trash2, UserX, UserCheck, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface Landlord {
  id: string;
  name: string;
  email: string;
  phone: string;
  apartmentsCount: number;
  status: 'Active' | 'Inactive';
}

const mockLandlords: Landlord[] = [
  { id: 'landlord001', name: 'Landlord Alpha', email: 'alpha@example.com', phone: '0712345000', apartmentsCount: 3, status: 'Active' },
  { id: 'landlord002', name: 'Landlord Beta', email: 'beta@example.com', phone: '0722334455', apartmentsCount: 1, status: 'Active' },
  { id: 'landlord003', name: 'Landlord Gamma', email: 'gamma@example.com', phone: '0733445566', apartmentsCount: 5, status: 'Inactive' },
];

export default function ManageLandlordsPage() {
  const [landlords, setLandlords] = useState<Landlord[]>(mockLandlords);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredLandlords = landlords.filter(landlord =>
    landlord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    landlord.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    landlord.phone.includes(searchTerm)
  );

  const handleToggleStatus = (landlordId: string, currentStatus: 'Active' | 'Inactive') => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    if (window.confirm(`Are you sure you want to set landlord ${landlordId} to ${newStatus}?`)) {
      console.log(`Setting landlord ${landlordId} to ${newStatus}`);
      setLandlords(prev => prev.map(l => l.id === landlordId ? { ...l, status: newStatus } : l));
      toast({ title: 'Landlord Status Updated', description: `Landlord ${landlordId} is now ${newStatus}.` });
    }
  };

  const handleDelete = (landlordId: string) => {
    if (window.confirm(`Are you sure you want to DELETE landlord ${landlordId}? This action is permanent and will affect all associated data.`)) {
      console.log('Deleting landlord:', landlordId);
      setLandlords(prev => prev.filter(l => l.id !== landlordId));
      toast({ title: 'Landlord Deleted', description: `Landlord ${landlordId} has been deleted.`, variant: 'destructive' });
    }
  };
  
  const handleViewProfile = (landlordId: string) => toast({title: "View Profile", description: `Viewing profile for ${landlordId} (placeholder).`});
  const handleEditDetails = (landlordId: string) => toast({title: "Edit Details", description: `Editing details for ${landlordId} (placeholder).`});


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Manage Landlords</h1>
      <CardDescription>View, edit, activate, or deactivate landlord accounts.</CardDescription>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2 h-6 w-6 text-primary" />All Registered Landlords</CardTitle>
           <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by Name, Email, Phone..."
                className="pl-8 w-full md:w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLandlords.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="mx-auto h-16 w-16 mb-4" />
              <p className="text-lg font-semibold">No landlords found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Apartments</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLandlords.map((landlord) => (
                    <TableRow key={landlord.id}>
                      <TableCell className="font-medium">{landlord.name}</TableCell>
                      <TableCell>{landlord.email}</TableCell>
                      <TableCell>{landlord.phone}</TableCell>
                      <TableCell>{landlord.apartmentsCount}</TableCell>
                      <TableCell>
                        <Badge variant={landlord.status === 'Active' ? 'default' : 'destructive'}
                               className={landlord.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {landlord.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewProfile(landlord.id)} title="View Profile">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditDetails(landlord.id)} title="Edit Details">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleToggleStatus(landlord.id, landlord.status)} 
                            title={landlord.status === 'Active' ? 'Deactivate' : 'Activate'}
                            className={landlord.status === 'Active' ? 'text-orange-500 hover:text-orange-600' : 'text-green-500 hover:text-green-600'}
                        >
                          {landlord.status === 'Active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(landlord.id)} title="Delete Landlord" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
