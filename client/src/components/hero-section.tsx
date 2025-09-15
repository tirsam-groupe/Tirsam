
import React from 'react';

export default function HeroSection() {
  const scrollToForm = () => {
    const formElement = document.getElementById('Formulaire');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      className="relative text-white min-h-screen flex flex-col overflow-hidden"
      style={{
        backgroundImage: `url('/assets/new-hero-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Top Section - Logo */}
      <div className="container mx-auto px-4 pt-8">
        <div className="flex justify-center">
          <div className="logo-container">
            <img
              src="/assets/tirsam-logo.png"
              alt="TIRSAM"
              className="h-16 md:h-20"
            />
          </div>
        </div>
      </div>
      {/* Bottom Section - Button */}
      <div className="container mx-auto px-4 pb-20 text-center relative z-10">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={scrollToForm}
            data-testid="button-commander-maintenant"
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-12 py-4 rounded-lg text-xl shadow-lg transition-all duration-200"
          >
            Commander maintenant
          </button>
        </div>
      </div>
    </section>
  );
}
