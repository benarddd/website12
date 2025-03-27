import { users, comments, type User, type InsertUser, type Comment, type InsertComment } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createComment(comment: InsertComment): Promise<Comment>;
  getAllComments(): Promise<Comment[]>;
  checkDatabaseConnection(): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async getAllComments(): Promise<Comment[]> {
    return await db.select().from(comments);
  }
  
  async checkDatabaseConnection(): Promise<boolean> {
    try {
      // Execute a simple query to check database connection
      // Using a simple query on the users table instead of raw SQL
      const result = await db.select().from(users).limit(1);
      return true; // If we got here, the connection is working
    } catch (error) {
      console.error("Database connection check failed:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
