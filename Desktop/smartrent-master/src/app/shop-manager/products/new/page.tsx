
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import ProductForm, { type ProductFormValues } from '@/components/shop-manager/ProductForm';
import { useState } from 'react';
// import { useRouter } from 'next/navigation'; // If needed for redirect after save

export default function AddNewProductPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // const router = useRouter(); // If needed for redirect

  function handleAddNewProduct(data: ProductFormValues) {
    setIsLoading(true);
    console.log('New Product Data:', data);
    // TODO: Implement API call to save product data
    // For now, simulate API call
    setTimeout(() => {
        toast({
        title: 'Product Added (Placeholder)',
        description: `${data.name} has been added to your product list. Check console for details.`,
        variant: 'default',
        });
        setIsLoading(false);
        // router.push('/shop-manager/products'); // Optionally redirect
    }, 1000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Add New Product/Service</h1>
        <Button variant="outline" asChild>
          <Link href="/shop-manager/products"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Product List</Link>
        </Button>
      </div>
      <ProductForm onSubmit={handleAddNewProduct} mode="add" isLoading={isLoading} />
    </div>
  );
}
