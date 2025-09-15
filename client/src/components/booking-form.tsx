import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertBookingSchema, type InsertBooking } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ALGERIAN_WILAYAS, BUSINESS_TYPES, TRUCK_MODELS } from '@/lib/constants';
import { Upload, CreditCard, IdCard } from 'lucide-react';

export default function BookingForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
  const [goldCardFile, setGoldCardFile] = useState<File | null>(null);

  const form = useForm<InsertBooking>({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      wilaya: '',
      commune: '',
      businessType: undefined,
      registrationNumber: '',
      truckModel: undefined,
      message: '',
      nationalIdImage: '',
      goldCardImage: '',
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: InsertBooking) => {
      const response = await apiRequest('POST', '/api/bookings', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Réservation confirmée!",
        description: "Votre demande de réservation a été soumise avec succès. Nous vous contacterons bientôt.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la soumission de votre réservation.",
      });
    },
  });

  const businessType = form.watch('businessType');

  const handleFileUpload = (type: 'nationalId' | 'goldCard', file: File | null) => {
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "La taille du fichier ne doit pas dépasser 5MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        // Compress base64 by reducing quality (simple compression)
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Resize if too large
          const maxWidth = 800;
          const maxHeight = 600;
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to 0.7 quality
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            
            if (type === 'nationalId') {
              setNationalIdFile(file);
              form.setValue('nationalIdImage', compressedBase64);
            } else {
              setGoldCardFile(file);
              form.setValue('goldCardImage', compressedBase64);
            }
          }
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: InsertBooking) => {
    bookingMutation.mutate(data);
  };

  return (
    <section id="Formulaire" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="block rtl-text mb-2">املأ الاستمارة الآن لتأكيد طلبك</span>
              <span className="block">Complétez le formulaire pour passer commande dès maintenant</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              <span className="block rtl-text mb-2">كن من الأوائل في حجز شاحنتك واستفد من عروض الإطلاق الحصرية</span>
              <span className="block">Soyez parmi les premiers à réserver votre camion et profitez d'offres exclusives de lancement.</span>
            </p>
            <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg inline-block">
              <span className="block rtl-text mb-1">التسجيلات المكررة تلغى تلقائيا</span>
              <span className="block">les inscriptions en double sont automatiquement annulées.</span>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8 border border-border">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span>Prénom *</span>
                        <span className="rtl-text text-muted-foreground ml-2">الإسم</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          data-testid="input-firstName"
                          placeholder=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span>Nom *</span>
                        <span className="rtl-text text-muted-foreground ml-2">اللقب</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          data-testid="input-lastName"
                          placeholder=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span>Téléphone *</span>
                        <span className="rtl-text text-muted-foreground ml-2">رقم الهاتف</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="tel"
                          data-testid="input-phone"
                          placeholder=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span>Email *</span>
                        <span className="rtl-text text-muted-foreground ml-2">البريد الإلكتروني</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          data-testid="input-email"
                          placeholder=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Wilaya */}
                <FormField
                  control={form.control}
                  name="wilaya"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span>Wilaya *</span>
                        <span className="rtl-text text-muted-foreground ml-2">الولاية</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-wilaya">
                            <SelectValue placeholder="Votre wilaya" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ALGERIAN_WILAYAS.map((wilaya) => (
                            <SelectItem key={wilaya.value} value={wilaya.value}>
                              {wilaya.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Commune */}
                <FormField
                  control={form.control}
                  name="commune"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span>La commune *</span>
                        <span className="rtl-text text-muted-foreground ml-2">البلدية</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          data-testid="input-commune"
                          placeholder=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business Type */}
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        <span>Vous êtes *</span>
                        <span className="rtl-text text-muted-foreground ml-2">نوع النشاط</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-businessType">
                            <SelectValue placeholder="Votre activité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BUSINESS_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditional Registration Number Field */}
                {businessType && (
                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>
                          {businessType === 'artisan' && (
                            <>
                              <span>N° de la carte d'artisan *</span>
                              <span className="rtl-text text-muted-foreground ml-2">رقم بطاقة الحرفي</span>
                            </>
                          )}
                          {businessType === 'fellah' && (
                            <>
                              <span>N° de la carte Fellah *</span>
                              <span className="rtl-text text-muted-foreground ml-2">رقم بطاقة الفلاح</span>
                            </>
                          )}
                          {businessType === 'commercant' && (
                            <>
                              <span>N° de Registre du Commerce *</span>
                              <span className="rtl-text text-muted-foreground ml-2">رقم السجل التجاري</span>
                            </>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            data-testid="input-registrationNumber"
                            placeholder=""
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Truck Model */}
                <FormField
                  control={form.control}
                  name="truckModel"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        <span>Modèle souhaité *</span>
                        <span className="rtl-text text-muted-foreground ml-2">النموذج المطلوب</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-truckModel">
                            <SelectValue placeholder="Sélectionnez un modèle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRUCK_MODELS.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Upload Fields */}
                <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                  {/* National ID Upload */}
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
                    <IdCard className="mx-auto h-12 w-12 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">
                      <span className="block">Carte d'identité nationale *</span>
                      <span className="block text-sm rtl-text text-muted-foreground">بطاقة التعريف الوطنية</span>
                    </h3>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('nationalId', e.target.files?.[0] || null)}
                      className="hidden"
                      id="national-id-upload"
                      data-testid="input-national-id"
                    />
                    <label 
                      htmlFor="national-id-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      رفع الصورة
                    </label>
                    {nationalIdFile && (
                      <p className="mt-2 text-sm text-green-600">
                        ✓ {nationalIdFile.name}
                      </p>
                    )}
                  </div>

                  {/* Gold Card Upload */}
                  <div className="border-2 border-dashed border-accent/30 rounded-lg p-6 text-center">
                    <CreditCard className="mx-auto h-12 w-12 text-accent mb-4" />
                    <h3 className="font-semibold mb-2">
                      <span className="block">Carte dorée (face avant) *</span>
                      <span className="block text-sm rtl-text text-muted-foreground">الواجهة الأمامية للبطاقة الذهبية</span>
                    </h3>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('goldCard', e.target.files?.[0] || null)}
                      className="hidden"
                      id="gold-card-upload"
                      data-testid="input-gold-card"
                    />
                    <label 
                      htmlFor="gold-card-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-accent text-accent rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      رفع الصورة
                    </label>
                    {goldCardFile && (
                      <p className="mt-2 text-sm text-green-600">
                        ✓ {goldCardFile.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        <span>Message</span>
                        <span className="rtl-text text-muted-foreground ml-2">اكتب رسالتك هنا</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={4}
                          data-testid="textarea-message"
                          placeholder=""
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Consent Checkbox */}
              <div className="mb-8">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    required 
                    data-testid="checkbox-consent"
                    className="mt-1"
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <span className="block rtl-text mb-2">أنا أوافق على معالجة معلوماتي بأمان واستخدامها فقط لأغراض هذا الطلب، وفقًا للقانون الجزائري رقم 18-07 المتعلق بحماية البيانات الشخصية</span>
                    <span className="block">J'accepte que mes informations soient traitées en toute sécurité et utilisées uniquement aux fins de cette commande, conformément à la loi algérienne n° 18-07 relative à la protection des données personnelles</span>
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button 
                  type="submit" 
                  disabled={bookingMutation.isPending}
                  data-testid="button-submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-12 py-4 text-lg h-auto"
                >
                  {bookingMutation.isPending ? (
                    <span>En cours...</span>
                  ) : (
                    <>
                      <span className="block">S'inscrire</span>
                      <span className="block rtl-text text-sm opacity-90">سجّل الآن</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
