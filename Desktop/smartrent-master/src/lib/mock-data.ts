
import type { ApartmentDetails, Unit, Room } from '@/app/landlord/apartments/[apartmentId]/page';
import type { TenantProfile, PaymentHistoryItem, ServiceRequestItem as TenantServiceRequestItem } from '@/app/landlord/tenants/[tenantId]/page';
import type { WorkerProfile, AssignedTask, AttendanceRecord } from '@/app/landlord/workers/[workerId]/page';
import type { ServiceRequestDetail, ActivityLogItem as SRActivityLogItem } from '@/app/landlord/service-requests/[requestId]/page';
import { format, subDays, subMonths, addDays } from 'date-fns';
import { Users, Building2, ShieldCheck, ShoppingCart, DollarSign, Activity, FileText, Cog, Percent, TrendingUp, TrendingDown, MessageSquare, Star, Package, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';


export const mockApartmentList: ApartmentDetails[] = [
  {
    id: 'apt101',
    name: 'Greenwood Heights',
    location: '123 Main St, Kilimani, Nairobi',
    description: 'A modern apartment complex with spacious units and excellent amenities, located in the heart of Kilimani. Features include a swimming pool, gym, and 24/7 security detail. Ideal for families and professionals seeking a serene environment.',
    totalUnits: 3,
    occupiedUnits: 2,
    vacantUnits: 1,
    imageUrl: 'https://placehold.co/800x400.png',
    amenities: ['Parking', 'Gym', 'Pool', '24/7 Security', 'Wi-Fi', 'Playground', 'Backup Generator'],
    units: [
      { id: 'unitA101', unitName: 'A-101', numberOfRooms: 2, currentTenant: { name: 'John Doe', id: 'tenant001' }, status: 'Occupied', rooms: [{id: 'r1', roomNumber: 'Bedroom 1', status: 'Occupied'}, {id: 'r2', roomNumber: 'Living Room', status: 'Occupied'}] },
      { id: 'unitA102', unitName: 'A-102', numberOfRooms: 3, currentTenant: { name: 'Jane Smith', id: 'tenant002' }, status: 'Occupied', rooms: [{id: 'r3', roomNumber: 'Master Bedroom', status: 'Occupied'}, {id: 'r4', roomNumber: 'Bedroom 2', status: 'Occupied'}, {id: 'r5', roomNumber: 'Study', status: 'Occupied'}] },
      { id: 'unitB201', unitName: 'B-201', numberOfRooms: 1, status: 'Vacant', rooms: [{id: 'r6', roomNumber: 'Studio Room', status: 'Vacant'}] },
    ],
  },
  {
    id: 'apt202',
    name: 'Riverside Towers',
    location: '456 River Rd, Westlands, Nairobi',
    description: 'Luxury riverside living with breathtaking views and top-notch facilities. Close to shopping malls and business districts. Offers a serene escape from the city buzz.',
    totalUnits: 2,
    occupiedUnits: 1,
    vacantUnits: 1,
    imageUrl: 'https://placehold.co/800x400.png',
    amenities: ['Parking', '24/7 Security', 'Wi-Fi', 'Backup Generator', 'Borehole'],
    units: [
      { id: 'unitR10', unitName: 'R-10', numberOfRooms: 4, currentTenant: { name: 'Alice Brown', id: 'tenant003' }, status: 'Occupied', rooms: [{id: 'r7', roomNumber: 'Bedroom 1', status: 'Occupied'}, {id: 'r8', roomNumber: 'Bedroom 2', status: 'Occupied'}, {id: 'r9', roomNumber: 'Office', status: 'Occupied'}, {id: 'r10', roomNumber: 'Kitchenette', status: 'Occupied'}]},
      { id: 'unitR11', unitName: 'R-11', numberOfRooms: 2, status: 'Vacant', rooms: [{id: 'r11room1', roomNumber: 'Main Room', status: 'Vacant'}, {id: 'r11room2', roomNumber: 'Bathroom', status: 'Vacant'}]},
    ],
  },
   {
    id: 'apt303',
    name: 'Acacia Park View',
    location: '789 Acacia Ave, Lavington, Nairobi',
    description: 'Family friendly apartments with large play areas.',
    totalUnits: 15,
    occupiedUnits: 10,
    vacantUnits: 5,
    imageUrl: 'https://placehold.co/600x400.png',
    amenities: ['Parking', 'Garden', 'Playground'],
    units: [
        { id: 'unitC301', unitName: 'C-301', numberOfRooms: 3, status: 'Occupied', currentTenant: { name: 'Chris Davis', id: 'tenant004'}, rooms: [{id: 'rC1', roomNumber: 'Bedroom 1', status: 'Occupied'}, {id: 'rC2', roomNumber: 'Bedroom 2', status: 'Occupied'}, {id: 'rC3', roomNumber: 'Living Room', status: 'Occupied'}] },
        { id: 'unitC302', unitName: 'C-302', numberOfRooms: 2, status: 'Vacant', rooms: [{id: 'rC4', roomNumber: 'Bedroom', status: 'Vacant'}, {id: 'rC5', roomNumber: 'Lounge', status: 'Vacant'}] },
    ]
  },
];

export const mockTenantProfiles: TenantProfile[] = [
  {
    id: 'tenant001',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '0712345678',
    nationalId: '12345678',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    emergencyContactName: 'Jane Doe (Spouse)',
    emergencyContactPhone: '0798765432',
    apartmentId: 'apt101',
    apartmentName: 'Greenwood Heights',
    unitId: 'unitA101',
    unitName: 'A-101',
    roomId: 'r1',
    roomNumber: '1',
    moveInDate: '2023-01-15',
    monthlyRent: 25000,
    securityDeposit: 25000,
    leaseStartDate: '2023-01-15',
    leaseEndDate: '2024-01-14',
    paymentHistory: [
      { id: 'p1', monthYear: 'May 2024', amountDue: 25000, amountPaid: 25000, paymentDate: '2024-05-03', method: 'M-Pesa', transactionId: 'SFE123ABC4', status: 'Paid' },
      { id: 'p2', monthYear: 'April 2024', amountDue: 25000, amountPaid: 25000, paymentDate: '2024-04-05', method: 'Card', status: 'Paid' },
      { id: 'p3', monthYear: 'June 2024', amountDue: 25000, amountPaid: 0, paymentDate: '-', method: '-', status: 'Unpaid' },
    ],
    serviceRequestHistory: [
      { id: 'sr1', requestId: 'SR001', dateSubmitted: '2024-03-10', description: 'Leaking kitchen tap', status: 'Completed', workerAssigned: 'Mark Lee' },
      { id: 'sr2', requestId: 'SR005', dateSubmitted: '2024-05-20', description: 'Broken window latch', status: 'Pending' },
    ],
  },
   {
    id: 'tenant002',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '0723456789',
    nationalId: '87654321',
    dateOfBirth: '1988-11-22',
    gender: 'Female',
    emergencyContactName: 'Robert Smith (Brother)',
    emergencyContactPhone: '0787654321',
    apartmentId: 'apt101',
    apartmentName: 'Greenwood Heights',
    unitId: 'unitA102',
    unitName: 'A-102',
    roomId: 'r3',
    roomNumber: 'Main',
    moveInDate: '2022-08-01',
    monthlyRent: 30000,
    securityDeposit: 30000,
    leaseStartDate: '2022-08-01',
    leaseEndDate: '2024-07-31',
    paymentHistory: [
      { id: 'p4', monthYear: 'June 2024', amountDue: 30000, amountPaid: 15000, paymentDate: '2024-06-04', method: 'Bank Transfer', transactionId: 'BTX9876', status: 'Partial' },
    ],
    serviceRequestHistory: [],
  },
  {
    id: 'tenant003',
    fullName: 'Alice Brown',
    email: 'alice.brown@example.com',
    phone: '0734567890',
    nationalId: '23456789',
    dateOfBirth: '1995-02-28',
    gender: 'Female',
    emergencyContactName: 'David Brown (Father)',
    emergencyContactPhone: '0701234567',
    apartmentId: 'apt202',
    apartmentName: 'Riverside Towers',
    unitId: 'unitR10',
    unitName: 'R-10',
    roomId: 'r7',
    roomNumber: '1',
    moveInDate: '2023-07-10',
    monthlyRent: 18000,
    securityDeposit: 18000,
    leaseStartDate: '2023-07-10',
    paymentHistory: [
      { id: 'p5', monthYear: 'June 2024', amountDue: 18000, amountPaid: 18000, paymentDate: '2024-06-01', method: 'Card', transactionId: 'card_123xyz', status: 'Paid' },
    ],
    serviceRequestHistory: [
      { id: 'sr3', requestId: 'SR008', dateSubmitted: '2024-06-01', description: 'Unblock drainage in Unit B-203', status: 'In Progress', workerAssigned: 'Mark Lee' },
    ],
  },
];

export const mockWorkerProfiles: WorkerProfile[] = [
  {
    id: 'worker001',
    fullName: 'Mark Lee',
    email: 'mark.lee@example.com',
    phone: '0755112233',
    nationalId: '87654321',
    role: 'Plumber',
    mockSalary: 45000,
    assignedApartments: [
      { id: 'apt101', name: 'Greenwood Heights' },
      { id: 'apt202', name: 'Riverside Towers' },
    ],
    workingHours: '09:00 - 17:00, Mon, Tue, Wed, Thu, Fri',
    status: 'Active',
    emergencyContactName: 'Mary Lee (Wife)',
    emergencyContactPhone: '0755998877',
    assignedTasksHistory: [
      { id: 't1', taskId: 'SR001', dateAssigned: '2024-05-15', description: 'Fix leaking pipe in Unit A-101', apartmentUnit: 'Greenwood Heights, A-101', tenantName: 'John Doe', status: 'Completed', dateCompleted: '2024-05-16' },
      { id: 't2', taskId: 'SR008', dateAssigned: '2024-06-01', description: 'Unblock drainage in Unit B-203', apartmentUnit: 'Riverside Towers, R-10', tenantName: 'Alice Brown', status: 'In Progress' },
    ],
    attendanceHistory: [
      { id: 'att1', date: '2024-06-03', checkInTime: '09:02', checkOutTime: '17:05', hoursWorked: '8h 3m', location: 'Greenwood Heights'},
      { id: 'att2', date: '2024-06-04', checkInTime: '08:55', checkOutTime: '16:58', hoursWorked: '8h 3m', location: 'Riverside Towers'},
    ],
  },
  {
    id: 'worker002',
    fullName: 'Sarah Kim',
    email: 'sarah.kim@example.com',
    phone: '0766223344',
    nationalId: '11223344',
    role: 'Electrician',
    mockSalary: 55000,
    assignedApartments: [ { id: 'apt101', name: 'Greenwood Heights' }],
    workingHours: '08:00 - 16:00, Mon-Sat',
    status: 'Active',
    emergencyContactName: 'Ken Kim (Brother)',
    emergencyContactPhone: '0766001122',
    assignedTasksHistory: [
      { id: 't3', taskId: 'TSK010', dateAssigned: '2024-06-05', description: 'Repair faulty wiring in common area', apartmentUnit: 'Greenwood Heights, Common Area', status: 'Pending' },
    ],
    attendanceHistory: [],
  },
  {
    id: 'worker004',
    fullName: 'James Oloo',
    email: 'james.oloo@example.com',
    phone: '0744XXXYYY',
    nationalId: '44556677',
    role: 'Handyman/Pest Control',
    mockSalary: 38000,
    assignedApartments: [ { id: 'apt101', name: 'Greenwood Heights' } ],
    workingHours: '09:00 - 17:00, Mon-Fri',
    status: 'Active',
    emergencyContactName: 'Grace Oloo',
    emergencyContactPhone: '0744ABCDEF',
    assignedTasksHistory: [
        {id: 't4', taskId: 'SR005', dateAssigned: '2024-06-03', description: 'Pest control needed for ants...', apartmentUnit: 'Greenwood Heights, A-102', tenantName: 'Jane Smith', status: 'In Progress'},
    ],
    attendanceHistory: []
  }
];

export const mockWorkersForAssignment = mockWorkerProfiles.map(w => ({ id: w.id, name: `${w.fullName} (${w.role})`, availability: Math.random() > 0.3 ? 'Available' : 'Busy' }));


export const mockServiceRequestDetailsList: ServiceRequestDetail[] = [
  {
    id: 'sr001_internal',
    requestId: 'SR001',
    dateSubmitted: format(subDays(new Date(), 5), 'yyyy-MM-dd hh:mm a'),
    tenantName: 'John Doe',
    tenantId: 'tenant001',
    tenantPhone: '0712345678',
    apartmentName: 'Greenwood Heights',
    apartmentId: 'apt101',
    unitName: 'A-101',
    unitId: 'unitA101',
    roomNumber: '1',
    locationOfIssue: 'Kitchen',
    fullDescription: 'The main kitchen faucet is leaking constantly, even when turned off completely. It seems to be dripping from the base of the spout. Need urgent attention as it is wasting water.',
    attachedMedia: [
      { type: 'image', url: 'https://placehold.co/300x200.png', name: 'kitchen_faucet_leak.jpg' },
      { type: 'image', url: 'https://placehold.co/300x200.png', name: 'close_up_drip.jpg' },
    ],
    currentStatus: 'Completed',
    priority: 'Urgent',
    assignedWorker: { id: 'worker001', name: 'Mark Lee', role: 'Plumber', contact: '0755112233'},
    activityLog: [
      { id: 'log5_sr001', timestamp: format(subDays(new Date(), 4), 'yyyy-MM-dd hh:mm a'), actor: 'Worker (Mark Lee)', action: 'Status updated to Completed', details: 'Replaced faulty washer.' },
      { id: 'log4_sr001', timestamp: format(subDays(new Date(), 5), 'yyyy-MM-dd hh:mm a'), actor: 'System', action: 'Status updated to In Progress' },
      { id: 'log3_sr001', timestamp: format(subDays(new Date(), 5), 'yyyy-MM-dd hh:mm a'), actor: 'Landlord', action: 'Worker Mark Lee Assigned' },
      { id: 'log2_sr001', timestamp: format(subDays(new Date(), 5), 'yyyy-MM-dd hh:mm a'), actor: 'System', action: 'Landlord Notified' },
      { id: 'log1_sr001', timestamp: format(subDays(new Date(), 5), 'yyyy-MM-dd hh:mm a'), actor: 'Tenant (John Doe)', action: 'Request Submitted' },
    ],
  },
  {
    id: 'sr005_internal',
    requestId: 'SR005',
    dateSubmitted: format(subDays(new Date(), 2), 'yyyy-MM-dd hh:mm a'),
    tenantName: 'Jane Smith',
    tenantId: 'tenant002',
    tenantPhone: '0723456789',
    apartmentName: 'Greenwood Heights',
    apartmentId: 'apt101',
    unitName: 'A-102',
    unitId: 'unitA102',
    roomNumber: 'Main',
    locationOfIssue: 'Living Room',
    fullDescription: 'Pest control needed for ants in the kitchen and living room. They seem to be coming from a crack near the window.',
    attachedMedia: [],
    currentStatus: 'In Progress',
    priority: 'Normal',
    assignedWorker: { id: 'worker004', name: 'James Oloo', role: 'Handyman/Pest Control', contact: '0744XXXYYY'},
    activityLog: [
      { id: 'log3_sr005', timestamp: format(subDays(new Date(), 2), 'yyyy-MM-dd hh:mm a'), actor: 'System', action: 'Status updated to In Progress' },
      { id: 'log2_sr005', timestamp: format(subDays(new Date(), 2), 'yyyy-MM-dd hh:mm a'), actor: 'Landlord', action: 'Worker James Oloo Assigned' },
      { id: 'log1_sr005', timestamp: format(subDays(new Date(), 2), 'yyyy-MM-dd hh:mm a'), actor: 'Tenant (Jane Smith)', action: 'Request Submitted' },
    ],
  },
   {
    id: 'sr008_internal',
    requestId: 'SR008',
    dateSubmitted: format(subDays(new Date(), 10), 'yyyy-MM-dd hh:mm a'),
    tenantName: 'Alice Brown',
    tenantId: 'tenant003',
    tenantPhone: '0734567890',
    apartmentName: 'Riverside Towers',
    apartmentId: 'apt202',
    unitName: 'R-10',
    unitId: 'unitR10',
    roomNumber: '1',
    locationOfIssue: 'Bathroom',
    fullDescription: 'The main shower drain is completely blocked. Water is not draining at all.',
    attachedMedia: [],
    currentStatus: 'Pending',
    priority: 'Urgent',
    activityLog: [
      { id: 'log1_sr008', timestamp: format(subDays(new Date(), 10), 'yyyy-MM-dd hh:mm a'), actor: 'Tenant (Alice Brown)', action: 'Request Submitted' },
    ],
  },
];

export const mockPaymentRecordsForLandlord = [
  { id: 'pay001', tenantName: 'John Doe', tenantId: 'tenant001', apartmentName: 'Greenwood Heights', unitName: 'A-101', roomNumber: '1', amountPaid: 25000, paymentDate: '2024-06-03', method: 'M-Pesa', transactionId: 'SFE123ABC4' },
  { id: 'pay003', tenantName: 'Alice Brown', tenantId: 'tenant003', apartmentName: 'Riverside Towers', unitName: 'R-10', roomNumber: '1', amountPaid: 18000, paymentDate: '2024-06-01', method: 'Card', transactionId: 'card_123xyz' },
];

export const mockUnpaidRentRecordsForLandlord = [
  { id: 'upay002', tenantName: 'Jane Smith', tenantId: 'tenant002', apartmentName: 'Greenwood Heights', unitName: 'A-102', roomNumber: 'Main', amountDue: 30000, dueDate: '2024-06-05' },
];

export const mockExpensesForLandlord = [
  { id: 'exp001', date: format(new Date(2024, 4, 20), 'yyyy-MM-dd'), amount: 3500, type: 'Repairs', description: 'Plumbing supplies for Unit A-101 leak', apartmentName: 'Greenwood Heights', addedBy: 'Landlord A' },
  { id: 'exp002', date: format(new Date(2024, 5, 1), 'yyyy-MM-dd'), amount: 12000, type: 'Utilities', description: 'Common area electricity bill', addedBy: 'System' },
  { id: 'exp003', date: format(new Date(2024, 5, 5), 'yyyy-MM-dd'), amount: 5000, type: 'Cleaning', description: 'Monthly cleaning services for common areas', apartmentName: 'Riverside Towers', addedBy: 'Landlord B' },
];


// --- ADMIN DASHBOARD MOCK DATA ---

export interface AdminDashboardActivityItem {
  id: string;
  type: 'New User' | 'Property Added' | 'System Update' | 'Security Alert' | 'High Volume' | 'Payout Processed' | 'Report Generated' | 'Feedback Received' | 'Tenant Review';
  description: string;
  timestamp: string;
  user?: string;
  details?: string;
}
export const mockAdminDashboardActivity: AdminDashboardActivityItem[] = [
  { id: 'act001', type: 'New User', description: 'Landlord John Kamau registered.', timestamp: format(subDays(new Date(), 1), 'PPp'), user: 'System', details: 'Role: Landlord' },
  { id: 'act002', type: 'Property Added', description: 'Property "Serene Apartments" added by Landlord John Kamau.', timestamp: format(subDays(new Date(), 1), 'PPp'), user: 'John Kamau' },
  { id: 'act003', type: 'System Update', description: 'Payment gateway configuration updated.', timestamp: format(subDays(new Date(), 2), 'PPp'), user: 'Admin Sarah' },
  { id: 'act004', type: 'Security Alert', description: 'Multiple failed login attempts for admin@smartrent.com.', timestamp: format(subDays(new Date(), 0), 'PPp'), user: 'System', details: 'IP: 192.168.1.100' },
  { id: 'act005', type: 'High Volume', description: 'High volume of service requests from Greenwood Heights.', timestamp: format(subDays(new Date(), 0), 'PPp'), user: 'System Monitoring' },
];

export interface AdminTenantUser {
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  apartmentName: string;
  unitName: string;
  status: 'Active' | 'Inactive';
  registrationDate: string;
}
export const mockAdminTenantUsers: AdminTenantUser[] = mockTenantProfiles.map((tp, index) => ({
    tenantId: tp.id,
    name: tp.fullName,
    email: tp.email,
    phone: tp.phone,
    apartmentName: tp.apartmentName,
    unitName: tp.unitName,
    status: Math.random() > 0.2 ? 'Active' : 'Inactive',
    registrationDate: format(subDays(new Date(), index * 10 + 5), 'yyyy-MM-dd')
}));

export interface AdminWorkerUser {
  workerId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  assignedApartments: string[];
  status: 'Active' | 'Inactive';
  hireDate: string;
  mockSalary?: number;
}
export const mockAdminWorkerUsers: AdminWorkerUser[] = mockWorkerProfiles.map((wp, index) => ({
    workerId: wp.id,
    name: wp.fullName,
    email: wp.email || 'N/A',
    phone: wp.phone,
    role: wp.role,
    assignedApartments: wp.assignedApartments.map(a => a.name),
    status: wp.status,
    hireDate: format(subDays(new Date(), index * 30 + 15), 'yyyy-MM-dd'),
    mockSalary: wp.mockSalary,
}));

export interface AdminShopManagerUser {
  shopManagerId: string;
  name: string;
  email: string;
  phone: string;
  shopName?: string;
  status: 'Active' | 'Inactive';
  registrationDate: string;
}
export const mockAdminShopManagerUsers: AdminShopManagerUser[] = [
    { shopManagerId: 'sm001', name: 'Shop Manager Alice', email: 'alice.shop@example.com', phone: '0711001100', shopName: 'SmartRent Kilimani Kiosk', status: 'Active', registrationDate: format(subDays(new Date(), 45), 'yyyy-MM-dd')},
    { shopManagerId: 'sm002', name: 'Shop Manager Bob', email: 'bob.store@example.com', phone: '0722002200', status: 'Inactive', registrationDate: format(subDays(new Date(), 90), 'yyyy-MM-dd')},
];

export interface AdminGlobalProperty {
  id: string;
  name: string;
  landlordName: string;
  landlordId: string;
  location: string;
  totalUnits: number;
  occupiedUnits: number;
  occupancyRate: number;
  auditStatus: 'Verified' | 'Pending Audit' | 'Issues Found';
}
export const mockAdminGlobalProperties: AdminGlobalProperty[] = mockApartmentList.map((apt, index) => ({
    id: apt.id,
    name: apt.name,
    landlordName: `Landlord ${String.fromCharCode(65+index)}`, // Mock Landlord Name
    landlordId: `landlord00${index+1}`,
    location: apt.location,
    totalUnits: apt.totalUnits,
    occupiedUnits: apt.occupiedUnits,
    occupancyRate: apt.totalUnits > 0 ? (apt.occupiedUnits / apt.totalUnits) * 100 : 0,
    auditStatus: Math.random() > 0.6 ? 'Pending Audit' : (Math.random() > 0.3 ? 'Verified' : 'Issues Found')
}));

export interface AdminGlobalFinancialMetric {
    title: string;
    value: string;
    icon: LucideIcon;
    description?: string;
    valueClass?: string;
}
export const mockAdminGlobalFinancialMetrics: AdminGlobalFinancialMetric[] = [
    { title: "Total System Revenue (YTD)", value: "KES 15,750,000", icon: DollarSign, description: "All sources" },
    { title: "Total Payouts to Landlords (YTD)", value: "KES 14,000,000", icon: TrendingUp, description: "Excludes platform fees" },
    { title: "Platform Fees Collected (YTD)", value: "KES 1,750,000", icon: Percent, description: "Based on transactions" },
    { title: "Average Transaction Value", value: "KES 22,500", icon: DollarSign },
    { title: "Dispute Rate", value: "0.8%", icon: AlertTriangle, description: "Payment disputes", valueClass: "text-orange-600" },
];
export const mockAdminRevenueData = [
  { month: format(subMonths(new Date(), 5), 'MMM'), revenue: 2200000, payouts: 1900000 },
  { month: format(subMonths(new Date(), 4), 'MMM'), revenue: 2500000, payouts: 2100000 },
  { month: format(subMonths(new Date(), 3), 'MMM'), revenue: 2350000, payouts: 2000000 },
  { month: format(subMonths(new Date(), 2), 'MMM'), revenue: 2800000, payouts: 2450000 },
  { month: format(subMonths(new Date(), 1), 'MMM'), revenue: 2600000, payouts: 2200000 },
  { month: format(new Date(), 'MMM'), revenue: 3100000, payouts: 2750000 },
];

export interface AdminGlobalServiceRequest {
  requestId: string;
  dateSubmitted: string;
  tenantName: string;
  propertyUnit: string;
  description: string;
  priority?: 'Urgent' | 'Normal' | 'Low';
  assignedWorker?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Canceled' | 'Escalated';
}
export const mockAdminGlobalServiceRequests: AdminGlobalServiceRequest[] = mockServiceRequestDetailsList.map(sr => ({
    requestId: sr.requestId,
    dateSubmitted: sr.dateSubmitted,
    tenantName: sr.tenantName,
    propertyUnit: `${sr.apartmentName} - ${sr.unitName}`,
    description: sr.fullDescription.substring(0, 50) + "...",
    priority: sr.priority,
    assignedWorker: sr.assignedWorker?.name,
    status: sr.currentStatus,
}));

export interface AdminShopMetric { title: string; value: string; icon: LucideIcon; description?: string; valueClass?: string; }
export const mockAdminShopMetrics: AdminShopMetric[] = [
    { title: "Total Shop Sales (All Time)", value: "KES 2,500,000", icon: DollarSign },
    { title: "Total Shop Orders (All Time)", value: "1,250", icon: ShoppingCart },
    { title: "Number of Products", value: "560", icon: Package, description: "Across all shops" },
    { title: "Active Shop Managers", value: "2", icon: Users, valueClass: "text-green-600" },
];

export interface AdminGlobalProduct { id: string; sku: string; name: string; category: string; price: number; stock: number; status: 'Active' | 'Inactive' | 'Low Stock'; vendor?: string; }
export const mockAdminGlobalProducts: AdminGlobalProduct[] = [
    { id: 'prodG001', sku: 'FM001-KCC', name: 'KCC Fresh Milk 1L', category: 'Groceries', price: 120, stock: 150, status: 'Active', vendor: 'Kilimani Kiosk' },
    { id: 'prodG002', sku: 'CL005-ABC', name: 'ABC All-Purpose Cleaner', category: 'Cleaning', price: 350, stock: 5, status: 'Low Stock', vendor: 'Westlands Supplies' },
    { id: 'prodG003', sku: 'SNK012-CRX', name: 'Crispo Potato Chips 150g', category: 'Snacks', price: 150, stock: 0, status: 'Inactive', vendor: 'Kilimani Kiosk' },
];

export interface AdminGlobalOrder { orderId: string; customerName: string; date: string; totalAmount: number; paymentStatus: 'Paid' | 'Pending'; orderStatus: 'New' | 'Processing' | 'Delivered' | 'Canceled'; shopName?: string; }
export const mockAdminGlobalOrders: AdminGlobalOrder[] = [
    { orderId: 'ORD-SYS-001', customerName: 'John Doe', date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), totalAmount: 1200, paymentStatus: 'Paid', orderStatus: 'Delivered', shopName: 'Kilimani Kiosk' },
    { orderId: 'ORD-SYS-002', customerName: 'Alice Brown', date: format(subDays(new Date(), 0), 'yyyy-MM-dd'), totalAmount: 850, paymentStatus: 'Pending', orderStatus: 'Processing', shopName: 'Westlands Supplies' },
];

export interface AdminAuditLogEntry { id: string; timestamp: string; user: string; role: string; action: string; affectedEntityId?: string; ipAddress?: string; details?: string; }
export const mockAdminAuditLogEntries: AdminAuditLogEntry[] = [
    { id: 'audit001', timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'), user: 'admin@smartrent.com', role: 'Admin', action: 'LoginSuccess', ipAddress: '192.168.1.101', details: 'Successful login via web.' },
    { id: 'audit002', timestamp: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'), user: 'landlord001', role: 'Landlord', action: 'PropertyUpdated', affectedEntityId: 'apt101', ipAddress: '10.0.0.5', details: 'Updated description for Greenwood Heights.' },
    { id: 'audit003', timestamp: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'), user: 'System', role: 'System', action: 'UserDeactivated', affectedEntityId: 'tenant099', details: 'Tenant account auto-deactivated due to inactivity.' },
    { id: 'audit004', timestamp: format(subDays(new Date(), 0), 'yyyy-MM-dd HH:mm:ss'), user: 'admin@smartrent.com', role: 'Admin', action: 'SettingChanged', affectedEntityId: 'PaymentGateway', ipAddress: '192.168.1.101', details: 'Updated M-Pesa Paybill number.' },
];

export interface AdminNotificationTemplate { id: string; name: string; type: 'Email' | 'SMS' | 'In-App'; channels: string[]; lastUpdated: string; status: 'Active' | 'Draft'; }
export const mockAdminNotificationTemplates: AdminNotificationTemplate[] = [
    { id: 'tmpl001', name: 'Welcome Email - Tenant', type: 'Email', channels: ['Email'], lastUpdated: format(subDays(new Date(), 10), 'yyyy-MM-dd'), status: 'Active' },
    { id: 'tmpl002', name: 'Rent Reminder - SMS', type: 'SMS', channels: ['SMS'], lastUpdated: format(subDays(new Date(), 5), 'yyyy-MM-dd'), status: 'Active' },
    { id: 'tmpl003', name: 'Service Request Update - In-App', type: 'In-App', channels: ['In-App', 'Email'], lastUpdated: format(subDays(new Date(), 20), 'yyyy-MM-dd'), status: 'Draft' },
    { id: 'tmpl004', name: 'Password Reset Confirmation', type: 'Email', channels: ['Email'], lastUpdated: format(subDays(new Date(), 30), 'yyyy-MM-dd'), status: 'Active' },
];

export interface AdminUserRolePermission {
    Create: boolean; Read: boolean; Update: boolean; Delete: boolean;
}
export interface AdminUserRole {
  id: string;
  name: 'Admin' | 'Landlord' | 'Tenant' | 'Worker' | 'Shop Manager';
  description: string;
  permissions: {
    Users?: AdminUserRolePermission;
    Properties?: AdminUserRolePermission;
    Financials?: AdminUserRolePermission;
    Settings?: AdminUserRolePermission;
    Ecommerce?: AdminUserRolePermission;
    ServiceRequests?: AdminUserRolePermission;
    [key: string]: AdminUserRolePermission | undefined; // For flexibility
  };
}
export const mockAdminUserRoles: AdminUserRole[] = [
  { id: 'role_admin', name: 'Admin', description: 'Full system access, manages all aspects.', permissions: { Users: {C:true,R:true,U:true,D:true}, Properties: {C:true,R:true,U:true,D:true}, Financials: {C:true,R:true,U:true,D:true}, Settings: {C:true,R:true,U:true,D:true} }},
  { id: 'role_landlord', name: 'Landlord', description: 'Manages own properties, tenants, workers, finances.', permissions: { Users: {C:true,R:true,U:true,D:false}, Properties: {C:true,R:true,U:true,D:true}, Financials: {C:false,R:true,U:false,D:false} }},
  { id: 'role_tenant', name: 'Tenant', description: 'Access to own lease, payments, service requests.', permissions: { Financials: {C:true,R:true,U:false,D:false}, ServiceRequests: {C:true,R:true,U:false,D:false} }},
  { id: 'role_worker', name: 'Worker', description: 'Manages assigned tasks and schedule.', permissions: { ServiceRequests: {C:false,R:true,U:true,D:false} }},
  { id: 'role_shop_manager', name: 'Shop Manager', description: 'Manages shop inventory, orders, customers.', permissions: { Ecommerce: {C:true,R:true,U:true,D:true} }},
];


export interface AdminReportDataItem {
    name: string;
    value: number;
    [key: string]: any; // For additional properties like 'fill' for charts
}
export const mockAdminReportData = {
  userStats: {
    totalUsers: 550,
    byRole: [
      { role: 'Landlord', count: 50 }, { role: 'Tenant', count: 350 },
      { role: 'Worker', count: 100 }, { role: 'Shop Manager', count: 5 },
      { role: 'Admin', count: 2 },
    ],
    growthLast30Days: 25,
  },
  financialSummary: {
    totalRevenue: 15750000, totalPayouts: 14000000, platformFees: 1750000,
    averageRent: 28000,
  },
  propertyOccupancy: {
    totalProperties: 50, totalUnits: 750, totalOccupiedUnits: 600, totalVacantUnits: 150,
    overallOccupancyRate: (600/750)*100,
  },
  serviceRequestTrends: {
    totalRequestsLast30Days: 120,
    averageResolutionTimeHours: 48,
    byStatus: [
      { status: 'Pending', count: 15 }, { status: 'In Progress', count: 25 },
      { status: 'Completed', count: 70 }, { status: 'Canceled', count: 10 },
    ],
  },
};

// --- SHOP MANAGER MOCK DATA ---
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Inactive' | 'Low Stock';
  imageUrl?: string;
  description?: string;
}

export const mockShopProducts: Product[] = [
  { id: 'prod001', name: 'Fresh Milk 1L', sku: 'FM001', category: 'Groceries', price: 120, stock: 50, status: 'Active', imageUrl: 'https://placehold.co/100x100.png', description: 'Fresh pasteurized cow milk, 1 litre pack.' },
  { id: 'prod002', name: 'All-Purpose Cleaner', sku: 'CL005', category: 'Cleaning Supplies', price: 350, stock: 5, status: 'Low Stock', imageUrl: 'https://placehold.co/100x100.png', description: 'Multi-surface cleaner, 500ml spray bottle.' },
  { id: 'prod003', name: 'Laundry Detergent 2kg', sku: 'LD010', category: 'Cleaning Supplies', price: 500, stock: 0, status: 'Inactive', imageUrl: 'https://placehold.co/100x100.png', description: 'Washing powder for all fabric types.' },
  { id: 'prod004', name: 'Water Delivery (20L)', sku: 'WD002', category: 'Services', price: 250, stock: 999, status: 'Active', imageUrl: 'https://placehold.co/100x100.png', description: 'Purified drinking water, 20 litre container delivery.' },
];

export const productCategoriesForShop: string[] = ['Groceries', 'Cleaning Supplies', 'Home Essentials', 'Services', 'Snacks', 'Beverages'];
export const productStatusesForShop: Array<Product['status']> = ['Active', 'Inactive', 'Low Stock'];

export interface ShopCustomer {
  id: string; // Tenant ID from SmartRent core
  name: string;
  apartmentUnit: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export const mockShopCustomers: ShopCustomer[] = [
  { id: 'tenant001', name: 'John Doe', apartmentUnit: 'Greenwood A-101', totalOrders: 5, totalSpent: 6500, lastOrderDate: '2024-07-10' },
  { id: 'tenant002', name: 'Jane Smith', apartmentUnit: 'Greenwood A-102', totalOrders: 2, totalSpent: 1500, lastOrderDate: '2024-07-05' },
  { id: 'tenant003', name: 'Alice Brown', apartmentUnit: 'Riverside B-201', totalOrders: 8, totalSpent: 12000, lastOrderDate: '2024-07-12' },
];
    
