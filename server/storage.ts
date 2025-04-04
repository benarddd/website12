// In-memory storage implementation
class InMemoryStorage {
  private comments: any[] = [];
  private calendarEvents: any[] = [];
  private users: any[] = [];
  private nextCommentId = 1;
  private nextEventId = 1;
  private nextUserId = 1;

  async createComment(comment: any) {
    const newComment = {
      id: this.nextCommentId++,
      ...comment,
      createdAt: new Date(),
      isRead: false
    };
    this.comments.push(newComment);
    return newComment;
  }

  async getAllComments() {
    return this.comments;
  }

  async createCalendarEvent(event: any) {
    const newEvent = {
      id: this.nextEventId++,
      ...event,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.calendarEvents.push(newEvent);
    return newEvent;
  }

  async getAllCalendarEvents() {
    return this.calendarEvents;
  }

  async getCalendarEventsByDateRange(startDate: Date, endDate: Date) {
    return this.calendarEvents.filter(event => {
      const eventDate = new Date(event.eventDate);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  async getCalendarEvent(id: number) {
    return this.calendarEvents.find(event => event.id === id);
  }

  async updateCalendarEvent(id: number, data: any) {
    const index = this.calendarEvents.findIndex(event => event.id === id);
    if (index !== -1) {
      this.calendarEvents[index] = {
        ...this.calendarEvents[index],
        ...data,
        updatedAt: new Date()
      };
      return this.calendarEvents[index];
    }
    return null;
  }

  async deleteCalendarEvent(id: number) {
    const index = this.calendarEvents.findIndex(event => event.id === id);
    if (index !== -1) {
      this.calendarEvents.splice(index, 1);
      return true;
    }
    return false;
  }

  async checkDatabaseConnection() {
    return true; // Always connected since it's in-memory
  }

    async getUser(id: number): Promise<any | undefined> {
        return this.users.find(user => user.id === id);
    }

    async getUserByUsername(username: string): Promise<any | undefined> {
        return this.users.find(user => user.username === username);
    }

    async createUser(user: any): Promise<any> {
        const newUser = {
            id: this.nextUserId++,
            ...user,
            createdAt: new Date(),
            lastLogin: null
        };
        this.users.push(newUser);
        return newUser;
    }

    async updateUserLastLogin(id: number): Promise<any | undefined> {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            this.users[userIndex].lastLogin = new Date();
            return this.users[userIndex];
        }
        return undefined;
    }

    async verifyUserPassword(username: string, password: string): Promise<any | undefined> {
        const user = await this.getUserByUsername(username);
        if (!user) return undefined;
        // In memory storage, no password hashing.  This is a simplification for the example.
        if (user.password !== password) return undefined;
        return this.updateUserLastLogin(user.id);
    }

    async markCommentAsRead(id: number): Promise<any | undefined> {
        const commentIndex = this.comments.findIndex(comment => comment.id === id);
        if (commentIndex !== -1) {
            this.comments[commentIndex].isRead = true;
            return this.comments[commentIndex];
        }
        return undefined;
    }

    async deleteComment(id: number): Promise<boolean> {
        const index = this.comments.findIndex(comment => comment.id === id);
        if (index !== -1) {
            this.comments.splice(index, 1);
            return true;
        }
        return false;
    }

}

export const storage = new InMemoryStorage();