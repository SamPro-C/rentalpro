import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, Users, Building2, ShoppingCart, BarChart3, Settings,
  CheckCircle, XCircle, Eye, Search, Filter, Download, Bell
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample admin data - in real app this would come from API
  const systemStats = {
    totalUsers: 156,
    pendingApprovals: 8,
    totalApartments: 25,
    activeTenants: 89,
    totalOrders: 342,
    systemRevenue: 1250000
  };

  const pendingUsers = [
    { id: 1, name: "Sarah Wilson", email: "sarah@email.com", role: "landlord", phone: "+254700111111", requestDate: "2025-01-25" },
    { id: 2, name: "David Kimani", email: "david@email.com", role: "tenant", phone: "+254700222222", requestDate: "2025-01-25" },
    { id: 3, name: "Grace Mwangi", email: "grace@email.com", role: "shop_manager", phone: "+254700333333", requestDate: "2025-01-24" }
  ];

  const allUsers = [
    { id: 1, name: "John Landlord", email: "john.l@email.com", role: "landlord", status: "active", apartments: 3, lastLogin: "2025-01-26" },
    { id: 2, name: "Jane Tenant", email: "jane.t@email.com", role: "tenant", status: "active", apartment: "Sunset View", lastLogin: "2025-01-26" },
    { id: 3, name: "Mike Manager", email: "mike.m@email.com", role: "shop_manager", status: "active", orders: 45, lastLogin: "2025-01-25" }
  ];

  const systemLogs = [
    { id: 1, action: "User Registration", user: "Sarah Wilson", role: "landlord", timestamp: "2025-01-26 10:30", status: "pending" },
    { id: 2, action: "Payment Processed", user: "Jane Tenant", amount: "KSh 2,500", timestamp: "2025-01-26 09:15", status: "success" },
    { id: 3, action: "Service Request", user: "John Doe", apartment: "Sunset View", timestamp: "2025-01-26 08:45", status: "new" }
  ];

  const systemSettings = {
    platformName: "Rentizzi",
    adminEmail: "admin@rentizzi.com",
    autoApproval: false,
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: true
  };

  const handleApproveUser = (userId: number) => {
    console.log(`Approving user ${userId}`);
  };

  const handleRejectUser = (userId: number) => {
    console.log(`Rejecting user ${userId}`);
  };

  const handleImpersonate = (userId: number) => {
    console.log(`Impersonating user ${userId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600">System Administration & Oversight</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Bell className="mr-2" size={16} />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2" size={16} />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{systemStats.totalUsers}</p>
                </div>
                <Users className="text-blue-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-slate-900">{systemStats.pendingApprovals}</p>
                </div>
                <CheckCircle className="text-orange-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Apartments</p>
                  <p className="text-2xl font-bold text-slate-900">{systemStats.totalApartments}</p>
                </div>
                <Building2 className="text-emerald-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Tenants</p>
                  <p className="text-2xl font-bold text-slate-900">{systemStats.activeTenants}</p>
                </div>
                <Users className="text-green-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-900">{systemStats.totalOrders}</p>
                </div>
                <ShoppingCart className="text-purple-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">System Revenue</p>
                  <p className="text-lg font-bold text-slate-900">KSh {systemStats.systemRevenue.toLocaleString()}</p>
                </div>
                <BarChart3 className="text-indigo-600" size={20} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="monitoring">System Monitoring</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pending Approvals Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2" size={20} />
                    Pending User Approvals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingUsers.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <h4 className="font-semibold text-slate-900">{user.name}</h4>
                        <p className="text-sm text-slate-600">{user.email}</p>
                        <p className="text-xs text-slate-500">Role: {user.role}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle size={14} />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent System Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2" size={20} />
                    Recent System Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-slate-900">{log.action}</h4>
                        <p className="text-sm text-slate-600">{log.user}</p>
                        <p className="text-xs text-slate-500">{log.timestamp}</p>
                      </div>
                      <Badge variant={
                        log.status === "success" ? "default" :
                        log.status === "pending" ? "secondary" : "destructive"
                      }>
                        {log.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2" size={20} />
                    User Registration Approvals
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Approve All
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2" size={16} />
                      Export List
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div key={user.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{user.name}</h4>
                          <p className="text-sm text-slate-600">{user.email}</p>
                          <p className="text-sm text-slate-500">Phone: {user.phone}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline">Role: {user.role}</Badge>
                            <span className="text-xs text-slate-500">Requested: {user.requestDate}</span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleImpersonate(user.id)}
                          >
                            <Eye className="mr-2" size={14} />
                            Review
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveUser(user.id)}
                          >
                            <CheckCircle className="mr-2" size={14} />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectUser(user.id)}
                          >
                            <XCircle className="mr-2" size={14} />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="mr-2" size={20} />
                    User Management
                  </CardTitle>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                      <Input placeholder="Search users..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2" size={16} />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allUsers.map((user) => (
                    <div key={user.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{user.name}</h4>
                          <p className="text-sm text-slate-600">{user.email}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline">Role: {user.role}</Badge>
                            <Badge variant={user.status === "active" ? "default" : "secondary"}>
                              {user.status}
                            </Badge>
                            <span className="text-xs text-slate-500">Last login: {user.lastLogin}</span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleImpersonate(user.id)}
                          >
                            <Eye className="mr-2" size={14} />
                            Impersonate
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive">
                            Suspend
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2" size={20} />
                  System Monitoring & Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-900">{log.action}</h4>
                          <p className="text-sm text-slate-600">User: {log.user}</p>
                          {log.amount && <p className="text-sm text-slate-600">Amount: {log.amount}</p>}
                          {log.apartment && <p className="text-sm text-slate-600">Apartment: {log.apartment}</p>}
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            log.status === "success" ? "default" :
                            log.status === "pending" ? "secondary" : "destructive"
                          }>
                            {log.status}
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1">{log.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2" size={20} />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Platform Configuration</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-slate-600">Platform Name</label>
                        <Input value={systemSettings.platformName} />
                      </div>
                      <div>
                        <label className="text-sm text-slate-600">Admin Email</label>
                        <Input value={systemSettings.adminEmail} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">System Features</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Auto-approve new users</span>
                        <Button size="sm" variant={systemSettings.autoApproval ? "default" : "outline"}>
                          {systemSettings.autoApproval ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Maintenance Mode</span>
                        <Button size="sm" variant={systemSettings.maintenanceMode ? "destructive" : "outline"}>
                          {systemSettings.maintenanceMode ? "Active" : "Inactive"}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Email Notifications</span>
                        <Button size="sm" variant={systemSettings.emailNotifications ? "default" : "outline"}>
                          {systemSettings.emailNotifications ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">SMS Notifications</span>
                        <Button size="sm" variant={systemSettings.smsNotifications ? "default" : "outline"}>
                          {systemSettings.smsNotifications ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4 border-t border-slate-200">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Save Settings
                  </Button>
                  <Button variant="outline">
                    Reset to Default
                  </Button>
                  <Button variant="destructive">
                    Backup System Data
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