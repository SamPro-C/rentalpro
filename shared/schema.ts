import { mysqlTable, text, int, timestamp, decimal, boolean } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Management
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // admin, landlord, tenant, shop_manager, worker
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Apartments and Properties
export const apartments = mysqlTable("apartments", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  landlordId: int("landlord_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const units = mysqlTable("units", {
  id: int("id").primaryKey().autoincrement(),
  apartmentId: int("apartment_id").references(() => apartments.id).notNull(),
  unitNumber: text("unit_number").notNull(),
  rentAmount: decimal("rent_amount", { precision: 10, scale: 2 }).notNull(),
  isOccupied: boolean("is_occupied").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rooms = mysqlTable("rooms", {
  id: int("id").primaryKey().autoincrement(),
  unitId: int("unit_id").references(() => units.id).notNull(),
  roomNumber: text("room_number").notNull(),
  roomType: text("room_type").notNull(), // bedsitter, 1br, 2br, etc
  tenantId: int("tenant_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Rent and Payments
export const rentPayments = mysqlTable("rent_payments", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").references(() => users.id).notNull(),
  roomId: int("room_id").references(() => rooms.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(), // mpesa_auto, mpesa_manual, card
  mpesaCode: text("mpesa_code"),
  screenshotUrl: text("screenshot_url"),
  status: text("status").default("pending"), // pending, confirmed, failed
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Service Requests
export const serviceRequests = mysqlTable("service_requests", {
  id: int("id").primaryKey().autoincrement(),
  tenantId: int("tenant_id").references(() => users.id).notNull(),
  roomId: int("room_id").references(() => rooms.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  mediaUrl: text("media_url"),
  status: text("status").default("pending"), // pending, in_progress, completed
  assignedWorkerId: int("assigned_worker_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Workers and Tasks
export const workerAssignments = mysqlTable("worker_assignments", {
  id: int("id").primaryKey().autoincrement(),
  workerId: int("worker_id").references(() => users.id).notNull(),
  apartmentId: int("apartment_id").references(() => apartments.id).notNull(),
  duties: text("duties").notNull(),
  schedule: text("schedule").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workerAttendance = mysqlTable("worker_attendance", {
  id: int("id").primaryKey().autoincrement(),
  workerId: int("worker_id").references(() => users.id).notNull(),
  apartmentId: int("apartment_id").references(() => apartments.id).notNull(),
  checkInTime: timestamp("check_in_time"),
  checkOutTime: timestamp("check_out_time"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Shopping System
export const shopProducts = mysqlTable("shop_products", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // groceries, water, gas, etc
  stockQuantity: int("stock_quantity").default(0),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shopOrders = mysqlTable("shop_orders", {
  id: int("id").primaryKey().autoincrement(),
  customerId: int("customer_id").references(() => users.id).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"), // pending, confirmed, delivered, cancelled
  deliveryAddress: text("delivery_address").notNull(),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  deliveryDate: timestamp("delivery_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = mysqlTable("order_items", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id").references(() => shopOrders.id).notNull(),
  productId: int("product_id").references(() => shopProducts.id).notNull(),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Expenses
export const expenses = mysqlTable("expenses", {
  id: int("id").primaryKey().autoincrement(),
  landlordId: int("landlord_id").references(() => users.id).notNull(),
  apartmentId: int("apartment_id").references(() => apartments.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  expenseType: text("expense_type").notNull(),
  description: text("description"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications
export const notifications = mysqlTable("notifications", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // payment, service, general
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const demoRequests = mysqlTable("demo_requests", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: int("phone").notNull(),
  userType: text("user_type").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isApproved: true,
});

export const insertApartmentSchema = createInsertSchema(apartments).omit({
  id: true,
  createdAt: true,
});

export const insertUnitSchema = createInsertSchema(units).omit({
  id: true,
  createdAt: true,
  isOccupied: true,
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
  createdAt: true,
});

export const insertRentPaymentSchema = createInsertSchema(rentPayments).omit({
  id: true,
  createdAt: true,
  paymentDate: true,
});

export const insertServiceRequestSchema = createInsertSchema(serviceRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const insertWorkerAssignmentSchema = createInsertSchema(workerAssignments).omit({
  id: true,
  createdAt: true,
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
});

export const insertShopProductSchema = createInsertSchema(shopProducts).omit({
  id: true,
  createdAt: true,
});

export const insertShopOrderSchema = createInsertSchema(shopOrders).omit({
  id: true,
  createdAt: true,
  orderDate: true,
});

export const insertDemoRequestSchema = createInsertSchema(demoRequests).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Apartment = typeof apartments.$inferSelect;
export type InsertApartment = z.infer<typeof insertApartmentSchema>;

export type Unit = typeof units.$inferSelect;
export type InsertUnit = z.infer<typeof insertUnitSchema>;

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

export type RentPayment = typeof rentPayments.$inferSelect;
export type InsertRentPayment = z.infer<typeof insertRentPaymentSchema>;

export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;

export type WorkerAssignment = typeof workerAssignments.$inferSelect;
export type InsertWorkerAssignment = z.infer<typeof insertWorkerAssignmentSchema>;

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export type ShopProduct = typeof shopProducts.$inferSelect;
export type InsertShopProduct = z.infer<typeof insertShopProductSchema>;

export type ShopOrder = typeof shopOrders.$inferSelect;
export type InsertShopOrder = z.infer<typeof insertShopOrderSchema>;

export type DemoRequest = typeof demoRequests.$inferSelect;
export type InsertDemoRequest = z.infer<typeof insertDemoRequestSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
