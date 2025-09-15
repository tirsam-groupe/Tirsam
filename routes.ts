import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";

// Telegram notification function
async function sendTelegramNotification(booking: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!token || !chatId) {
    console.warn("Telegram credentials not configured");
    return;
  }

  const message = `
🚛 *طلب حجز جديد - New Booking Request*

👤 *الاسم / Name:* ${booking.firstName} ${booking.lastName}
📞 *الهاتف / Phone:* ${booking.phone}  
✉️ *البريد الإلكتروني / Email:* ${booking.email}
📍 *الولاية / Wilaya:* ${booking.wilaya}
🏘️ *البلدية / Commune:* ${booking.commune}
💼 *نوع النشاط / Business Type:* ${booking.businessType}
${booking.registrationNumber ? `📋 *رقم التسجيل / Registration:* ${booking.registrationNumber}` : ''}
🚚 *نموذج الشاحنة / Truck Model:* ${booking.truckModel} طن
${booking.message ? `💬 *الرسالة / Message:* ${booking.message}` : ''}
  `.trim();

  try {
    // Send the text message first
    const textResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!textResponse.ok) {
      throw new Error(`Failed to send text message: ${textResponse.statusText}`);
    }

    // Send national ID image if present
    if (booking.nationalIdImage) {
      const imageBuffer = Buffer.from(booking.nationalIdImage.split(',')[1], 'base64');
      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('photo', new Blob([imageBuffer], { type: 'image/jpeg' }), 'national_id.jpg');
      formData.append('caption', '📋 صورة بطاقة التعريف الوطنية - National ID Card');

      const idResponse = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        body: formData,
      });

      if (!idResponse.ok) {
        console.warn(`Failed to send national ID image: ${idResponse.statusText}`);
      }
    }

    // Send business registration image if present
    if (booking.goldCardImage) {
      const imageBuffer = Buffer.from(booking.goldCardImage.split(',')[1], 'base64');
      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('photo', new Blob([imageBuffer], { type: 'image/jpeg' }), 'business_registration.jpg');
      formData.append('caption', '💳 صورة السجل التجاري - Business Registration');

      const regResponse = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        body: formData,
      });

      if (!regResponse.ok) {
        console.warn(`Failed to send business registration image: ${regResponse.statusText}`);
      }
    }

    console.log("Telegram notification sent successfully");
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all bookings (for admin purposes)
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des réservations" });
    }
  });

  // Create new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Check for required registration number based on business type
      if (validatedData.businessType === "commercant" && !validatedData.registrationNumber) {
        return res.status(400).json({ 
          message: "Le numéro de registre du commerce est requis pour les commerçants" 
        });
      }
      if (validatedData.businessType === "artisan" && !validatedData.registrationNumber) {
        return res.status(400).json({ 
          message: "Le numéro de carte d'artisan est requis pour les artisans" 
        });
      }
      if (validatedData.businessType === "fellah" && !validatedData.registrationNumber) {
        return res.status(400).json({ 
          message: "Le numéro de carte fellah est requis pour les fellahs/éleveurs" 
        });
      }

      // Check for duplicate registrations (same email + phone)
      const existingBookings = await storage.getAllBookings();
      const isDuplicate = existingBookings.some(booking => 
        booking.email === validatedData.email && booking.phone === validatedData.phone
      );

      if (isDuplicate) {
        return res.status(400).json({ 
          message: "Une réservation avec ce téléphone et email existe déjà. Les inscriptions en double sont automatiquement annulées." 
        });
      }

      // Create booking
      const newBooking = await storage.createBooking(validatedData);
      
      // Send Telegram notification
      await sendTelegramNotification(newBooking);
      
      res.status(201).json({
        message: "Réservation créée avec succès",
        booking: newBooking
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données invalides",
          errors: error.errors
        });
      }
      
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Erreur lors de la création de la réservation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
