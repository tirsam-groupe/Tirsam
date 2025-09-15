import { type Booking, type InsertBooking } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getBooking(id: string): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class MemStorage implements IStorage {
  private bookings: Map<string, Booking>;

  constructor() {
    this.bookings = new Map();
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { 
      ...insertBooking, 
      id,
      registrationNumber: insertBooking.registrationNumber || null,
      message: insertBooking.message || null,
      nationalIdImage: insertBooking.nationalIdImage || null,
      goldCardImage: insertBooking.goldCardImage || null,
      createdAt: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }
}

export const storage = new MemStorage();
