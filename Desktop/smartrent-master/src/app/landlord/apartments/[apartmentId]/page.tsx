
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Building2, MapPin, Home, Users, Edit3, PlusCircle, ArrowLeft, Eye, Trash2, Wifi, ParkingSquare, ShieldCheckIcon, Power, Sun } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useParams, useRouter } from 'next/navigation'; 
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockApartmentList } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';

export interface Room {
  id: string;
  roomNumber: string;
  status: 'Vacant' | 'Occupied';
}
export interface Unit {
  id: string;
  unitName: string;
  numberOfRooms: number;
  currentTenant?: { name: string; id: string };
  status: 'Occupied' | 'Vacant';
  rooms: Room[];
}
export interface ApartmentDetails {
  id: string;
  name: string;
  location: string;
  description: string;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  imageUrl?: string;
  amenities: string[];
  units: Unit[];
}

const amenityIcons: { [key: string]: React.ElementType } = {
  'Parking': ParkingSquare,
  'Gym': Users, 
  'Pool': Users, 
  '24/7 Security': ShieldCheckIcon,
  'Wi-Fi': Wifi,
  'Backup Generator': Power,
  'Borehole': Sun,
  'Playground': Users 
};


export default function ApartmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const apartmentId = params.apartmentId as string;
  const { toast } = useToast();

  const [apartment, setApartment] = useState<ApartmentDetails | undefined>(
    mockApartmentList.find(apt => apt.id === apartmentId)
  );

  if (!apartment) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8 bg-background">
            <Building2 className="w-20 h-20 text-destructive mb-6" />
            <h2 className="text-3xl font-semibold text-foreground mb-3">Apartment Not Found</h2>
            <p className="text-muted-foreground mb-8 text-lg">The apartment with ID "{apartmentId}" could not be found or does not exist.</p>
            <Button asChild variant="outline" size="lg">
                <Link href="/landlord/apartments">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Apartments List
                </Link>
            </Button>
        </div>
    );
  }
  
  const handleEditApartment = () => {
      console.log("Edit apartment general details:", apartment.id);
      toast({title: "Edit Apartment", description: "Apartment editing form would appear here."});
      // router.push(`/landlord/apartments/${apartmentId}/edit`);
  };
  const handleAddUnit = () => {
      console.log("Add new unit to apartment:", apartment.id);
      toast({title: "Add Unit", description: "Form to add a new unit would appear here."});
      // router.push(`/landlord/apartments/${apartmentId}/units/new`);
  };
  const handleEditUnit = (unitId: string) => {
      console.log("Edit unit:", unitId);
      toast({title: "Edit Unit", description: `Editing unit ${unitId}. Form would appear here.`});
      // router.push(`/landlord/apartments/${apartmentId}/units/${unitId}/edit`);
  };
  const handleDeleteUnit = (unitId: string) => {
    if(window.confirm("Are you sure you want to delete this unit? This will also remove associated rooms and tenant assignments.")) {
        console.log("Delete unit:", unitId);
        setApartment(prev => {
            if (!prev) return undefined;
            const updatedUnits = prev.units.filter(u => u.id !== unitId);
            const updatedOccupiedUnits = updatedUnits.filter(u => u.status === 'Occupied').length;
            return {
                ...prev,
                units: updatedUnits,
                totalUnits: updatedUnits.length,
                occupiedUnits: updatedOccupiedUnits,
                vacantUnits: updatedUnits.length - updatedOccupiedUnits,
            };
        });
        toast({title: "Unit Deleted", description: `Unit ${unitId} has been removed.`, variant: "destructive"});
    }
  }


  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <Button variant="outline" size="sm" asChild className="mb-2 group-data-[sidebar-state=collapsed]:hidden">
                <Link href="/landlord/apartments">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Apartments
                </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
                <Building2 className="mr-3 h-8 w-8 text-primary" />
                {apartment.name}
            </h1>
            <p className="text-muted-foreground flex items-center mt-1">
                <MapPin className="mr-1.5 h-4 w-4" /> {apartment.location}
            </p>
        </div>
        <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={handleEditApartment}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Apartment
            </Button>
            <Button onClick={handleAddUnit} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Unit
            </Button>
        </div>
      </div>

      {apartment.imageUrl && (
        <Card className="shadow-lg overflow-hidden">
            <div className="relative w-full h-64 md:h-96">
                <Image 
                    src={apartment.imageUrl} 
                    alt={`Image of ${apartment.name}`} 
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="apartment building common area"
                    priority
                />
            </div>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
            <CardHeader>
                <CardTitle className="text-xl">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center"><Home className="mr-2 h-4 w-4" /> Total Units:</span>
                    <Badge variant="secondary" className="text-sm">{apartment.totalUnits}</Badge>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center"><Users className="mr-2 h-4 w-4" /> Occupied Units:</span>
                    <Badge className="bg-green-100 text-green-700 text-sm">{apartment.occupiedUnits}</Badge>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center"><Home className="mr-2 h-4 w-4 opacity-50"/> Vacant Units:</span> 
                    <Badge className="bg-amber-100 text-amber-700 text-sm">{apartment.vacantUnits}</Badge>
                </div>
                 <Separator className="my-3"/>
                 <div>
                    <h4 className="text-md font-semibold text-foreground mb-2">Amenities:</h4>
                    {apartment.amenities.length > 0 ? (
                        <div className="space-y-1.5">
                            {apartment.amenities.map(amenity => {
                                const Icon = amenityIcons[amenity] || Home;
                                return (
                                <div key={amenity} className="flex items-center text-sm text-muted-foreground">
                                   <Icon className="h-4 w-4 mr-2 text-primary/70"/> {amenity}
                                </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No amenities listed.</p>
                    )}
                </div>
            </CardContent>
        </Card>
        <Card className="md:col-span-2 shadow-md">
            <CardHeader>
                <CardTitle  className="text-xl">Description</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{apartment.description || "No description provided."}</p>
            </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Units in {apartment.name}</CardTitle>
          <CardDescription>Manage individual units within this apartment block.</CardDescription>
        </CardHeader>
        <CardContent>
            {apartment.units.length === 0 ? (
                 <div className="text-center py-8 text-muted-foreground">
                    <Home className="h-12 w-12 mx-auto mb-3 opacity-50"/>
                    <p className="text-lg font-medium">No units found.</p>
                    <p className="text-sm">Click "Add New Unit" to get started.</p>
                </div>
            ) : (
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Unit Name/No.</TableHead>
                    <TableHead>Rooms</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {apartment.units.map((unit) => (
                    <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.unitName}</TableCell>
                    <TableCell>{unit.numberOfRooms}</TableCell>
                    <TableCell>{unit.currentTenant ? <Link href={`/landlord/tenants/${unit.currentTenant.id}`} className="text-primary hover:underline">{unit.currentTenant.name}</Link> : <span className="text-muted-foreground italic">None</span>}</TableCell>
                    <TableCell>
                        <Badge variant={unit.status === 'Occupied' ? 'default' : 'secondary'}
                               className={unit.status === 'Occupied' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                        {unit.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" asChild title="View Unit Details">
                             <Link href={`/landlord/apartments/${apartmentId}/units/${unit.id}`}><Eye className="h-4 w-4" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditUnit(unit.id)} title="Edit Unit">
                            <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUnit(unit.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title="Delete Unit">
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
