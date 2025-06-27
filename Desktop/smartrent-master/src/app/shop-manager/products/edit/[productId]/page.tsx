
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import ProductForm, { type ProductFormValues } from '@/components/shop-manager/ProductForm';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockShopProducts, type Product } from '@/lib/mock-data'; // Assuming Product type is exported

export default function EditProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (productId) {
      // Simulate fetching product data
      const foundProduct = mockShopProducts.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        toast({
          title: "Product Not Found",
          description: `Product with ID ${productId} could not be found.`,
          variant: "destructive"
        });
        router.push('/shop-manager/products');
      }
      setIsFetching(false);
    }
  }, [productId, router, toast]);

  function handleUpdateProduct(data: ProductFormValues) {
    setIsLoading(true);
    console.log('Updated Product Data:', { id: productId, ...data });
    // TODO: Implement API call to update product data
    // For now, simulate API call and update local mock data if needed for demo
    setTimeout(() => {
      // Optionally, update the mockShopProducts array if it's managed in a global state or context
      // For now, just show a toast.
      toast({
        title: 'Product Updated (Placeholder)',
        description: `${data.name} has been updated. Check console for details.`,
        variant: 'default',
      });
      setIsLoading(false);
      router.push('/shop-manager/products'); // Navigate back to product list after update
    }, 1000);
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    // This case should ideally be handled by the redirect in useEffect,
    // but as a fallback:
    return (
        <div className="text-center py-10">
            <p className="text-lg font-semibold text-destructive">Product not found.</p>
            <Button asChild variant="link" className="mt-4">
                <Link href="/shop-manager/products">Go back to product list</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Edit Product: {product.name}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/shop-manager/products"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Product List</Link>
        </Button>
      </div>
      <ProductForm 
        onSubmit={handleUpdateProduct} 
        initialData={product} 
        mode="edit" 
        isLoading={isLoading} 
      />
    </div>
  );
}
