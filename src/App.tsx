import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WelcomeSection } from './components/WelcomeSection';
import { PalaceHalls } from './components/PalaceHalls';
import { VirtualRoyalTour } from './components/VirtualRoyalTour';
import { NightDesigner } from './components/NightDesigner';
import { GrandEntrance } from './components/GrandEntrance';
import { DateAvailability } from './components/DateAvailability';
import { HospitalitySection } from './components/HospitalitySection';
import { InstagramGallery } from './components/InstagramGallery';
import { RoyalInvitation } from './components/RoyalInvitation';
import { SmartBookingAssistant } from './components/SmartBookingAssistant';
import { AdminDashboard } from './components/AdminDashboard';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { Footer } from './components/Footer';
import { GoldenParticles } from './components/GoldenParticles';
import { initGlobalScrollTriggers } from './utils/gsapScrollTrigger';
import {
  PalaceDatabaseState,
  loadPalaceDatabase,
  savePalaceDatabase,
  PaymentTransaction
} from './db/palaceDatabase';
import { LeadCRM } from './data/palaceData';
import { playRoyalChime } from './utils/royalAudio';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [db, setDb] = useState<PalaceDatabaseState>(() => loadPalaceDatabase());
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Standalone Payment Gateway trigger state
  const [activePaymentModal, setActivePaymentModal] = useState<{
    open: boolean;
    amount: number;
    clientName: string;
    clientPhone: string;
    purpose: string;
    leadId?: string;
  }>({
    open: false,
    amount: 10000,
    clientName: '',
    clientPhone: '',
    purpose: ''
  });

  // Listen to hash changes for #admin strictly
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleCloseAdmin = () => {
    window.location.hash = '';
    setIsAdminOpen(false);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Global GSAP ScrollTrigger detection and staggered entrance animations
  useEffect(() => {
    const cleanup = initGlobalScrollTriggers(lang === 'ar');
    return () => cleanup();
  }, [lang]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleLang = () => {
    playRoyalChime(2, 0.8);
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddLead = (newLead: LeadCRM) => {
    const updated = {
      ...db,
      leads: [newLead, ...db.leads]
    };
    setDb(updated);
    savePalaceDatabase(updated);

    showToast(
      lang === 'ar'
        ? `تم تسجيل طلبكِ بنجاح يا ${newLead.name} 👑 ستتواصل معكِ التشريفات قريباً.`
        : `Thank you ${newLead.name} 👑 Your request is recorded.`
    );
  };

  const handleBookVisitAppointment = (details: any) => {
    const newLead: LeadCRM = {
      id: `lead-${Date.now()}`,
      name: details.name,
      phone: details.phone,
      occasion: 'معاينة ميدانية للقصر',
      date: details.date,
      guests: 400,
      hall: details.hall === 'both' ? 'كلا القاعتين' : details.hall === 'knights' ? 'قاعة الفرسان' : 'قاعة الملكات',
      theme: 'Royal Tour',
      estimatedBudget: 60000,
      status: 'visit_scheduled',
      notes: `حجز موعد زيارة: فترة ${details.time} - نوع الطلب: ${details.type}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    handleAddLead(newLead);
  };

  const handleOpenClientPayment = (details: any) => {
    setActivePaymentModal({
      open: true,
      amount: details.amount || 10000,
      clientName: details.name || 'عميلة قصر الملكات',
      clientPhone: details.phone || '+966500000000',
      purpose: details.purpose || 'عربون تأكيد حجز ليلة ملكية'
    });
  };

  const handleClientPaymentSuccess = (tx: PaymentTransaction) => {
    const updated = {
      ...db,
      payments: [tx, ...db.payments]
    };
    setDb(updated);
    savePalaceDatabase(updated);
    showToast(
      lang === 'ar'
        ? `تم سداد العربون بنجاح برقم عملية ${tx.transactionRef} 👑`
        : `Deposit confirmed: ${tx.transactionRef} 👑`
    );
  };

  return (
    <div className="min-h-screen bg-[#120B11] text-[#F8F5EE] relative selection:bg-[#C9A86A] selection:text-[#120B11]">
      {/* Floating Golden Stardust Particles Wow Effect */}
      <GoldenParticles />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1A0E18] border border-[#C9A86A] text-[#F8F5EE] px-5 py-3 rounded-full shadow-[0_0_30px_rgba(201,168,106,0.4)] flex items-center gap-2.5 text-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#C9A86A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenBooking={() => handleScrollToSection('date-availability')}
      />

      {/* 1. Cinematic Hero Opening */}
      <Hero
        lang={lang}
        heroConfig={db.siteConfig.hero}
        onExplore={() => handleScrollToSection('virtual-tour')}
        onDesignNight={() => handleScrollToSection('night-designer')}
      />

      {/* 2. Editorial Welcome */}
      <WelcomeSection lang={lang} />

      {/* 3. The Palace Ballrooms */}
      <PalaceHalls
        lang={lang}
        halls={db.halls}
        onBookHall={(hallName) => {
          handleScrollToSection('date-availability');
          showToast(
            lang === 'ar'
              ? `تم اختيار ${hallName} · حددي الموعد المتاح لزيارة القصر.`
              : `Selected ${hallName} · Choose your date.`
          );
        }}
      />

      {/* 4. Virtual Royal 360° Tour */}
      <VirtualRoyalTour lang={lang} nodes={db.tourNodes} />

      {/* 5. Design Your Royal Night */}
      <NightDesigner
        lang={lang}
        servicesList={db.nightServices}
        pricingDefaults={db.siteConfig.pricingDefaults}
        onLeadCreated={handleAddLead}
        onOpenPayment={handleOpenClientPayment}
      />

      {/* 6. The Grand Entrance */}
      <GrandEntrance lang={lang} styles={db.entranceStyles} />

      {/* 7. Live Date Availability & Calendar Booking */}
      <DateAvailability
        lang={lang}
        schedule={db.availabilitySchedule}
        onBookTour={handleBookVisitAppointment}
        onOpenPayment={handleOpenClientPayment}
      />

      {/* 8. Hospitality & Fine Dining Details */}
      <HospitalitySection lang={lang} items={db.hospitality} />

      {/* 9. Instagram Palace Live Gallery */}
      <InstagramGallery lang={lang} posts={db.instagramPosts} />

      {/* 10. Royal Digital Wedding Invitation */}
      <RoyalInvitation lang={lang} />

      {/* 11. Smart Booking Assistant */}
      <SmartBookingAssistant
        lang={lang}
        onNavigateSection={handleScrollToSection}
        onAddLead={handleAddLead}
      />

      {/* Admin Dashboard: Opens ONLY via #admin hash */}
      {isAdminOpen && (
        <AdminDashboard
          lang={lang}
          db={db}
          onUpdateDb={(newDb) => setDb(newDb)}
          onClose={handleCloseAdmin}
        />
      )}

      {/* Standalone Client Payment Modal */}
      {activePaymentModal.open && (
        <PaymentGatewayModal
          lang={lang}
          defaultAmount={activePaymentModal.amount}
          clientName={activePaymentModal.clientName}
          clientPhone={activePaymentModal.clientPhone}
          purpose={activePaymentModal.purpose}
          onSuccess={handleClientPaymentSuccess}
          onClose={() => setActivePaymentModal((prev) => ({ ...prev, open: false }))}
        />
      )}

      {/* Footer */}
      <Footer lang={lang} contact={db.siteConfig.contact} />
    </div>
  );
}
