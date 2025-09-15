import React from 'react';

export default function TruckModels() {
  const scrollToForm = () => {
    const formElement = document.getElementById('Formulaire');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nos modèles disponibles
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez notre gamme de camions conçus pour répondre à tous vos besoins de transport
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* 3.5 Ton Truck */}
          <div className="truck-card bg-white rounded-xl overflow-hidden shadow-lg" data-testid="card-truck-35">
            <img 
              src="/assets/truck.png" 
              alt="Camion 3.5 tonnes" 
              className="w-full h-64 object-cover"
              data-testid="img-truck-35" 
            />
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                <span className="block" data-testid="text-model-35-fr">Camion 3.5 tonnes</span>
                <span className="block text-lg rtl-text text-muted-foreground" data-testid="text-model-35-ar">شاحنة 3.5 طن</span>
              </h3>
              <p className="text-muted-foreground mb-6">
                <span className="block mb-2">Idéal pour les livraisons urbaines et transport léger</span>
                <span className="block rtl-text">مثالي للتوصيل داخل المدن والنقل الخفيف</span>
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">À partir de</span>
                  <div className="price-badge text-accent-foreground font-bold text-2xl px-4 py-2 rounded-lg inline-block" data-testid="text-price-35">
                    3 900 000 DZD TTC*
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6 Ton Truck */}
          <div className="truck-card bg-white rounded-xl overflow-hidden shadow-lg" data-testid="card-truck-6">
            <img 
              src="/assets/truck.png" 
              alt="Camion 6 tonnes" 
              className="w-full h-64 object-cover"
              data-testid="img-truck-6" 
            />
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                <span className="block" data-testid="text-model-6-fr">Camion 6 tonnes</span>
                <span className="block text-lg rtl-text text-muted-foreground" data-testid="text-model-6-ar">شاحنة 6 طن</span>
              </h3>
              <p className="text-muted-foreground mb-6">
                <span className="block mb-2">Le choix optimal pour les professionnels du transport</span>
                <span className="block rtl-text">الخيار الأمثل لمحترفي النقل</span>
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">À partir de</span>
                  <div className="price-badge text-accent-foreground font-bold text-2xl px-4 py-2 rounded-lg inline-block" data-testid="text-price-6">
                    4 600 000 DZD TTC*
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Robustesse, confort et efficacité : nos camions répondent à tous vos défis quotidiens.
          </p>
          <button 
            onClick={scrollToForm}
            data-testid="button-reserver-maintenant"
            className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-lg transition-colors duration-200 text-lg"
          >
            Réserver maintenant
          </button>
        </div>
      </div>
    </section>
  );
}
