
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Building, Save, MapPin, Columns, Sparkles, PlusCircle, Trash2, Home, DoorOpen, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

// Room schema is not directly used in this form for room creation, 
// but good to keep if detailed room setup happens elsewhere or later.
// const roomSchema = z.object({
//   roomNumber: z.string().min(1, 'Room number is required.'),
// });

const unitSchema = z.object({
  id: z.string().optional(), // For useFieldArray key
  unitName: z.string().min(1, 'Unit name/number is required. E.g., A-101, Unit 1.'),
  numberOfRooms: z.coerce.number().int().min(1, 'Number of rooms must be at least 1.'),
  // rooms: z.array(roomSchema).optional(), // Rooms will be generically named based on numberOfRooms
});

const apartmentFormSchema = z.object({
  apartmentName: z.string().min(3, 'Apartment name must be at least 3 characters.'),
  location: z.string().min(5, 'Location must be at least 5 characters.'),
  description: z.string().optional(),
  amenities: z.object({
    parking: z.boolean().default(false).optional(),
    gym: z.boolean().default(false).optional(),
    pool: z.boolean().default(false).optional(),
    wifi: z.boolean().default(false).optional(),
    security: z.boolean().default(false).optional(),
    playground: z.boolean().default(false).optional(),
    backup_generator: z.boolean().default(false).optional(),
    borehole: z.boolean().default(false).optional(),
  }).optional(),
  units: z.array(unitSchema).min(1, "At least one unit is required."),
});

type ApartmentFormValues = z.infer<typeof apartmentFormSchema>;

const amenityOptions = [
  { id: 'parking', label: 'Parking Space' },
  { id: 'gym', label: 'Gym/Fitness Center' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'wifi', label: 'Wi-Fi Available' },
  { id: 'security', label: '24/7 Security' },
  { id: 'playground', label: 'Playground' },
  { id: 'backup_generator', label: 'Backup Generator' },
  { id: 'borehole', label: 'Borehole' },
] as const;


export default function AddNewApartmentPage() {
  const { toast } = useToast();

  const form = useForm<ApartmentFormValues>({
    resolver: zodResolver(apartmentFormSchema),
    defaultValues: {
      apartmentName: '',
      location: '',
      description: '',
      amenities: {
        parking: false, gym: false, pool: false, wifi: false, security: false,
        playground: false, backup_generator: false, borehole: false,
      },
      units: [{ unitName: '', numberOfRooms: 1 }],
    },
  });

  const { fields: unitFields, append: appendUnit, remove: removeUnit } = useFieldArray({
    control: form.control,
    name: 'units',
  });

  function onSubmit(data: ApartmentFormValues) {
    console.log('New Apartment Data:', data);
    // TODO: Implement API call to save apartment data
    // The data structure now includes a 'units' array with unitName and numberOfRooms.
    // Backend would then create generic rooms based on 'numberOfRooms' for each unit.
    toast({
      title: 'Apartment Submitted (Placeholder)',
      description: `${data.apartmentName} with ${data.units.length} unit(s) details are in console.`,
      variant: 'default',
    });
    // form.reset(); // Optionally reset form
  }

  return (
    <div className="flex flex-col gap-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Add New Apartment</h1>
         <Button variant="outline" asChild>
          <Link href="/landlord/apartments"><ArrowLeft className="mr-2 h-4 w-4" />Back to Apartments</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-6 w-6 text-primary" />
                Apartment Details
              </CardTitle>
              <CardDescription>
                Fill in the information for your new property.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="apartmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4" />Apartment Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Greenwood Heights" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4" />Location / Address</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., 123 Main St, Kilimani, Nairobi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a brief description of the apartment complex, unique features, etc."
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="text-base font-semibold flex items-center"><Sparkles className="mr-2 h-4 w-4" />Amenities (Optional)</FormLabel>
                <FormDescription>Select the amenities available at this property.</FormDescription>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                  {amenityOptions.map((amenity) => (
                    <FormField
                      key={amenity.id}
                      control={form.control}
                      name={`amenities.${amenity.id}`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm hover:shadow-md transition-shadow h-full">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-normal">
                              {amenity.label}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                 <FormMessage>{form.formState.errors.amenities?.message}</FormMessage>
              </FormItem>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Columns className="mr-2 h-6 w-6 text-primary" />
                    Units Configuration
                </CardTitle>
                <CardDescription>
                    Define the units and their room counts within this apartment block.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {unitFields.map((unitField, unitIndex) => (
                        <Card key={unitField.id} className="p-4 border shadow-sm bg-muted/20">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-semibold text-lg text-foreground">Unit {unitIndex + 1}</h4>
                                {unitFields.length > 1 && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeUnit(unitIndex)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                                    <Trash2 className="h-4 w-4 mr-1" /> Remove Unit
                                </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`units.${unitIndex}.unitName`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center"><Home className="mr-1 h-4 w-4" />Unit Name/Number</FormLabel>
                                        <FormControl><Input placeholder={`E.g., A-${101 + unitIndex}, Unit ${unitIndex + 1}`} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`units.${unitIndex}.numberOfRooms`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center"><DoorOpen className="mr-1 h-4 w-4" />Number of Rooms in Unit</FormLabel>
                                        <FormControl><Input type="number" placeholder="E.g., 3" {...field} min="1" /></FormControl>
                                        <FormDescription className="text-xs">Rooms will be generically named (e.g., Room 1, Room 2). Specific naming can be done later.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                        </Card>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendUnit({ unitName: '', numberOfRooms: 1 })} className="mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Another Unit
                    </Button>
                </div>
                 <FormMessage>{form.formState.errors.units?.root?.message || form.formState.errors.units?.message}</FormMessage>
            </CardContent>
          </Card>
          
          <CardFooter className="flex justify-end pt-6 border-t">
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Save className="mr-2 h-5 w-5" /> Save Apartment & Units
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
