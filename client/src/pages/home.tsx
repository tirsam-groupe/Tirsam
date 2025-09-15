import React from 'react';
import { SiFacebook, SiLinkedin, SiInstagram, SiTiktok, SiYoutube } from 'react-icons/si';
import HeroSection from '@/components/hero-section';
import TruckModels from '@/components/truck-models';
import BookingForm from '@/components/booking-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <TruckModels />
        <BookingForm />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="logo-container">
              <img
                src="/assets/tirsam-logo.png"
                alt="TIRSAM"
                className="mx-auto mb-6"
              />
            </div>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Leader dans la fabrication et distribution de camions<br/>
              et engins de construction de haute qualité
            </p>

            {/* Social Media Icons */}
            <div className="flex justify-center space-x-6 mb-8">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook" 
                className="w-10 h-10 border-2 border-accent rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background" 
                data-testid="link-facebook"
              >
                <SiFacebook className="text-accent hover:text-accent-foreground text-lg" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn" 
                className="w-10 h-10 border-2 border-accent rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background" 
                data-testid="link-linkedin"
              >
                <SiLinkedin className="text-accent hover:text-accent-foreground text-lg" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram" 
                className="w-10 h-10 border-2 border-accent rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background" 
                data-testid="link-instagram"
              >
                <SiInstagram className="text-accent hover:text-accent-foreground text-lg" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="TikTok" 
                className="w-10 h-10 border-2 border-accent rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background" 
                data-testid="link-tiktok"
              >
                <SiTiktok className="text-accent hover:text-accent-foreground text-lg" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube" 
                className="w-10 h-10 border-2 border-accent rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background" 
                data-testid="link-youtube"
              >
                <SiYoutube className="text-accent hover:text-accent-foreground text-lg" />
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* Siège social */}
            <div>
              <h3 className="font-bold text-lg mb-3">Siège social et usine:</h3>
              <p className="text-gray-300">
                Zone industrielle Kechida, Batna 05000 – Algérie
              </p>
            </div>

            {/* Email */}
            <div>
              <h3 className="font-bold text-lg mb-3">Email:</h3>
              <p className="text-gray-300">
                commercial2@tirsam.com
              </p>
            </div>

            {/* Mobile */}
            <div>
              <h3 className="font-bold text-lg mb-3">Mobile:</h3>
              <div className="text-gray-300 space-y-1">
                <p>+213 (0)664251175</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              TIRSAM - Tout droit réservé © 2025 | Conçu et développé par
              <span className="text-accent ml-1">HiveDigit</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}