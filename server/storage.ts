import { users, demoRequests, contactMessages, type User, type InsertUser, type DemoRequest, type InsertDemoRequest, type ContactMessage, type InsertContactMessage } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
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
