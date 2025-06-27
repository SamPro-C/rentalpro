
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Home, Users, Edit3, PlusCircle, ArrowLeft, DoorOpen, Trash2, UserCheck, UserX, DollarSign, Phone, Mail, Building } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useParams, useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import { mockApartmentList } from '@/lib/mock-data'; 
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface RoomDetail {
  id: string;
  roomNumber: string; 
  status: 'Vacant' | 'Occupied';
}
interface UnitDetail {
  id: string;
  unitName: string;
  apartmentName: string; 
  apartmentId: string;
  numberOfRooms: number;
  currentTenant?: { name: string; id: string; contact?: string; moveInDate?: string; rent?: string }; // Contact, moveInDate, rent are optional from Unit, detailed on TenantProfile
  paymentStatus?: 'Paid' | 'Unpaid' | 'Partial';
  rooms: RoomDetail[];
}


export default function UnitDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const apartmentId = params.apartmentId as string;
  const unitId = params.unitId as string;

  const apartmentData = mockApartmentList.find(apt => apt.id === apartmentId);
  const unitData = apartmentData?.units.find(u => u.id === unitId);
  
  const [unitDetail, setUnitDetail] = useState<UnitDetail | undefined>(
    unitData && apartmentData ? {
        ...unitData,
        apartmentName: apartmentData.name,
        apartmentId: apartmentData.id,
        // For simplicity, we'll use tenant's name and ID here. Full details on Tenant Profile page.
        // Payment status for the unit (mocked for demo)
        paymentStatus: unitData.currentTenant ? (Math.random() > 0.7 ? 'Unpaid' : (Math.random() > 0.4 ? 'Partial' : 'Paid')) : undefined,
    } : undefined
  );


  if (!unitDetail) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8 bg-background">
            <Home className="w-20 h-20 text-destructive mb-6" />
            <h2 className="text-3xl font-semibold text-foreground mb-3">Unit Not Found</h2>
            <p className="text-muted-foreground mb-8 text-lg">The unit with ID "{unitId}" in apartment "{apartmentId}" could not be found.</p>
            <Button asChild variant="outline" size="lg">
                <Link href={`/landlord/apartments/${apartmentId}`}>
                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Apartment Details
                </Link>
            </Button>
        </div>
    );
  }
  
  const handleEditUnit = () => {
    console.log("Edit unit details:", unitDetail.id);
    toast({title: "Edit Unit", description: `Editing unit ${unitDetail.unitName}. Form would appear.`});
    // router.push(`/landlord/apartments/${apartmentId}/units/${unitId}/edit`);
  };
  const handleAssignTenant = () => {
    console.log("Assign tenant to unit:", unitDetail.id); 
    toast({title: "Assign Tenant", description: `Navigating to tenant registration/selection for unit ${unitDetail.unitName}.`});
    router.push(`/landlord/tenants/new?apartmentId=${apartmentId}&unitId=${unitId}`);
  };
  const handleRemoveTenant = () => {
      if(window.confirm(`Are you sure you want to remove tenant ${unitDetail.currentTenant?.name} from this unit?`)){
        console.log("Remove tenant from unit:", unitDetail.id);
        setUnitDetail(prev => prev ? { ...prev, currentTenant: undefined, status: 'Vacant', paymentStatus: undefined, rooms: prev.rooms.map(r => ({...r, status: 'Vacant'})) } : undefined);
        // TODO: Update global mock data or state for apartment occupancy
        toast({title: "Tenant Removed", description: `${unitDetail.currentTenant?.name} removed from unit. Rooms marked as vacant.`});
      }
  }
  const handleAddRoom = () => {
      const newRoomName = prompt("Enter new room name/number (e.g., Bedroom 3, Storage):");
      if (newRoomName) {
          const newRoom: RoomDetail = {
              id: `r${Date.now()}`,
              roomNumber: newRoomName,
              status: 'Vacant' // New rooms are vacant by default
          };
          setUnitDetail(prev => prev ? {...prev, rooms: [...prev.rooms, newRoom], numberOfRooms: prev.numberOfRooms + 1} : undefined);
          toast({title: "Room Added", description: `Room "${newRoomName}" added to unit ${unitDetail.unitName}.`});
      }
  };
  const handleEditRoom = (roomId: string) => {
    const room = unitDetail.rooms.find(r => r.id === roomId);
    const newName = prompt(`Enter new name for room "${room?.roomNumber}":`, room?.roomNumber);
    if (newName && room) {
        setUnitDetail(prev => prev ? { ...prev, rooms: prev.rooms.map(r => r.id === roomId ? {...r, roomNumber: newName} : r) } : undefined);
        toast({title: "Room Updated", description: `Room name changed to "${newName}".`});
    }

  };
  const handleDeleteRoom = (roomId: string) => {
    if(window.confirm("Are you sure you want to delete this room? This might affect tenant assignment if the room is occupied.")) {
        console.log("Delete room:", roomId);
        setUnitDetail(prev => {
            if (!prev) return undefined;
            const updatedRooms = prev.rooms.filter(r => r.id !== roomId);
            return {...prev, rooms: updatedRooms, numberOfRooms: updatedRooms.length};
        });
        toast({title: "Room Deleted", variant: "destructive"});
    }
  }
  const handleRecordPayment = () => {
    console.log("Record payment for tenant:", unitDetail.currentTenant?.id);
    if (unitDetail.currentTenant?.id) {
        router.push(`/landlord/payments/manual?tenantId=${unitDetail.currentTenant.id}&apartmentId=${apartmentId}&unitId=${unitId}`);
    } else {
        toast({title: "Error", description: "No tenant assigned to record payment for.", variant: "destructive"});
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <Button variant="outline" size="sm" asChild className="mb-2 group-data-[sidebar-state=collapsed]:hidden">
                <Link href={`/landlord/apartments/${apartmentId}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to {unitDetail.apartmentName}
                </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
                <Home className="mr-3 h-8 w-8 text-primary" />
                Unit: {unitDetail.unitName}
            </h1>
             <p className="text-muted-foreground">Part of: <Link href={`/landlord/apartments/${apartmentId}`} className="text-primary hover:underline">{unitDetail.apartmentName}</Link></p>
        </div>
         <Button variant="outline" onClick={handleEditUnit}>
            <Edit3 className="mr-2 h-4 w-4" /> Edit Unit Details
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-xl">Unit Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p><strong className="text-muted-foreground">Number of Rooms:</strong> {unitDetail.numberOfRooms}</p>
                <p><strong className="text-muted-foreground">Status:</strong> 
                    <Badge variant={unitDetail.currentTenant ? 'default' : 'secondary'}
                           className={unitDetail.currentTenant ? 'bg-green-100 text-green-700 ml-2' : 'bg-amber-100 text-amber-700 ml-2'}>
                        {unitDetail.currentTenant ? 'Occupied' : 'Vacant'}
                    </Badge>
                </p>
                 <p><strong className="text-muted-foreground">Payment Status (This Month):</strong> 
                    <Badge 
                        variant={unitDetail.paymentStatus === 'Paid' ? 'default' : (unitDetail.paymentStatus === 'Unpaid' ? 'destructive' : 'secondary')}
                        className={`ml-2 ${unitDetail.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : unitDetail.paymentStatus === 'Unpaid' ? 'bg-red-100 text-red-700' : unitDetail.paymentStatus === 'Partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                        {unitDetail.paymentStatus || 'N/A'}
                    </Badge>
                </p>
            </CardContent>
        </Card>
        
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-xl">Tenant Information</CardTitle>
            </CardHeader>
            <CardContent>
                {unitDetail.currentTenant ? (
                    <div className="space-y-2">
                        <p className="flex items-center"><Users className="mr-2 h-4 w-4 text-muted-foreground" /><strong className="text-muted-foreground">Name:</strong>&nbsp; 
                            <Link href={`/landlord/tenants/${unitDetail.currentTenant.id}`} className="text-primary hover:underline">{unitDetail.currentTenant.name}</Link>
                        </p>
                        {/* Detailed contact and rent info is on Tenant Profile for privacy focus here */}
                        <p><strong className="text-muted-foreground">Tenant ID:</strong> {unitDetail.currentTenant.id}</p>
                    </div>
                ) : (
                    <p className="text-muted-foreground italic">This unit is currently vacant.</p>
                )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex flex-wrap gap-2">
                {unitDetail.currentTenant ? (
                    <>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/landlord/tenants/${unitDetail.currentTenant.id}`}><Users className="mr-2 h-4 w-4" />View Tenant Profile</Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleRecordPayment}>
                            <DollarSign className="mr-2 h-4 w-4" /> Record Payment
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleRemoveTenant}>
                            <UserX className="mr-2 h-4 w-4" /> Remove Tenant
                        </Button>
                    </>
                ) : (
                    <Button onClick={handleAssignTenant} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <UserCheck className="mr-2 h-4 w-4" /> Assign Tenant
                    </Button>
                )}
            </CardFooter>
        </Card>
      </div>
      

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-xl">Rooms in Unit {unitDetail.unitName}</CardTitle>
            <CardDescription>Manage individual rooms within this unit.</CardDescription>
          </div>
          <Button onClick={handleAddRoom} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Room
          </Button>
        </CardHeader>
        <CardContent>
            {unitDetail.rooms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <DoorOpen className="h-12 w-12 mx-auto mb-3 opacity-50"/>
                    <p className="text-lg font-medium">No rooms found for this unit.</p>
                    <p className="text-sm">Click "Add Room" to define rooms.</p>
                </div>
            ) : (
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Room Number/Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {unitDetail.rooms.map((room) => (
                    <TableRow key={room.id}>
                    <TableCell className="font-medium flex items-center"><DoorOpen className="mr-2 h-4 w-4 text-muted-foreground"/>{room.roomNumber}</TableCell>
                    <TableCell>
                        <Badge variant={room.status === 'Occupied' ? 'default' : 'secondary'}
                               className={room.status === 'Occupied' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                        {room.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditRoom(room.id)} title="Edit Room">
                            <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRoom(room.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title="Delete Room">
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
