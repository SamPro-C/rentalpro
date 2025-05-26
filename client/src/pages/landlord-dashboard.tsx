import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, Plus, Users, CreditCard, Wrench, BarChart3, 
  DollarSign, CheckCircle, XCircle, User, MapPin, Phone,
  Mail, Calendar, FileText, Download, Send
} from "lucide-react";

export default function LandlordDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data - in real app this would come from API
  const stats = {
    totalApartments: 5,
    totalUnits: 24,
    occupiedUnits: 18,
    vacantUnits: 6,
    totalTenants: 18,
    paidTenants: 15,
    unpaidTenants: 3,
    monthlyIncome: 45000,
    monthlyExpenses: 12000
  };

  const apartments = [
    { id: 1, name: "Sunset View Apartments", location: "Westlands", units: 8, occupied: 6, income: 18000 },
    { id: 2, name: "Garden Estate Complex", location: "Kasarani", units: 6, occupied: 5, income: 12000 },
    { id: 3, name: "City Center Plaza", location: "CBD", units: 10, occupied: 7, income: 15000 }
  ];

  const tenants = [
    { id: 1, name: "John Doe", apartment: "Sunset View", unit: "A1", room: "101", rent: 2500, status: "paid", phone: "+254700123456" },
    { id: 2, name: "Jane Smith", apartment: "Garden Estate", unit: "B2", room: "205", rent: 2000, status: "unpaid", phone: "+254700654321" },
    { id: 3, name: "Mike Johnson", apartment: "City Center", unit: "C3", room: "301", rent: 1800, status: "paid", phone: "+254700789012" }
  ];

  const workers = [
    { id: 1, name: "Samuel Mwangi", role: "Security", apartment: "Sunset View", duties: "Night Security", phone: "+254700111222" },
    { id: 2, name: "Grace Wanjiku", role: "Cleaner", apartment: "Garden Estate", duties: "Daily Cleaning", phone: "+254700333444" }
  ];

  const serviceRequests = [
    { id: 1, tenant: "John Doe", apartment: "Sunset View", room: "101", issue: "Plumbing leak", status: "pending", date: "2025-01-25" },
    { id: 2, tenant: "Jane Smith", apartment: "Garden Estate", room: "205", issue: "Electrical fault", status: "in_progress", date: "2025-01-24" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Building2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Landlord Dashboard</h1>
              <p className="text-slate-600">Welcome back, Property Manager</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2" size={16} />
            Add Property
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Apartments</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalApartments}</p>
                </div>
                <Building2 className="text-blue-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Units</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalUnits}</p>
                </div>
                <div className="text-emerald-600 text-sm font-semibold">
                  {stats.occupiedUnits}/{stats.totalUnits}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Tenants</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalTenants}</p>
                </div>
                <Users className="text-green-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Paid/Unpaid</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.paidTenants}/{stats.unpaidTenants}</p>
                </div>
                <CreditCard className="text-purple-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Monthly Income</p>
                  <p className="text-2xl font-bold text-slate-900">KSh {stats.monthlyIncome.toLocaleString()}</p>
                </div>
                <DollarSign className="text-emerald-600" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="apartments">Apartments</TabsTrigger>
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
            <TabsTrigger value="workers">Workers</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Apartments Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="mr-2" size={20} />
                    Properties Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {apartments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-slate-900">{apt.name}</h4>
                        <p className="text-sm text-slate-600 flex items-center">
                          <MapPin className="mr-1" size={14} />
                          {apt.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-600">KSh {apt.income.toLocaleString()}</p>
                        <p className="text-sm text-slate-600">{apt.occupied}/{apt.units} occupied</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Service Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wrench className="mr-2" size={20} />
                    Recent Service Requests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {serviceRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-slate-900">{request.issue}</h4>
                        <p className="text-sm text-slate-600">{request.tenant} - {request.room}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={request.status === "pending" ? "destructive" : "default"}>
                          {request.status}
                        </Badge>
                        <p className="text-xs text-slate-500 mt-1">{request.date}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tenants Tab */}
          <TabsContent value="tenants" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="mr-2" size={20} />
                    Tenant Management
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2" size={16} />
                      Add Tenant
                    </Button>
                    <Button variant="outline" size="sm">
                      <Send className="mr-2" size={16} />
                      Send Notifications
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tenants.map((tenant) => (
                    <div key={tenant.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <User className="text-white" size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{tenant.name}</h4>
                          <p className="text-sm text-slate-600">{tenant.apartment} - Unit {tenant.unit}, Room {tenant.room}</p>
                          <p className="text-sm text-slate-500 flex items-center">
                            <Phone className="mr-1" size={12} />
                            {tenant.phone}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">KSh {tenant.rent.toLocaleString()}</p>
                        <Badge variant={tenant.status === "paid" ? "default" : "destructive"}>
                          {tenant.status === "paid" ? "Paid" : "Unpaid"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="mr-2" size={20} />
                    Worker Management
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2" size={16} />
                    Add Worker
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workers.map((worker) => (
                    <div key={worker.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <User className="text-white" size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{worker.name}</h4>
                          <p className="text-sm text-slate-600">{worker.role} - {worker.apartment}</p>
                          <p className="text-sm text-slate-500">{worker.duties}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 flex items-center">
                          <Phone className="mr-1" size={12} />
                          {worker.phone}
                        </p>
                        <Badge variant="outline">Active</Badge>
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
                  Reports & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <h4 className="font-semibold text-emerald-900 mb-2">Monthly Income</h4>
                    <p className="text-2xl font-bold text-emerald-700">KSh {stats.monthlyIncome.toLocaleString()}</p>
                    <p className="text-sm text-emerald-600">+12% from last month</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Monthly Expenses</h4>
                    <p className="text-2xl font-bold text-red-700">KSh {stats.monthlyExpenses.toLocaleString()}</p>
                    <p className="text-sm text-red-600">+5% from last month</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Net Profit</h4>
                    <p className="text-2xl font-bold text-blue-700">KSh {(stats.monthlyIncome - stats.monthlyExpenses).toLocaleString()}</p>
                    <p className="text-sm text-blue-600">+15% from last month</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" className="flex items-center">
                    <Download className="mr-2" size={16} />
                    Download PDF Report
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <FileText className="mr-2" size={16} />
                    Export CSV Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}