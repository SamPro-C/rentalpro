
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PackagePlus, Save, Upload } from 'lucide-react';
import { productCategoriesForShop, productStatusesForShop, type Product } from '@/lib/mock-data';

const productFormSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  sku: z.string().min(1, 'SKU is required.').max(20, 'SKU cannot exceed 20 characters.'),
  category: z.string({ required_error: "Category is required." }),
  price: z.coerce.number().min(0, 'Price must be a non-negative number.'),
  stock: z.coerce.number().int().min(0, 'Stock must be a non-negative integer.'),
  status: z.enum(['Active', 'Inactive', 'Low Stock'] as [string, ...string[]], { required_error: "Status is required." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }).optional().or(z.literal('')),
  description: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => void;
  initialData?: Partial<Product>; // Use Partial<Product> for initialData to match schema more closely
  mode: 'add' | 'edit';
  isLoading?: boolean;
}

export default function ProductForm({ onSubmit, initialData, mode, isLoading }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData ? {
        name: initialData.name || '',
        sku: initialData.sku || '',
        category: initialData.category || undefined,
        price: initialData.price || 0,
        stock: initialData.stock || 0,
        status: initialData.status || 'Active',
        imageUrl: initialData.imageUrl || '',
        description: initialData.description || '',
    } : {
      name: '',
      sku: '',
      category: undefined,
      price: 0,
      stock: 0,
      status: 'Active',
      imageUrl: '',
      description: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PackagePlus className="mr-2 h-6 w-6 text-primary" />
              {mode === 'add' ? 'New Product/Service Details' : 'Edit Product/Service Details'}
            </CardTitle>
            <CardDescription>
              {mode === 'add' ? 'Fill in the information for your new product or service.' : 'Update the details for this product or service.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product/Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Fresh Milk 1L, Plumbing Service" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., FM001, SVC-PLUMB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productCategoriesForShop.map(cat => (
                          <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (KES)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="120" {...field} min="0" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50" {...field} min="0" />
                    </FormControl>
                    <FormDescription>For services, can be 0 or a high number.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productStatusesForShop.map(stat => (
                          <SelectItem key={stat} value={stat} className="capitalize">{stat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed description of the product/service..." {...field} rows={4}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Upload className="mr-2 h-4 w-4"/>Product Image URL (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormDescription>Provide a direct link to the product image.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
            <Save className="mr-2 h-5 w-5" />
            {isLoading ? 'Saving...' : (mode === 'add' ? 'Save Product' : 'Update Product')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
