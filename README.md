# Rentizzi - Smart Rental Management Platform

A comprehensive Progressive Web App for property management with role-based dashboards, M-Pesa integration, and real-time features.

## 🚀 Features

### Complete Role-Based System
- **Admin Dashboard** - User approval, system monitoring, platform settings
- **Landlord Dashboard** - Property management, tenant oversight, financial reports
- **Tenant Dashboard** - Rent payments, service requests, shopping access
- **Shop Manager Dashboard** - Inventory management, order processing, delivery tracking
- **Worker Dashboard** - Task management, QR attendance, schedule viewing

### Core Modules
1. **Authentication & User Management** - Role-based registration with admin approval
2. **Apartment Management** - Complete property setup with units and rooms
3. **M-Pesa Payment Integration** - STK Push and manual payment processing
4. **Service Request System** - Media attachments and real-time status updates
5. **Shopping Platform** - Integrated e-commerce with delivery coordination
6. **Worker Management** - QR code attendance and task assignment
7. **Advanced Analytics** - Dynamic reports with filtering and export
8. **Smart Notifications** - Multi-channel messaging system
9. **Expense Tracking** - Categorized expense management
10. **Real-Time Updates** - Live notifications across all roles
11. **Progressive Web App** - Offline support and native app experience

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js, PostgreSQL
- **Database:** Drizzle ORM with comprehensive schema
- **UI Components:** Radix UI with custom styling
- **Authentication:** Role-based access control
- **Payment:** M-Pesa integration ready

## 📱 Responsive Design

- Modern gradient themes for each role
- Mobile-first responsive design
- Interactive animations and transitions
- Professional card layouts and dashboards

## 🔧 Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
DATABASE_URL=your_postgresql_url
```

3. Push database schema:
```bash
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

## 🎯 Role-Based Access

Each user role has tailored functionality:

- **Admins** control the entire platform and approve new users
- **Landlords** manage properties and oversee all rental operations
- **Tenants** access payments, requests, and shopping with view-only permissions
- **Shop Managers** handle inventory and delivery coordination
- **Workers** track attendance and manage assigned tasks

## 🔐 Security

- Admin approval required for all new registrations
- Role-based permissions and data access
- Secure password handling and authentication
- Environment variable protection

## 📊 Analytics & Reporting

- Real-time financial analytics
- Payment tracking and status monitoring
- Property occupancy and income reports
- Export capabilities for PDF and CSV

Built with modern web technologies for scalable property management.