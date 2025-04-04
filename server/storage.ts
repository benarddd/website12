
import * as fs from 'fs/promises';
import * as path from 'path';

// File paths for storing data
const DATA_DIR = path.join(process.cwd(), 'data');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Helper to read JSON file
async function readJsonFile(filePath: string) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper to write JSON file
async function writeJsonFile(filePath: string, data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

class FileStorage {
  private nextCommentId = 1;
  private nextEventId = 1;
  private nextUserId = 1;

  constructor() {
    // Initialize storage
    ensureDataDir();
  }

  async createComment(comment: any) {
    const comments = await readJsonFile(COMMENTS_FILE);
    const newComment = {
      id: this.nextCommentId++,
      ...comment,
      createdAt: new Date(),
      isRead: false
    };
    comments.push(newComment);
    await writeJsonFile(COMMENTS_FILE, comments);
    return newComment;
  }

  async getAllComments() {
    return readJsonFile(COMMENTS_FILE);
  }

  async createCalendarEvent(event: any) {
    const events = await readJsonFile(EVENTS_FILE);
    const newEvent = {
      id: this.nextEventId++,
      ...event,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    events.push(newEvent);
    await writeJsonFile(EVENTS_FILE, events);
    return newEvent;
  }

  async getAllCalendarEvents() {
    return readJsonFile(EVENTS_FILE);
  }

  async getCalendarEventsByDateRange(startDate: Date, endDate: Date) {
    const events = await readJsonFile(EVENTS_FILE);
    return events.filter((event: any) => {
      const eventDate = new Date(event.eventDate);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  async getCalendarEvent(id: number) {
    const events = await readJsonFile(EVENTS_FILE);
    return events.find((event: any) => event.id === id);
  }

  async updateCalendarEvent(id: number, data: any) {
    const events = await readJsonFile(EVENTS_FILE);
    const index = events.findIndex((event: any) => event.id === id);
    if (index !== -1) {
      events[index] = {
        ...events[index],
        ...data,
        updatedAt: new Date()
      };
      await writeJsonFile(EVENTS_FILE, events);
      return events[index];
    }
    return null;
  }

  async deleteCalendarEvent(id: number) {
    const events = await readJsonFile(EVENTS_FILE);
    const index = events.findIndex((event: any) => event.id === id);
    if (index !== -1) {
      events.splice(index, 1);
      await writeJsonFile(EVENTS_FILE, events);
      return true;
    }
    return false;
  }

  async checkDatabaseConnection() {
    return true;
  }

  async getUser(id: number) {
    const users = await readJsonFile(USERS_FILE);
    return users.find((user: any) => user.id === id);
  }

  async getUserByUsername(username: string) {
    const users = await readJsonFile(USERS_FILE);
    return users.find((user: any) => user.username === username);
  }

  async createUser(user: any) {
    const users = await readJsonFile(USERS_FILE);
    const newUser = {
      id: this.nextUserId++,
      ...user,
      createdAt: new Date(),
      lastLogin: null
    };
    users.push(newUser);
    await writeJsonFile(USERS_FILE, users);
    return newUser;
  }

  async updateUserLastLogin(id: number) {
    const users = await readJsonFile(USERS_FILE);
    const userIndex = users.findIndex((user: any) => user.id === id);
    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date();
      await writeJsonFile(USERS_FILE, users);
      return users[userIndex];
    }
    return undefined;
  }

  async verifyUserPassword(username: string, password: string) {
    const user = await this.getUserByUsername(username);
    if (!user) return undefined;
    if (user.password !== password) return undefined;
    return this.updateUserLastLogin(user.id);
  }

  async markCommentAsRead(id: number) {
    const comments = await readJsonFile(COMMENTS_FILE);
    const commentIndex = comments.findIndex((comment: any) => comment.id === id);
    if (commentIndex !== -1) {
      comments[commentIndex].isRead = true;
      await writeJsonFile(COMMENTS_FILE, comments);
      return comments[commentIndex];
    }
    return undefined;
  }

  async deleteComment(id: number) {
    const comments = await readJsonFile(COMMENTS_FILE);
    const index = comments.findIndex((comment: any) => comment.id === id);
    if (index !== -1) {
      comments.splice(index, 1);
      await writeJsonFile(COMMENTS_FILE, comments);
      return true;
    }
    return false;
  }
}

export const storage = new FileStorage();
