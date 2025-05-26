import { 
  users, apartments, units, rooms, rentPayments, serviceRequests, workerAssignments, 
  expenses, shopProducts, shopOrders, notifications, demoRequests, contactMessages,
  type User, type InsertUser, type Apartment, type InsertApartment, type Unit, type InsertUnit,
  type Room, type InsertRoom, type RentPayment, type InsertRentPayment, type ServiceRequest, 
  type InsertServiceRequest, type WorkerAssignment, type InsertWorkerAssignment,
  type Expense, type InsertExpense, type ShopProduct, type InsertShopProduct,
  type ShopOrder, type InsertShopOrder, type DemoRequest, type InsertDemoRequest, 
  type ContactMessage, type InsertContactMessage
} from "@shared/schema";

export interface IStorage {
  // User Management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Apartments & Properties
  createApartment(apartment: InsertApartment): Promise<Apartment>;
  getApartmentsByLandlord(landlordId: number): Promise<Apartment[]>;
  createUnit(unit: InsertUnit): Promise<Unit>;
  getUnitsByApartment(apartmentId: number): Promise<Unit[]>;
  createRoom(room: InsertRoom): Promise<Room>;
  getRoomsByUnit(unitId: number): Promise<Room[]>;
  
  // Rent & Payments
  createRentPayment(payment: InsertRentPayment): Promise<RentPayment>;
  getPaymentsByTenant(tenantId: number): Promise<RentPayment[]>;
  getPaymentsByLandlord(landlordId: number): Promise<RentPayment[]>;
  
  // Service Requests
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  getServiceRequestsByTenant(tenantId: number): Promise<ServiceRequest[]>;
  getServiceRequestsByLandlord(landlordId: number): Promise<ServiceRequest[]>;
  updateServiceRequest(id: number, request: Partial<ServiceRequest>): Promise<ServiceRequest | undefined>;
  
  // Workers
  createWorkerAssignment(assignment: InsertWorkerAssignment): Promise<WorkerAssignment>;
  getWorkerAssignments(workerId: number): Promise<WorkerAssignment[]>;
  
  // Expenses
  createExpense(expense: InsertExpense): Promise<Expense>;
  getExpensesByLandlord(landlordId: number): Promise<Expense[]>;
  
  // Shopping
  createShopProduct(product: InsertShopProduct): Promise<ShopProduct>;
  getAllShopProducts(): Promise<ShopProduct[]>;
  createShopOrder(order: InsertShopOrder): Promise<ShopOrder>;
  getOrdersByCustomer(customerId: number): Promise<ShopOrder[]>;
  
  // Demo & Contact
  createDemoRequest(request: InsertDemoRequest): Promise<DemoRequest>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllDemoRequests(): Promise<DemoRequest[]>;
  getAllContactMessages(): Promise<ContactMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private demoRequests: Map<number, DemoRequest>;
  private contactMessages: Map<number, ContactMessage>;
  private currentUserId: number;
  private currentDemoRequestId: number;
  private currentContactMessageId: number;

  constructor() {
    this.users = new Map();
    this.demoRequests = new Map();
    this.contactMessages = new Map();
    this.currentUserId = 1;
    this.currentDemoRequestId = 1;
    this.currentContactMessageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDemoRequest(insertRequest: InsertDemoRequest): Promise<DemoRequest> {
    const id = this.currentDemoRequestId++;
    const request: DemoRequest = {
      ...insertRequest,
      id,
      createdAt: new Date(),
    };
    this.demoRequests.set(id, request);
    return request;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const message: ContactMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getAllDemoRequests(): Promise<DemoRequest[]> {
    return Array.from(this.demoRequests.values());
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }
}

export const storage = new MemStorage();
