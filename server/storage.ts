// Based on javascript_log_in_with_replit blueprint
import {
  users,
  malls,
  visits,
  type User,
  type UpsertUser,
  type Mall,
  type Visit,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Mall operations
  getAllMalls(): Promise<Mall[]>;
  getMall(id: number): Promise<Mall | undefined>;
  
  // Visit operations
  getUserVisits(userId: string): Promise<Visit[]>;
  getVisit(userId: string, mallId: number): Promise<Visit | undefined>;
  incrementVisit(userId: string, mallId: number): Promise<Visit>;
  decrementVisit(userId: string, mallId: number): Promise<Visit>;
  resetAllVisits(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Mall operations
  
  async getAllMalls(): Promise<Mall[]> {
    return await db.select().from(malls).orderBy(malls.id);
  }

  async getMall(id: number): Promise<Mall | undefined> {
    const [mall] = await db.select().from(malls).where(eq(malls.id, id));
    return mall;
  }

  // Visit operations
  
  async getUserVisits(userId: string): Promise<Visit[]> {
    return await db.select().from(visits).where(eq(visits.userId, userId));
  }

  async getVisit(userId: string, mallId: number): Promise<Visit | undefined> {
    const [visit] = await db
      .select()
      .from(visits)
      .where(and(eq(visits.userId, userId), eq(visits.mallId, mallId)));
    return visit;
  }

  async incrementVisit(userId: string, mallId: number): Promise<Visit> {
    const existingVisit = await this.getVisit(userId, mallId);
    
    if (existingVisit) {
      const [updatedVisit] = await db
        .update(visits)
        .set({
          visitCount: existingVisit.visitCount + 1,
          lastVisitedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(visits.id, existingVisit.id))
        .returning();
      return updatedVisit;
    } else {
      const [newVisit] = await db
        .insert(visits)
        .values({
          userId,
          mallId,
          visitCount: 1,
          lastVisitedAt: new Date(),
        })
        .returning();
      return newVisit;
    }
  }

  async decrementVisit(userId: string, mallId: number): Promise<Visit> {
    const existingVisit = await this.getVisit(userId, mallId);
    
    if (!existingVisit) {
      throw new Error("Visit not found");
    }
    
    if (existingVisit.visitCount <= 0) {
      throw new Error("Visit count is already 0");
    }
    
    const [updatedVisit] = await db
      .update(visits)
      .set({
        visitCount: existingVisit.visitCount - 1,
        updatedAt: new Date(),
      })
      .where(eq(visits.id, existingVisit.id))
      .returning();
    return updatedVisit;
  }

  async resetAllVisits(userId: string): Promise<void> {
    await db.delete(visits).where(eq(visits.userId, userId));
  }
}

export const storage = new DatabaseStorage();
