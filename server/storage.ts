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
import { db } from "./db";
import { eq } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // User Management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  // Apartments & Properties
  async createApartment(apartment: InsertApartment): Promise<Apartment> {
    const [newApartment] = await db.insert(apartments).values(apartment).returning();
    return newApartment;
  }

  async getApartmentsByLandlord(landlordId: number): Promise<Apartment[]> {
    return await db.select().from(apartments).where(eq(apartments.landlordId, landlordId));
  }

  async createUnit(unit: InsertUnit): Promise<Unit> {
    const [newUnit] = await db.insert(units).values(unit).returning();
    return newUnit;
  }

  async getUnitsByApartment(apartmentId: number): Promise<Unit[]> {
    return await db.select().from(units).where(eq(units.apartmentId, apartmentId));
  }

  async createRoom(room: InsertRoom): Promise<Room> {
    const [newRoom] = await db.insert(rooms).values(room).returning();
    return newRoom;
  }

  async getRoomsByUnit(unitId: number): Promise<Room[]> {
    return await db.select().from(rooms).where(eq(rooms.unitId, unitId));
  }

  // Rent & Payments
  async createRentPayment(payment: InsertRentPayment): Promise<RentPayment> {
    const [newPayment] = await db.insert(rentPayments).values(payment).returning();
    return newPayment;
  }

  async getPaymentsByTenant(tenantId: number): Promise<RentPayment[]> {
    return await db.select().from(rentPayments).where(eq(rentPayments.tenantId, tenantId));
  }

  async getPaymentsByLandlord(landlordId: number): Promise<RentPayment[]> {
    // This would need a more complex query joining tables
    return [];
  }

  // Service Requests
  async createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest> {
    const [newRequest] = await db.insert(serviceRequests).values(request).returning();
    return newRequest;
  }

  async getServiceRequestsByTenant(tenantId: number): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests).where(eq(serviceRequests.tenantId, tenantId));
  }

  async getServiceRequestsByLandlord(landlordId: number): Promise<ServiceRequest[]> {
    // This would need a more complex query joining tables
    return [];
  }

  async updateServiceRequest(id: number, request: Partial<ServiceRequest>): Promise<ServiceRequest | undefined> {
    const [updatedRequest] = await db.update(serviceRequests).set(request).where(eq(serviceRequests.id, id)).returning();
    return updatedRequest || undefined;
  }

  // Workers
  async createWorkerAssignment(assignment: InsertWorkerAssignment): Promise<WorkerAssignment> {
    const [newAssignment] = await db.insert(workerAssignments).values(assignment).returning();
    return newAssignment;
  }

  async getWorkerAssignments(workerId: number): Promise<WorkerAssignment[]> {
    return await db.select().from(workerAssignments).where(eq(workerAssignments.workerId, workerId));
  }

  // Expenses
  async createExpense(expense: InsertExpense): Promise<Expense> {
    const [newExpense] = await db.insert(expenses).values(expense).returning();
    return newExpense;
  }

  async getExpensesByLandlord(landlordId: number): Promise<Expense[]> {
    return await db.select().from(expenses).where(eq(expenses.landlordId, landlordId));
  }

  // Shopping
  async createShopProduct(product: InsertShopProduct): Promise<ShopProduct> {
    const [newProduct] = await db.insert(shopProducts).values(product).returning();
    return newProduct;
  }

  async getAllShopProducts(): Promise<ShopProduct[]> {
    return await db.select().from(shopProducts);
  }

  async createShopOrder(order: InsertShopOrder): Promise<ShopOrder> {
    const [newOrder] = await db.insert(shopOrders).values(order).returning();
    return newOrder;
  }

  async getOrdersByCustomer(customerId: number): Promise<ShopOrder[]> {
    return await db.select().from(shopOrders).where(eq(shopOrders.customerId, customerId));
  }

  // Demo & Contact
  async createDemoRequest(request: InsertDemoRequest): Promise<DemoRequest> {
    const [newRequest] = await db.insert(demoRequests).values(request).returning();
    return newRequest;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async getAllDemoRequests(): Promise<DemoRequest[]> {
    return await db.select().from(demoRequests);
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }
}

export const storage = new DatabaseStorage();
