import { 
  users, 
  comments, 
  calendarEvents, 
  type User, 
  type InsertUser, 
  type Comment, 
  type InsertComment,
  type CalendarEvent,
  type InsertCalendarEvent
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, and, gte, lte } from "drizzle-orm";
import * as bcrypt from 'bcrypt';

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User related methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: number): Promise<User | undefined>;
  verifyUserPassword(username: string, password: string): Promise<User | undefined>;
  
  // Comment related methods
  createComment(comment: InsertComment): Promise<Comment>;
  getAllComments(): Promise<Comment[]>;
  markCommentAsRead(id: number): Promise<Comment | undefined>;
  deleteComment(id: number): Promise<boolean>;
  
  // Calendar events related methods
  createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  getCalendarEvent(id: number): Promise<CalendarEvent | undefined>;
  getAllCalendarEvents(): Promise<CalendarEvent[]>;
  getCalendarEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]>;
  updateCalendarEvent(id: number, event: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined>;
  deleteCalendarEvent(id: number): Promise<boolean>;
  
  // Utility methods
  checkDatabaseConnection(): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User related methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    } catch (error) {
      console.error("Error getting user by username:", error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(insertUser.password, 10);
      
      const [user] = await db
        .insert(users)
        .values({
          ...insertUser,
          password: hashedPassword,
        })
        .returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  async updateUserLastLogin(id: number): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, id))
        .returning();
      return user;
    } catch (error) {
      console.error("Error updating user last login:", error);
      throw error;
    }
  }
  
  async verifyUserPassword(username: string, password: string): Promise<User | undefined> {
    try {
      const user = await this.getUserByUsername(username);
      if (!user) return undefined;
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return undefined;
      
      // Update last login time
      return this.updateUserLastLogin(user.id);
    } catch (error) {
      console.error("Error verifying user password:", error);
      throw error;
    }
  }

  // Comment related methods
  async createComment(insertComment: InsertComment): Promise<Comment> {
    try {
      const [comment] = await db
        .insert(comments)
        .values(insertComment)
        .returning();
      return comment;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  }

  async getAllComments(): Promise<Comment[]> {
    try {
      return await db
        .select()
        .from(comments)
        .orderBy(desc(comments.createdAt));
    } catch (error) {
      console.error("Error getting all comments:", error);
      throw error;
    }
  }
  
  async markCommentAsRead(id: number): Promise<Comment | undefined> {
    try {
      const [comment] = await db
        .update(comments)
        .set({ isRead: true })
        .where(eq(comments.id, id))
        .returning();
      return comment;
    } catch (error) {
      console.error("Error marking comment as read:", error);
      throw error;
    }
  }
  
  async deleteComment(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(comments)
        .where(eq(comments.id, id))
        .returning({ id: comments.id });
      
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }
  
  // Calendar events related methods
  async createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    try {
      const [calendarEvent] = await db
        .insert(calendarEvents)
        .values(event)
        .returning();
      return calendarEvent;
    } catch (error) {
      console.error("Error creating calendar event:", error);
      throw error;
    }
  }
  
  async getCalendarEvent(id: number): Promise<CalendarEvent | undefined> {
    try {
      const [event] = await db
        .select()
        .from(calendarEvents)
        .where(eq(calendarEvents.id, id));
      return event || undefined;
    } catch (error) {
      console.error("Error getting calendar event:", error);
      throw error;
    }
  }
  
  async getAllCalendarEvents(): Promise<CalendarEvent[]> {
    try {
      return await db
        .select()
        .from(calendarEvents)
        .orderBy(calendarEvents.eventDate);
    } catch (error) {
      console.error("Error getting all calendar events:", error);
      throw error;
    }
  }
  
  async getCalendarEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    try {
      return await db
        .select()
        .from(calendarEvents)
        .where(
          sql`${calendarEvents.eventDate} >= ${startDate} AND ${calendarEvents.eventDate} <= ${endDate}`
        )
        .orderBy(calendarEvents.eventDate);
    } catch (error) {
      console.error("Error getting calendar events by date range:", error);
      throw error;
    }
  }
  
  async updateCalendarEvent(id: number, event: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined> {
    try {
      const [updatedEvent] = await db
        .update(calendarEvents)
        .set({
          ...event,
          updatedAt: new Date(),
        })
        .where(eq(calendarEvents.id, id))
        .returning();
      return updatedEvent;
    } catch (error) {
      console.error("Error updating calendar event:", error);
      throw error;
    }
  }
  
  async deleteCalendarEvent(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(calendarEvents)
        .where(eq(calendarEvents.id, id))
        .returning({ id: calendarEvents.id });
      
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      throw error;
    }
  }
  
  // Utility methods
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
