import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Building2,
  Shield,
  CreditCard,
  Wrench,
  ShoppingCart,
  Users,
  Smartphone,
  BarChart3,
  Bell,
  Settings,
  Download,
  Play,
  ArrowDown,
  Check,
  Star,
  Phone,
  Mail,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Rocket,
  X,
} from "lucide-react";

interface DemoRequest {
  name: string;
  email: string;
  phone: string;
  userType: string;
  message: string;
}

export default function Landing() {
  const [demoForm, setDemoForm] = useState<DemoRequest>({
    name: "",
    email: "",
    phone: "",
    userType: "",
    message: "",
  });

  const { toast } = useToast();

  const demoMutation = useMutation({
    mutationFn: async (data: DemoRequest) => {
      return apiRequest("POST", "/api/demo-request", data);
    },
    onSuccess: () => {
      toast({
        title: "Demo Request Sent!",
        description: "We'll contact you within 24 hours to schedule your demo.",
      });
      setDemoForm({
        name: "",
        email: "",
        phone: "",
        userType: "",
        message: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit demo request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoForm.name || !demoForm.email || !demoForm.phone || !demoForm.userType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    demoMutation.mutate(demoForm);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Building2 className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Rentizzi
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#roles" className="text-slate-600 hover:text-blue-600 transition-colors">For Teams</a>
              <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors">Contact</a>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <a href="#demo">Get Demo</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 pt-20">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-600/10 rounded-full animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-600/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="secondary" className="mb-8 bg-white/80 border border-slate-200">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse mr-2" />
                New: Progressive Web App with M-Pesa Integration
              </Badge>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-black mb-6 leading-tight"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Rentizzi
              </span>
              <br />
              Smart Rental Management
              <br />
              <span className="text-slate-700">Progressive Web App</span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Complete rental ecosystem with M-Pesa integration, role-based dashboards, real-time notifications, and integrated shopping delivery. Manage apartments, tenants, workers, and finances from one powerful platform.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
              variants={fadeInUp}
            >
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                <a href="#demo">
                  <Play className="mr-2" size={20} />
                  Start Free Demo
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-lg px-8 py-6">
                <a href="#features">
                  <ArrowDown className="mr-2" size={20} />
                  Explore Features
                </a>
              </Button>
            </motion.div>

            <motion.div 
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
              variants={staggerChildren}
            >
              {[
                { number: "500+", label: "Properties Managed" },
                { number: "10K+", label: "Happy Tenants" },
                { number: "98%", label: "On-time Payments" },
                { number: "24/7", label: "Support Available" },
              ].map((stat, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <div className="text-3xl font-black text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-slate-600 font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-blue-600/10 text-blue-600 hover:bg-blue-600/20">
              COMPREHENSIVE FEATURES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">
              Everything You Need in <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">One Platform</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From rent collection to maintenance management, our 11 core modules cover every aspect of modern property management.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {[
              {
                icon: Shield,
                title: "Role-Based Authentication",
                description: "Secure login with admin approval system. Five distinct user roles: Admin, Landlord, Tenant, Shop Manager, and Worker with tailored permissions.",
                gradient: "from-blue-600 to-blue-700"
              },
              {
                icon: Building2,
                title: "Apartment Management",
                description: "Complete property setup: apartments, units, rooms with occupancy tracking. Landlords can register tenants and assign workers to specific properties.",
                gradient: "from-emerald-600 to-green-600"
              },
              {
                icon: CreditCard,
                title: "M-Pesa Integration",
                description: "Automatic M-Pesa STK Push payments with manual entry fallback. Auto-generated receipts, payment history, and real-time landlord notifications.",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                icon: Wrench,
                title: "Service Request System",
                description: "Tenants submit requests with media attachments. Real-time status updates, worker assignment, and automatic email/SMS notifications to landlords.",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: ShoppingCart,
                title: "Integrated Shopping Platform",
                description: "In-app marketplace for groceries, water, gas delivery. Shop managers handle inventory and orders while landlords track earnings.",
                gradient: "from-pink-500 to-rose-500"
              },
              {
                icon: Users,
                title: "Worker Management System",
                description: "Attendance tracking with QR codes, task assignment to apartments, schedule management, and performance monitoring with completion timestamps.",
                gradient: "from-cyan-500 to-blue-500"
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics & Reports",
                description: "Dynamic charts and filters by date/apartment. Income vs expense tracking, tenant payment status, and downloadable PDF/CSV reports.",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: Bell,
                title: "Smart Notification System",
                description: "Targeted messaging to all tenants, paid/unpaid tenants, or specific apartments. Multi-channel delivery via in-app, email, and SMS.",
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                icon: Settings,
                title: "Expense Tracking",
                description: "Manual expense entry with categorization by apartment and date. Comprehensive expense reports with filtering and integration into analytics.",
                gradient: "from-red-500 to-pink-500"
              },
              {
                icon: Smartphone,
                title: "Real-Time Updates",
                description: "Live notifications across all roles for payments, task updates, and service requests. Automatic status synchronization and instant alerts.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Download,
                title: "Progressive Web App",
                description: "Install on any device with offline support, push notifications, and native app experience. Fully responsive design for mobile and desktop.",
                gradient: "from-teal-500 to-cyan-500"
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="group hover:shadow-xl hover:border-blue-600/30 transition-all duration-300 transform hover:-translate-y-2 h-full">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl p-12 text-white text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Property Management?</h3>
            <p className="text-xl mb-8 opacity-90">Join hundreds of landlords who've streamlined their operations with Rentizzi</p>
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-slate-100">
              <a href="#demo">Start Your Free Trial</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* User Roles Section */}
      <section id="roles" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20">
              FOR EVERY ROLE
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">
              Built for <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Your Team</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Role-based access ensures everyone gets exactly what they need, from tenants to administrators.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-5 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {[
              {
                icon: "👑",
                title: "Admin",
                permissions: ["Full system access", "Manage all users", "Approve registrations", "View all data"],
                gradient: "from-red-500 to-pink-500",
                description: "Complete platform oversight with user management and system monitoring capabilities."
              },
              {
                icon: "🏠",
                title: "Landlord",
                permissions: ["Add apartments & units", "Register tenants & workers", "Manual rent entry", "Generate reports"],
                gradient: "from-blue-600 to-blue-700",
                description: "Full property management with tenant oversight, payment tracking, and expense monitoring."
              },
              {
                icon: "👤",
                title: "Tenant",
                permissions: ["View personal info", "Pay rent via M-Pesa", "Submit service requests", "Access shopping"],
                gradient: "from-green-500 to-emerald-600",
                description: "Clean view-only interface with payment capabilities and service request functionality."
              },
              {
                icon: "🏪",
                title: "Shop Manager",
                permissions: ["Manage inventory", "Process orders", "Handle deliveries", "Track sales"],
                gradient: "from-purple-500 to-violet-600",
                description: "Dedicated shopping module management with order processing and delivery coordination."
              },
              {
                icon: "🔧",
                title: "Worker",
                permissions: ["View assigned tasks", "Update task status", "Check attendance", "Access schedules"],
                gradient: "from-orange-500 to-red-500",
                description: "Task-focused dashboard with attendance tracking and apartment-specific assignments."
              },
            ].map((role, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="hover:shadow-xl transition-all duration-300 text-center h-full">
                  <CardContent className="p-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${role.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl`}>
                      {role.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-900">{role.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{role.description}</p>
                    <ul className="text-sm text-slate-600 space-y-2 text-left">
                      {role.permissions.map((permission, idx) => (
                        <li key={idx} className="flex items-center">
                          <Check className="text-emerald-600 mr-2 flex-shrink-0" size={16} />
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-blue-600/10 text-blue-600 hover:bg-blue-600/20">
              SIMPLE PRICING
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">
              Choose Your <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Perfect Plan</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transparent pricing with no hidden fees. Start free and scale as you grow your property portfolio.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {[
              {
                name: "Starter",
                price: "Free",
                subtitle: "Up to 5 units",
                features: [
                  { text: "Basic rent collection", included: true },
                  { text: "Tenant management", included: true },
                  { text: "M-Pesa integration", included: true },
                  { text: "Basic reports", included: true },
                  { text: "Advanced analytics", included: false },
                ],
                buttonText: "Get Started Free",
                popular: false
              },
              {
                name: "Professional",
                price: "KSh 999",
                priceSubtext: "/month",
                subtitle: "Up to 50 units",
                features: [
                  { text: "Everything in Starter", included: true },
                  { text: "Advanced analytics", included: true },
                  { text: "Shop management", included: true },
                  { text: "Worker management", included: true },
                  { text: "Priority support", included: true },
                ],
                buttonText: "Start Professional Trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                subtitle: "Unlimited units",
                features: [
                  { text: "Everything in Professional", included: true },
                  { text: "Custom integrations", included: true },
                  { text: "Dedicated support", included: true },
                  { text: "White labeling", included: true },
                  { text: "SLA guarantee", included: true },
                ],
                buttonText: "Contact Sales",
                popular: false
              },
            ].map((plan, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className={`relative hover:shadow-xl transition-all duration-300 ${plan.popular ? 'border-blue-600 scale-105' : 'border-slate-200'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-2 text-slate-900">{plan.name}</h3>
                      <div className="text-4xl font-black mb-2 text-slate-900">
                        {plan.price}
                        {plan.priceSubtext && <span className="text-lg font-normal text-slate-600">{plan.priceSubtext}</span>}
                      </div>
                      <div className="text-slate-600">{plan.subtitle}</div>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          {feature.included ? (
                            <Check className="text-emerald-600 mr-3 flex-shrink-0" size={16} />
                          ) : (
                            <X className="text-slate-400 mr-3 flex-shrink-0" size={16} />
                          )}
                          <span className={feature.included ? "text-slate-700" : "text-slate-400"}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      size="lg" 
                      className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <p className="text-slate-600 mb-4">All plans include free updates and basic support</p>
            <div className="flex justify-center items-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center">
                <Shield className="mr-2" size={16} />
                30-day money-back guarantee
              </div>
              <div className="flex items-center">
                <CreditCard className="mr-2" size={16} />
                No setup fees
              </div>
              <div className="flex items-center">
                <Download className="mr-2" size={16} />
                Cancel anytime
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo CTA Section */}
      <section id="demo" className="py-20 bg-gradient-to-br from-blue-600 to-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-48 h-48 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white rounded-full" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Ready to Transform Your<br />Property Management?
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto">
              Join hundreds of landlords who've streamlined their operations and increased their revenue with Rentizzi's comprehensive platform.
            </p>

            <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border-white/30 mb-8">
              <CardContent className="p-8">
                <form onSubmit={handleDemoSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      placeholder="Your Name"
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      className="bg-white/20 border-white/30 text-white placeholder-white/70 focus:ring-white/50"
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      className="bg-white/20 border-white/30 text-white placeholder-white/70 focus:ring-white/50"
                      required
                    />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                      className="bg-white/20 border-white/30 text-white placeholder-white/70 focus:ring-white/50"
                      required
                    />
                    <Select value={demoForm.userType} onValueChange={(value) => setDemoForm({ ...demoForm, userType: value })}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white focus:ring-white/50">
                        <SelectValue placeholder="Select User Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="landlord">Landlord</SelectItem>
                        <SelectItem value="tenant">Tenant</SelectItem>
                        <SelectItem value="property-manager">Property Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    placeholder="Tell us about your property management needs..."
                    rows={3}
                    value={demoForm.message}
                    onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                    className="bg-white/20 border-white/30 text-white placeholder-white/70 focus:ring-white/50 resize-none"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-white text-blue-600 hover:bg-slate-100 text-lg"
                    disabled={demoMutation.isPending}
                  >
                    <Rocket className="mr-2" size={20} />
                    {demoMutation.isPending ? "Sending..." : "Request Free Demo"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { icon: Phone, title: "Call Us", info: "+254 700 123 456" },
                { icon: Mail, title: "Email Support", info: "support@rentizzi.com" },
                { icon: MessageCircle, title: "WhatsApp", info: "+254 700 123 456" },
              ].map((contact, index) => (
                <div key={index}>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <contact.icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{contact.title}</h3>
                  <p className="opacity-80">{contact.info}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Building2 className="text-white" size={24} />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Rentizzi
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
                The most comprehensive property management platform designed for modern landlords, tenants, and property managers across Kenya and beyond.
              </p>
              <div className="flex space-x-4">
                {[Twitter, Facebook, Linkedin, Instagram].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {["Features", "Pricing", "Contact", "Documentation", "API"].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-slate-300 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                {["Help Center", "Privacy Policy", "Terms of Service", "Security", "Status"].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-slate-300 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-center md:text-left">
              © 2025 Rentizzi. All rights reserved. Built with ❤️ for property managers.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-slate-400 text-sm">Made in Kenya</span>
              <div className="w-6 h-4 bg-gradient-to-r from-black via-red-600 to-green-600 rounded-sm" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
