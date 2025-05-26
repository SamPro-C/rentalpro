import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ShoppingCart, Package, Truck, BarChart3, DollarSign, Plus,
  Edit, Trash2, Eye, Clock, CheckCircle, AlertCircle
} from "lucide-react";

export default function ShopDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample shop data - in real app this would come from API
  const shopStats = {
    totalProducts: 45,
    totalOrders: 128,
    pendingDeliveries: 12,
    completedToday: 8,
    todaySales: 15600,
    monthlyRevenue: 234500
  };

  const products = [
    { 
      id: 1, 
      name: "Drinking Water 20L", 
      category: "Water", 
      price: 150, 
      stock: 50, 
      status: "active",
      sales: 25 
    },
    { 
      id: 2, 
      name: "Cooking Gas 13kg", 
      category: "Gas", 
      price: 2800, 
      stock: 15, 
      status: "active",
      sales: 8 
    },
    { 
      id: 3, 
      name: "Rice 2kg Pack", 
      category: "Groceries", 
      price: 280, 
      stock: 0, 
      status: "out_of_stock",
      sales: 0 
    }
  ];

  const orders = [
    {
      id: "ORD001",
      customer: "John Doe",
      apartment: "Sunset View",
      room: "101",
      items: ["Drinking Water 20L x2", "Rice 2kg Pack x1"],
      total: 580,
      status: "pending",
      orderDate: "2025-01-26",
      deliveryAddress: "Sunset View Apartments, Unit A1, Room 101"
    },
    {
      id: "ORD002",
      customer: "Jane Smith",
      apartment: "Garden Estate",
      room: "205",
      items: ["Cooking Gas 13kg x1"],
      total: 2800,
      status: "confirmed",
      orderDate: "2025-01-25",
      deliveryAddress: "Garden Estate Complex, Unit B2, Room 205"
    },
    {
      id: "ORD003",
      customer: "Mike Johnson",
      apartment: "City Center",
      room: "301",
      items: ["Drinking Water 20L x3"],
      total: 450,
      status: "delivered",
      orderDate: "2025-01-25",
      deliveryAddress: "City Center Plaza, Unit C3, Room 301"
    }
  ];

  const categories = ["Water", "Gas", "Groceries", "Cleaning Supplies", "Personal Care"];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Shop Manager Dashboard</h1>
              <p className="text-slate-600">Manage inventory, orders & deliveries</p>
            </div>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2" size={16} />
            Add Product
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Products</p>
                  <p className="text-2xl font-bold text-slate-900">{shopStats.totalProducts}</p>
                </div>
                <Package className="text-purple-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-900">{shopStats.totalOrders}</p>
                </div>
                <ShoppingCart className="text-blue-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-slate-900">{shopStats.pendingDeliveries}</p>
                </div>
                <Clock className="text-orange-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completed Today</p>
                  <p className="text-2xl font-bold text-slate-900">{shopStats.completedToday}</p>
                </div>
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Today Sales</p>
                  <p className="text-lg font-bold text-slate-900">KSh {shopStats.todaySales.toLocaleString()}</p>
                </div>
                <DollarSign className="text-emerald-600" size={20} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Monthly Revenue</p>
                  <p className="text-lg font-bold text-slate-900">KSh {shopStats.monthlyRevenue.toLocaleString()}</p>
                </div>
                <BarChart3 className="text-indigo-600" size={20} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2" size={20} />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-slate-900">{order.id}</h4>
                        <p className="text-sm text-slate-600">{order.customer} - {order.room}</p>
                        <p className="text-xs text-slate-500">{order.orderDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">KSh {order.total.toLocaleString()}</p>
                        <Badge variant={
                          order.status === "delivered" ? "default" :
                          order.status === "confirmed" ? "secondary" : "destructive"
                        }>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Low Stock Alert */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="mr-2 text-orange-600" size={20} />
                    Low Stock Alert
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {products.filter(p => p.stock <= 15).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <h4 className="font-semibold text-slate-900">{product.name}</h4>
                        <p className="text-sm text-slate-600">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-orange-700">{product.stock} units</p>
                        <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                          {product.stock === 0 ? "Out of Stock" : "Low Stock"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Add New Product */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="mr-2" size={20} />
                    Add New Product
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Product Name" />
                  
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" placeholder="Price (KSh)" />
                    <Input type="number" placeholder="Stock Quantity" />
                  </div>

                  <Textarea placeholder="Product Description" className="min-h-[80px]" />
                  
                  <Input type="file" accept="image/*" />
                  
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Add Product
                  </Button>
                </CardContent>
              </Card>

              {/* Product List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2" size={20} />
                    Product Inventory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{product.name}</h4>
                          <p className="text-sm text-slate-600">{product.category}</p>
                          <p className="text-sm text-slate-500">Sales: {product.sales} units</p>
                        </div>
                        <div className="text-right mr-4">
                          <p className="font-semibold text-slate-900">KSh {product.price.toLocaleString()}</p>
                          <p className="text-sm text-slate-600">Stock: {product.stock}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit size={14} />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2" size={20} />
                  Order Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900">Order {order.id}</h4>
                          <p className="text-sm text-slate-600">{order.customer} - {order.apartment}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            order.status === "delivered" ? "default" :
                            order.status === "confirmed" ? "secondary" : "destructive"
                          }>
                            {order.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-slate-600 mb-1">Items:</p>
                        <ul className="text-sm text-slate-700">
                          {order.items.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                          <p>Order Date: {order.orderDate}</p>
                          <p>Delivery: {order.deliveryAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">KSh {order.total.toLocaleString()}</p>
                          {order.status === "pending" && (
                            <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                              Confirm Order
                            </Button>
                          )}
                          {order.status === "confirmed" && (
                            <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                              Mark Delivered
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2" size={20} />
                  Sales Reports & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Today's Sales</h4>
                    <p className="text-2xl font-bold text-purple-700">KSh {shopStats.todaySales.toLocaleString()}</p>
                    <p className="text-sm text-purple-600">8 orders completed</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Monthly Revenue</h4>
                    <p className="text-2xl font-bold text-blue-700">KSh {shopStats.monthlyRevenue.toLocaleString()}</p>
                    <p className="text-sm text-blue-600">128 total orders</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <h4 className="font-semibold text-emerald-900 mb-2">Best Selling</h4>
                    <p className="text-lg font-bold text-emerald-700">Drinking Water</p>
                    <p className="text-sm text-emerald-600">25 units sold</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-3">Top Products</h4>
                    <div className="space-y-2">
                      {products.sort((a, b) => b.sales - a.sales).map((product) => (
                        <div key={product.id} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">{product.name}</span>
                          <span className="font-semibold text-slate-900">{product.sales} sold</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-3">Delivery Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-700">On-time Deliveries</span>
                        <span className="font-semibold text-emerald-600">95%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Average Delivery Time</span>
                        <span className="font-semibold text-slate-900">2.5 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Customer Satisfaction</span>
                        <span className="font-semibold text-emerald-600">4.8/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}