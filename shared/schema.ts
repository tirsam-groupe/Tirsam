import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  wilaya: text("wilaya").notNull(),
  commune: text("commune").notNull(),
  businessType: text("business_type").notNull(), // commercant, artisan, fellah
  registrationNumber: text("registration_number"), // conditional field
  truckModel: text("truck_model").notNull(), // 3.5 or 6
  message: text("message"),
  nationalIdImage: text("national_id_image"), // صورة بطاقة التعريف الوطنية
  goldCardImage: text("gold_card_image"), // صورة الواجهة الأمامية للبطاقة الذهبية
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
}).extend({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  phone: z.string().min(1, "Le téléphone est requis"),
  email: z.string().email("Email invalide"),
  wilaya: z.string().min(1, "La wilaya est requise"),
  commune: z.string().min(1, "La commune est requise"),
  businessType: z.enum(["commercant", "artisan", "fellah"], {
    required_error: "Le type d'activité est requis"
  }),
  registrationNumber: z.string().optional(),
  truckModel: z.enum(["3.5", "6"], {
    required_error: "Le modèle de camion est requis"
  }),
  message: z.string().optional(),
  nationalIdImage: z.string().optional(),
  goldCardImage: z.string().optional(),
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
