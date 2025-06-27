
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, ExternalLink, Search, ShoppingCart, Tag, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const categories = [
  { name: 'Groceries', icon: <ShoppingCart className="h-5 w-5" />, image: 'https://placehold.co/200x150.png', dataAiHint: 'fresh groceries' },
  { name: 'Cleaning Supplies', icon: <Zap className="h-5 w-5" />, image: 'https://placehold.co/200x150.png', dataAiHint: 'cleaning products' },
  { name: 'Home Essentials', icon: <Tag className="h-5 w-5" />, image: 'https://placehold.co/200x150.png', dataAiHint: 'home goods' },
  { name: 'Local Services', icon: <ShoppingCart className="h-5 w-5" />, image: 'https://placehold.co/200x150.png', dataAiHint: 'local services' },
];

const featuredProducts = [
  { id: 'prod1', name: 'Fresh Milk 1L', price: 'KES 120', image: 'https://placehold.co/300x200.png', dataAiHint: 'milk carton' },
  { id: 'prod2', name: 'All-Purpose Cleaner', price: 'KES 350', image: 'https://placehold.co/300x200.png', dataAiHint: 'cleaner spray' },
  { id: 'prod3', name: 'Laundry Detergent 2kg', price: 'KES 500', image: 'https://placehold.co/300x200.png', dataAiHint: 'detergent powder' },
  { id: 'prod4', name: 'Water Delivery (20L)', price: 'KES 250', image: 'https://placehold.co/300x200.png', dataAiHint: 'water bottle' },
];

export default function TenantShoppingPage() {
  const { toast } = useToast();

  const handleProceedToShop = () => {
    toast({
      title: "Coming Soon!",
      description: "Our full e-commerce platform with a wider selection and order tracking is under development.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-primary/10 rounded-lg shadow">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
            <ShoppingCart className="mr-3 h-8 w-8" /> SmartRent Shopping
          </h1>
          <p className="text-muted-foreground mt-1">
            Conveniently shop for goods and services from trusted local vendors.
          </p>
        </div>
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products and services..."
            className="pl-8 w-full"
          />
        </div>
      </div>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => (
            <Card key={category.name} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-32 w-full">
                 <Image src={category.image} alt={category.name} layout="fill" objectFit="cover" data-ai-hint={category.dataAiHint} />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-md flex items-center gap-2">{category.icon} {category.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Products & Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
                    <div className="relative h-48 w-full">
                        <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" data-ai-hint={product.dataAiHint}/>
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                        <p className="text-primary font-bold text-md">{product.price}</p>
                        <Button variant="outline" size="sm" className="w-full mt-3">
                            View Details <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>

      <Card className="shadow-lg mt-10 bg-accent/10">
        <CardHeader>
          <CardTitle className="text-accent flex items-center">
            <ExternalLink className="mr-2 h-5 w-5" /> Full E-commerce Platform
          </CardTitle>
          <CardDescription>
            Our complete shopping experience is coming soon!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Browse a wider selection, manage your cart, track orders, and enjoy exclusive deals on our dedicated platform.
          </p>
          <Button size="lg" onClick={handleProceedToShop} className="bg-accent hover:bg-accent/80 text-accent-foreground">
            Proceed to Full Shop
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
