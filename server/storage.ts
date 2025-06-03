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
import { AppDataSource } from "./db";
import { User } from "./entities/User";
import { Repository } from "typeorm";

export interface IStorage {
  // User Management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Partial<User>): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  // Other methods omitted for brevity
}

import { DemoRequest } from "./entities/DemoRequest";
import { Repository } from "typeorm";

export class DatabaseStorage implements IStorage {
  private userRepository: Repository<User>;
  private demoRequestRepository: Repository<DemoRequest>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.demoRequestRepository = AppDataSource.getRepository(DemoRequest);
  }

  async getUser(id: number): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ id });
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ username });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ email });
  }

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | undefined> {
    await this.userRepository.update(id, user);
    return this.getUser(id);
  }

  async createDemoRequest(demoRequest: Partial<DemoRequest>): Promise<DemoRequest> {
    const newDemoRequest = this.demoRequestRepository.create(demoRequest);
    return await this.demoRequestRepository.save(newDemoRequest);
  }

  // Other methods to be implemented similarly
}

export const storage = new DatabaseStorage();
