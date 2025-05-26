import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, CreditCard, Wrench, ShoppingCart, User, Calendar,
  Phone, Mail, MapPin, Download, Upload, Camera, DollarSign
} from "lucide-react";

export default function TenantDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample tenant data - in real app this would come from API
  const tenantInfo = {
    name: "John Doe",
    apartment: "Sunset View Apartments",
    unit: "A1",
    room: "101",
    roomType: "1 Bedroom",
    tenantId: "T001",
    phone: "+254700123456",
    email: "john.doe@email.com",
    rentAmount: 2500,
    dueAmount: 2500,
    lastPayment: "2024-12-15",
    nextDueDate: "2025-02-01"
  };

  const paymentHistory = [
    { id: 1, date: "2024-12-15", amount: 2500, method: "M-Pesa", code: "QFX7Y8Z9", status: "confirmed" },
    { id: 2, date: "2024-11-15", amount: 2500, method: "M-Pesa", code: "ABC123XY", status: "confirmed" },
    { id: 3, date: "2024-10-15", amount: 2500, method: "M-Pesa", code: "DEF456UV", status: "confirmed" }
  ];

  const serviceRequests = [
    { id: 1, title: "Plumbing Issue", description: "Kitchen sink is leaking", status: "pending", date: "2025-01-25", worker: "Samuel Mwangi" },
    { id: 2, title: "Electrical Problem", description: "Power outlet not working", status: "completed", date: "2025-01-20", worker: "James Kiprotich" }
  ];

  const assignedWorkers = [
    { id: 1, name: "Samuel Mwangi", role: "Security Guard", duties: "Night Security", contact: "+254700111222", schedule: "6PM - 6AM" },
    { id: 2, name: "Grace Wanjiku", role: "Cleaner", duties: "Common Areas", contact: "+254700333444", schedule: "8AM - 5PM" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center">
              <Home className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Tenant Dashboard</h1>
              <p className="text-slate-600">Welcome back, {tenantInfo.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Tenant ID: {tenantInfo.tenantId}</p>
            <p className="text-sm text-slate-600">{tenantInfo.apartment}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Personal Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" size={20} />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">Full Name</p>
                <p className="font-semibold text-slate-900">{tenantInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Apartment</p>
                <p className="font-semibold text-slate-900">{tenantInfo.apartment}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Unit & Room</p>
                <p className="font-semibold text-slate-900">Unit {tenantInfo.unit}, Room {tenantInfo.room}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Room Type</p>
                <p className="font-semibold text-slate-900">{tenantInfo.roomType}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
            <TabsTrigger value="workers">Workers Info</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Rent Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2" size={20} />
                    Current Month Rent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-2">Amount Due</p>
                    <p className="text-3xl font-bold text-emerald-700">KSh {tenantInfo.dueAmount.toLocaleString()}</p>
                    <p className="text-sm text-slate-600 mt-2">Due Date: {tenantInfo.nextDueDate}</p>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                    <DollarSign className="mr-2" size={16} />
                    Pay Rent via M-Pesa
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-slate-600">Last Payment</p>
                    <p className="font-semibold text-slate-900">{tenantInfo.lastPayment}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingCart className="mr-2" size={16} />
                    Access Shopping Platform
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Wrench className="mr-2" size={16} />
                    Submit Service Request
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2" size={16} />
                    Download Rent Receipt
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2" size={16} />
                    View Payment History
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* M-Pesa Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2" size={20} />
                    M-Pesa Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <h4 className="font-semibold text-emerald-900 mb-2">Automatic Payment (STK Push)</h4>
                    <p className="text-sm text-emerald-700 mb-4">Enter your phone number to receive M-Pesa prompt</p>
                    
                    <div className="space-y-3">
                      <Input
                        type="tel"
                        placeholder="+254700000000"
                        className="bg-white"
                      />
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Send M-Pesa Prompt
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Manual Payment Entry</h4>
                    <p className="text-sm text-blue-700 mb-4">Already paid? Enter M-Pesa details</p>
                    
                    <div className="space-y-3">
                      <Input
                        placeholder="M-Pesa Transaction Code"
                        className="bg-white"
                      />
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          accept="image/*"
                          className="bg-white flex-1"
                        />
                        <Button size="sm" variant="outline">
                          <Camera size={16} />
                        </Button>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Submit Payment Proof
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment History */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-slate-900">KSh {payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-slate-600">{payment.date}</p>
                          <p className="text-xs text-slate-500">{payment.method} - {payment.code}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="default">Confirmed</Badge>
                          <Button size="sm" variant="ghost" className="mt-1">
                            <Download size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Service Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Submit New Request */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wrench className="mr-2" size={20} />
                    Submit Service Request
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Request Title (e.g., Plumbing Issue)"
                  />
                  
                  <Textarea
                    placeholder="Describe the issue in detail..."
                    className="min-h-[100px]"
                  />
                  
                  <div className="space-y-2">
                    <label className="text-sm text-slate-600">Attach Photo/Video (Optional)</label>
                    <Input
                      type="file"
                      accept="image/*,video/*"
                      className="bg-white"
                    />
                  </div>
                  
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    <Upload className="mr-2" size={16} />
                    Submit Request
                  </Button>
                </CardContent>
              </Card>

              {/* Request History */}
              <Card>
                <CardHeader>
                  <CardTitle>My Service Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceRequests.map((request) => (
                      <div key={request.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">{request.title}</h4>
                          <Badge variant={request.status === "completed" ? "default" : "destructive"}>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{request.description}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Submitted: {request.date}</span>
                          {request.worker && <span>Assigned: {request.worker}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2" size={20} />
                  Assigned Workers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {assignedWorkers.map((worker) => (
                    <div key={worker.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <User className="text-white" size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{worker.name}</h4>
                          <p className="text-sm text-slate-600">{worker.role}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Wrench className="mr-2 text-slate-400" size={14} />
                          <span className="text-slate-600">{worker.duties}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="mr-2 text-slate-400" size={14} />
                          <span className="text-slate-600">{worker.contact}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 text-slate-400" size={14} />
                          <span className="text-slate-600">{worker.schedule}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}