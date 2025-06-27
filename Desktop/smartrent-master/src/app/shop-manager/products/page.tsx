
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, PlusCircle, Search, Filter, Edit3, Trash2, Download, EyeOff, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react'; // Added useEffect
import Image from 'next/image';
import { mockShopProducts, productCategoriesForShop, productStatusesForShop, type Product } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation'; // Added for reading query params

export default function ShopProductManagementPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams(); // For reading filter from URL
  const [products, setProducts] = useState<Product[]>(mockShopProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState(searchParams.get('filter') === 'lowstock' ? 'Low Stock' : 'all');

  // Effect to update filterStatus if query param changes
  useEffect(() => {
    const lowStockFilter = searchParams.get('filter');
    if (lowStockFilter === 'lowstock') {
      setFilterStatus('Low Stock');
    }
  }, [searchParams]);


  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteProduct = (productId: string) => {
      if(window.confirm(`Are you sure you want to delete product ${productId}? This action cannot be undone.`)){
          setProducts(prev => prev.filter(p => p.id !== productId));
          toast({ title: "Product Deleted", description: `Product ${productId} removed.`, variant: "destructive" });
      }
  };
  const handleToggleStatus = (productId: string, currentStatus: Product['status']) => {
    const newStatus = currentStatus === 'Active' || currentStatus === 'Low Stock' ? 'Inactive' : 'Active';
    setProducts(prev => prev.map(p => p.id === productId ? {...p, status: newStatus, stock: newStatus === 'Inactive' && p.stock > 0 ? p.stock : (newStatus === 'Active' && p.stock === 0 ? 10 : p.stock)} : p));
    toast({ title: "Product Status Updated", description: `Product ${productId} is now ${newStatus}.` });
  };
  const handleExport = () => {
    console.log("Exporting products:", filteredProducts);
    toast({ title: "Exporting Products", description: "Product data export initiated (placeholder)." });
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Product Management</h1>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/shop-manager/products/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product/Service
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Package className="mr-2 h-6 w-6 text-primary" />All Products & Services</CardTitle>
          <CardDescription>Manage your shop's inventory, pricing, and availability.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by Name, SKU..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="categoryFilterProducts" className="text-sm font-medium text-muted-foreground">Category</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger id="categoryFilterProducts"><SelectValue placeholder="All Categories" /></SelectTrigger>
                  <SelectContent>{['all', ...productCategoriesForShop].map(cat => <SelectItem key={cat} value={cat} className="capitalize">{cat === 'all' ? 'All Categories' : cat}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="statusFilterProducts" className="text-sm font-medium text-muted-foreground">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="statusFilterProducts"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>{['all', ...productStatusesForShop].map(stat => <SelectItem key={stat} value={stat} className="capitalize">{stat === 'all' ? 'All Statuses' : stat}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={handleExport} variant="outline"><Download className="mr-2 h-4 w-4" /> Export Results</Button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Package className="mx-auto h-16 w-16 mb-4" />
              <p className="text-lg font-semibold">No products match your criteria.</p>
              <p className="text-sm">Try adjusting filters or add a new product.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price (KES)</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.imageUrl ? 
                           <Image src={product.imageUrl} alt={product.name} width={40} height={40} className="rounded-sm object-cover" data-ai-hint="product thumbnail"/> 
                           : <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center text-xs text-muted-foreground">No img</div>}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price.toLocaleString()}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge variant={product.status === 'Active' ? 'default' : (product.status === 'Low Stock' ? 'secondary' : 'destructive')}
                               className={
                                   product.status === 'Active' ? 'bg-green-100 text-green-700' :
                                   product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                                   'bg-red-100 text-red-700' // Inactive
                               }>
                            {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" asChild title="Edit Product">
                          <Link href={`/shop-manager/products/edit/${product.id}`}><Edit3 className="h-4 w-4" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(product.id, product.status)} title={product.status === 'Active' || product.status === 'Low Stock' ? 'Mark Inactive' : 'Mark Active'}>
                           {(product.status === 'Active' || product.status === 'Low Stock') ? <EyeOff className="h-4 w-4 text-orange-500"/> : <Eye className="h-4 w-4 text-green-500"/>}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title="Delete Product">
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
