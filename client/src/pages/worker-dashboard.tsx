import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wrench, Building2, Calendar, CheckCircle, Clock, QrCode,
  MapPin, User, Phone, Mail, FileText, Eye
} from "lucide-react";

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample worker data - in real app this would come from API
  const workerInfo = {
    name: "Samuel Mwangi",
    role: "Security Guard",
    workerId: "W001",
    phone: "+254700111222",
    email: "samuel.mwangi@email.com"
  };

  const todayStats = {
    assignedApartments: 2,
    todayShift: "6PM - 6AM",
    pendingTasks: 3,
    completedTasks: 5
  };

  const assignedApartments = [
    { 
      id: 1, 
      name: "Sunset View Apartments", 
      location: "Westlands", 
      units: 8, 
      duties: "Night Security, Gate Control",
      workingHours: "6PM - 6AM"
    },
    { 
      id: 2, 
      name: "Garden Estate Complex", 
      location: "Kasarani", 
      units: 6, 
      duties: "Perimeter Patrol, Visitor Log",
      workingHours: "6PM - 6AM"
    }
  ];

  const tasks = [
    {
      id: 1,
      title: "Security Round Check",
      description: "Complete security round of all buildings",
      apartment: "Sunset View Apartments",
      dueDate: "2025-01-26",
      status: "pending",
      priority: "high"
    },
    {
      id: 2,
      title: "Gate Maintenance",
      description: "Check and oil the main gate hinges",
      apartment: "Garden Estate Complex",
      dueDate: "2025-01-27",
      status: "pending",
      priority: "medium"
    },
    {
      id: 3,
      title: "Visitor Log Review",
      description: "Review and submit daily visitor logs",
      apartment: "Sunset View Apartments",
      dueDate: "2025-01-25",
      status: "completed",
      priority: "low"
    }
  ];

  const serviceRequests = [
    {
      id: 1,
      tenant: "John Doe",
      apartment: "Sunset View Apartments",
      room: "101",
      issue: "Gate access card not working",
      description: "Tenant reports gate access card is not being recognized",
      status: "seen",
      date: "2025-01-25"
    },
    {
      id: 2,
      tenant: "Jane Smith",
      apartment: "Garden Estate Complex",
      room: "205",
      issue: "Security light not working",
      description: "Corridor security light on 2nd floor is not functioning",
      status: "new",
      date: "2025-01-24"
    }
  ];

  const attendanceHistory = [
    { date: "2025-01-25", checkIn: "18:00", checkOut: "06:00", apartment: "Sunset View", status: "completed" },
    { date: "2025-01-24", checkIn: "18:00", checkOut: "06:00", apartment: "Garden Estate", status: "completed" },
    { date: "2025-01-23", checkIn: "18:00", checkOut: "06:00", apartment: "Sunset View", status: "completed" }
  ];

  const handleTaskComplete = (taskId: number) => {
    // In real app, this would call API to update task status
    console.log(`Marking task ${taskId} as completed`);
  };

  const handleMarkSeen = (requestId: number) => {
    // In real app, this would call API to mark request as seen
    console.log(`Marking service request ${requestId} as seen`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <Wrench className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Worker Dashboard</h1>
              <p className="text-slate-600">Welcome back, {workerInfo.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Worker ID: {workerInfo.workerId}</p>
            <p className="text-sm text-slate-600">{workerInfo.role}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Assigned Apartments</p>
                  <p className="text-2xl font-bold text-slate-900">{todayStats.assignedApartments}</p>
                </div>
                <Building2 className="text-blue-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Today's Shift</p>
                  <p className="text-lg font-bold text-slate-900">{todayStats.todayShift}</p>
                </div>
                <Clock className="text-emerald-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending Tasks</p>
                  <p className="text-2xl font-bold text-slate-900">{todayStats.pendingTasks}</p>
                </div>
                <FileText className="text-orange-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completed Today</p>
                  <p className="text-2xl font-bold text-slate-900">{todayStats.completedTasks}</p>
                </div>
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="apartments">Apartments</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Assigned Apartments Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="mr-2" size={20} />
                    Assigned Apartments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assignedApartments.map((apt) => (
                    <div key={apt.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">{apt.name}</h4>
                        <Badge variant="outline">{apt.units} units</Badge>
                      </div>
                      <p className="text-sm text-slate-600 flex items-center mb-1">
                        <MapPin className="mr-1" size={12} />
                        {apt.location}
                      </p>
                      <p className="text-sm text-slate-600 mb-1">{apt.duties}</p>
                      <p className="text-xs text-slate-500">{apt.workingHours}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* QR Code Check-in */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="mr-2" size={20} />
                    Attendance Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                    <QrCode className="mx-auto mb-4 text-orange-600" size={48} />
                    <h4 className="font-semibold text-slate-900 mb-2">QR Code Check-in</h4>
                    <p className="text-sm text-slate-600 mb-4">Scan QR code at your assigned location</p>
                    
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 mb-2">
                      Scan Check-in QR Code
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      Manual Check-in (GPS)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Apartments Tab */}
          <TabsContent value="apartments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2" size={20} />
                  My Assigned Apartments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignedApartments.map((apt) => (
                    <div key={apt.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-slate-900">{apt.name}</h4>
                        <Badge variant="outline">{apt.units} units</Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600 mb-1">Location</p>
                          <p className="font-semibold text-slate-900 flex items-center">
                            <MapPin className="mr-1" size={14} />
                            {apt.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 mb-1">Working Hours</p>
                          <p className="font-semibold text-slate-900 flex items-center">
                            <Clock className="mr-1" size={14} />
                            {apt.workingHours}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 mb-1">Duties</p>
                          <p className="font-semibold text-slate-900">{apt.duties}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2" size={20} />
                  Task Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900">{task.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}>
                            {task.priority}
                          </Badge>
                          <Badge variant={task.status === "completed" ? "default" : "outline"}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                          <p>Due: {task.dueDate}</p>
                          <p>Location: {task.apartment}</p>
                        </div>
                        
                        {task.status === "pending" && (
                          <Button 
                            size="sm" 
                            onClick={() => handleTaskComplete(task.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="mr-2" size={14} />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="mr-2" size={20} />
                  Service Requests (Read-Only)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceRequests.map((request) => (
                    <div key={request.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900">{request.issue}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={request.status === "new" ? "destructive" : "default"}>
                            {request.status}
                          </Badge>
                          {request.status === "new" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMarkSeen(request.id)}
                            >
                              <Eye className="mr-2" size={14} />
                              Mark Seen
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-2">{request.description}</p>
                      
                      <div className="text-sm text-slate-500">
                        <p>Tenant: {request.tenant} - Room {request.room}</p>
                        <p>Location: {request.apartment}</p>
                        <p>Date: {request.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Attendance History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendanceHistory.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-slate-900">{record.date}</p>
                        <p className="text-sm text-slate-600">{record.apartment}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">
                          {record.checkIn} - {record.checkOut}
                        </p>
                        <Badge variant="default">
                          {record.status}
                        </Badge>
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