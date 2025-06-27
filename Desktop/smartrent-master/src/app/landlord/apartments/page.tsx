
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Building2, Eye, Edit3, Trash2, MapPin, Home, Users, Search, Wifi, ParkingSquare, ShieldCheckIcon, Power, Sun } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useState } from 'react';
import { mockApartmentList } from '@/lib/mock-data'; 
import { useToast } from '@/hooks/use-toast';


const amenityIcons: { [key: string]: React.ElementType } = {
  'Parking': ParkingSquare,
  'Gym': Users, // placeholder for gym icon
  'Pool': Users, // placeholder for pool icon
  '24/7 Security': ShieldCheckIcon,
  'Wi-Fi': Wifi,
  'Backup Generator': Power,
  'Borehole': Sun, // placeholder for borehole
  'Playground': Users // placeholder
};


export default function ApartmentsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const [displayedApartments, setDisplayedApartments] = useState(mockApartmentList);


  const filteredApartments = displayedApartments.filter(apt => 
    apt.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    apt.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditApartment = (apartmentId: string) => {
    console.log('Edit apartment:', apartmentId);
    toast({title: "Edit Apartment", description: `Navigation to edit page for ${apartmentId} would occur here.`});
    // Potentially navigate to an edit page: router.push(`/landlord/apartments/${apartmentId}/edit`);
  };

  const handleDeleteApartment = (apartmentId: string) => {
    if (window.confirm(`Are you sure you want to delete apartment ${apartmentId}? This action cannot be undone and will remove all associated units and tenants.`)) {
      console.log('Delete apartment:', apartmentId);
      setDisplayedApartments(prev => prev.filter(apt => apt.id !== apartmentId));
      toast({title: "Apartment Deleted", description: `Apartment ${apartmentId} has been removed.`, variant: "destructive"});
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Apartments Management</h1>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/landlord/apartments/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Apartment
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-6 w-6 text-primary" />
                Your Apartments
              </CardTitle>
              <CardDescription>
                View, search, and manage all your registered properties.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or location..."
                className="pl-8 w-full sm:w-[250px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredApartments.length === 0 ? (
            <div className="text-center py-10">
              <Building2 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">
                {searchTerm ? `No apartments found for "${searchTerm}".` : "No apartments registered yet."}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {searchTerm ? "Try a different search term or " : ""}
                Click the button above to add your first apartment.
              </p>
              {!searchTerm && (
                <Button asChild variant="outline">
                  <Link href="/landlord/apartments/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Apartment
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApartments.map((apartment) => (
                <Card key={apartment.id} className="flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
                  {apartment.imageUrl && (
                     <div className="relative w-full h-48">
                        <Image 
                            src={apartment.imageUrl} 
                            alt={`Image of ${apartment.name}`} 
                            layout="fill"
                            objectFit="cover"
                            data-ai-hint="apartment building exterior"
                        />
                     </div>
                  )}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-headline truncate" title={apartment.name}>
                      {apartment.name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm pt-1">
                      <MapPin className="mr-1.5 h-4 w-4 text-muted-foreground" />
                      <span className="truncate" title={apartment.location}>{apartment.location}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-muted-foreground">
                        <Home className="mr-2 h-4 w-4" /> Total Units:
                      </span>
                      <Badge variant="secondary">{apartment.totalUnits}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" /> Occupied:
                      </span>
                      <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200">
                        {apartment.occupiedUnits}
                      </Badge>
                    </div>
                     <div className="flex items-center justify-between">
                       <span className="flex items-center text-muted-foreground">
                         <Home className="mr-2 h-4 w-4 opacity-50"/> {/* Placeholder for alignment */} Vacant:
                      </span>
                      <Badge variant="default" className="bg-amber-100 text-amber-700 hover:bg-amber-200">
                        {apartment.vacantUnits}
                      </Badge>
                    </div>
                    {apartment.amenities && apartment.amenities.length > 0 && (
                        <div className="pt-2">
                            <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Key Amenities:</h4>
                            <div className="flex flex-wrap gap-2">
                                {apartment.amenities.slice(0, 4).map(amenity => { // Show max 4 amenities for brevity
                                    const Icon = amenityIcons[amenity] || Building2; // Default icon
                                    return (
                                    <Badge key={amenity} variant="outline" className="text-xs px-2 py-1 flex items-center gap-1">
                                        <Icon className="h-3 w-3" />
                                        {amenity}
                                    </Badge>
                                    );
                                })}
                                {apartment.amenities.length > 4 && <Badge variant="outline" className="text-xs px-2 py-1">...</Badge>}
                            </div>
                        </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2 border-t pt-4 mt-auto bg-muted/30">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/landlord/apartments/${apartment.id}`}>
                        <Eye className="mr-1 h-4 w-4" /> View Details
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditApartment(apartment.id)}>
                      <Edit3 className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteApartment(apartment.id)}>
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
