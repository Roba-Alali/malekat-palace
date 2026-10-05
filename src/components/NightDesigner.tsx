import React, { useState } from 'react';
import { Wand2, Users, Check, Send, ChevronRight, ChevronLeft, Calculator, CreditCard } from 'lucide-react';
import { playRoyalChime } from '../utils/royalAudio';
import queensBallroomImg from '@/src/assets/images/queens_ballroom_interior_1791122482334.jpg';
import heroBallroomImg from '@/src/assets/images/hero_royal_ballroom_1791122453291.jpg';
import { NightService, SiteConfig } from '../db/palaceDatabase';

interface NightDesignerProps {
  lang: 'ar' | 'en';
  servicesList?: NightService[];
  pricingDefaults?: SiteConfig['pricingDefaults'];
  onLeadCreated?: (leadData: any) => void;
  onOpenPayment?: (details: any) => void;
}

export const NightDesigner: React.FC<NightDesignerProps> = ({
  lang,
  servicesList,
  pricingDefaults,
  onLeadCreated,
  onOpenPayment
}) => {
  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState('wedding');
  const [guests, setGuests] = useState(400);
  const [hallSelection, setHallSelection] = useState<'queens' | 'knights' | 'both'>('queens');
  const [atmosphere, setAtmosphere] = useState('royal');
  const [colorTheme, setColorTheme] = useState('gold');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'staircase_flowers',
    'cold_pyro',
    'royal_trolley'
  ]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const occasions = [
    { id: 'wedding', labelAr: '💍 حفل زفاف ملكي', labelEn: '💍 Royal Wedding', descAr: 'اليوم الأكبر في العمر', descEn: 'The biggest night of your life' },
    { id: 'engagement', labelAr: '🌸 حفل خطوبة واستقبال', labelEn: '🌸 Engagement Gala', descAr: 'أجواء رومانسية حميمية', descEn: 'Romantic intimate atmosphere' },
    { id: 'graduation', labelAr: '🎓 احتفال تخرج فاخر', labelEn: '🎓 Graduation Banquet', descAr: 'بهجة النجاح والتميز', descEn: 'Celebrating supreme milestones' },
    { id: 'gala', labelAr: '✨ مناسبة خاصة ومؤتمر VIP', labelEn: '✨ Private Royal Gala', descAr: 'استقبال كبار الشخصيات', descEn: 'VIP diplomatic reception' }
  ];

  const atmospheres = [
    { id: 'royal', labelAr: 'الملكي الفخم (Royal Imperial)', labelEn: 'Royal Imperial', descAr: 'ثريات ذهبية، وأعمدة كلاسيكية، وستائر مخملية', descEn: 'Gilded chandeliers, classical columns, velvet luxury' },
    { id: 'romantic', labelAr: 'الرومانسي الحالم (Romantic Blush)', labelEn: 'Romantic Blush', descAr: 'ورود طبيعية باستيل، شموع ناعمة، وإضاءة خافتة', descEn: 'Pastel florals, scented candles, warm mood glow' },
    { id: 'modern', labelAr: 'العصري الأنيق (Modern Elegance)', labelEn: 'Modern Elegance', descAr: 'خطوط معمارية نقية، شاشات كريستالية، ولمسات فضية', descEn: 'Clean architectural lines, crystal panels, silver accents' },
    { id: 'classic', labelAr: 'الكلاسيكي الفرنسي (French Classic)', labelEn: 'French Classic', descAr: 'نقوش الباروك والروكوكو مع مرايا مذهبة فخمة', descEn: 'Baroque and rococo mouldings with antique mirrors' }
  ];

  const colors = [
    { id: 'gold', nameAr: 'الذهب والشمبانيا', nameEn: 'Champagne Gold & Ivory', hex: '#C9A86A' },
    { id: 'blush', nameAr: 'الوردي والبلش الناعم', nameEn: 'Soft Blush & Rose', hex: '#E8C7CE' },
    { id: 'white', nameAr: 'الأبيض النقي والكريستال', nameEn: 'Pure White & Crystal', hex: '#FFFFFF' },
    { id: 'lavender', nameAr: 'اللافندر والبنفسج الملكي', nameEn: 'Royal Lavender & Orchid', hex: '#9B72AA' }
  ];

  const activeServices = servicesList && servicesList.length > 0 ? servicesList : [];

  const toggleService = (id: string) => {
    playRoyalChime(2, 0.8);
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  // Pricing calculation
  const baseHallPrice =
    hallSelection === 'both'
      ? pricingDefaults?.bothHallsBase || 65000
      : hallSelection === 'knights'
      ? pricingDefaults?.knightsHallBase || 28000
      : pricingDefaults?.queensHallBase || 45000;

  const cateringPerGuest = pricingDefaults?.cateringPerGuest || 120;
  const totalCatering = guests * cateringPerGuest;
  const servicesTotal = selectedServices.reduce((acc, id) => {
    const s = activeServices.find(item => item.id === id);
    return acc + (s ? s.price : 0);
  }, 0);
  const estimatedTotal = baseHallPrice + totalCatering + servicesTotal;

  const handleNextStep = () => {
    playRoyalChime(step + 1, 1.2);
    setStep(prev => Math.min(5, prev + 1));
  };

  const handlePrevStep = () => {
    playRoyalChime(step, 0.8);
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    playRoyalChime(5, 2.5);
    const newLead = {
      id: `lead-${Date.now()}`,
      name,
      phone,
      occasion: occasions.find(o => o.id === occasion)?.labelAr || occasion,
      date: date || '2026-11-20',
      guests,
      hall: hallSelection === 'both' ? 'قاعة الملكات + قاعة الفرسان' : hallSelection === 'knights' ? 'قاعة الفرسان' : 'قاعة الملكات',
      theme: atmospheres.find(a => a.id === atmosphere)?.labelAr || atmosphere,
      estimatedBudget: estimatedTotal,
      status: 'new',
      notes: `اختيارات مصمم ليلة الملكات: ثيم ${colorTheme}، خدمات: ${selectedServices.join(', ')}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (onLeadCreated) {
      onLeadCreated(newLead);
    }
    setSubmitted(true);
  };

  const generateWhatsAppLink = () => {
    const occLabel = occasions.find(o => o.id === occasion)?.labelAr;
    const atmLabel = atmospheres.find(a => a.id === atmosphere)?.labelAr;
    const colLabel = colors.find(c => c.id === colorTheme)?.nameAr;
    const hallLabel = hallSelection === 'both' ? 'كلا القاعتين' : hallSelection === 'knights' ? 'قاعة الفرسان' : 'قاعة الملكات';

    const text = `السلام عليكم ورحمة الله،
أود الاستفسار وحجز ليلة ملكية في *قصر الملكات*:
• *الاسم*: ${name || 'عميل كريم'}
• *نوع المناسبة*: ${occLabel}
• *التاريخ المقترح*: ${date || 'نهاية 2026'}
• *عدد الضيوف*: ${guests} ضيف/ضيفة
• *القاعة المفضلة*: ${hallLabel}
• *الطابع العام*: ${atmLabel}
• *لوحة الألوان*: ${colLabel}
• *التقدير المبدئي التقديري*: ${estimatedTotal.toLocaleString()} ريال

أرجو تزويدي بالموعد المتاح لزيارة القصر والمعاينة الميدانية. شكراً لكم ✨👑`;

    return `https://wa.me/966500000000?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="night-designer" className="relative py-28 bg-[#150D14] text-[#F8F5EE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A86A] mb-3 font-semibold font-serif-en">
            <Wand2 className="w-4 h-4 text-[#C9A86A]" />
            <span>{lang === 'ar' ? 'مصمم ليلتك الملكية التفاعلي' : 'INTERACTIVE ROYAL NIGHT DESIGNER'}</span>
          </div>
          <h2 className="font-royal text-3xl sm:text-5xl text-white font-bold leading-tight">
            {lang === 'ar' ? 'صممي ليلتك قبل أن تحجزيها' : 'Design Your Royal Night First'}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#D4C4AB] font-light">
            {lang === 'ar'
              ? 'حددي تفاصيل مناسبتك، عدد الضيوف، الأجواء ولائحة الخدمات الإضافية لتشاهدي تصميماً فورياً مع تقدير تكلفة شفاف ومباشر.'
              : 'Choose your occasion, guest capacity, aesthetic tone, and bespoke services for an instant visual preview & transparent quote.'}
          </p>

          {/* Stepper Indicator */}
          <div className="mt-8 flex items-center justify-center gap-2 max-w-md mx-auto">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                onClick={() => setStep(s)}
                className={`h-2 flex-1 rounded-full cursor-pointer transition-all ${
                  step === s
                    ? 'bg-[#C9A86A] shadow-[0_0_12px_rgba(201,168,106,0.5)]'
                    : step > s
                    ? 'bg-[#C9A86A]/50'
                    : 'bg-white/10'
                }`}
                title={`Step ${s}`}
              />
            ))}
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-[#1A0E18] border border-[#C9A86A]/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            {/* Step 1: Occasion */}
            {step === 1 && (
              <div className="animate-in fade-in duration-300">
                <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold block mb-2">
                  {lang === 'ar' ? 'الخطوة الأولى' : 'STEP 01'}
                </span>
                <h3 className="font-royal text-2xl text-white font-bold mb-6">
                  {lang === 'ar' ? 'ما نوع مناسبتك السعيدة؟' : 'What is your royal occasion?'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {occasions.map((occ) => (
                    <button
                      key={occ.id}
                      onClick={() => {
                        playRoyalChime(2, 0.8);
                        setOccasion(occ.id);
                      }}
                      className={`p-5 rounded-xl text-right transition-all border ${
                        occasion === occ.id
                          ? 'border-[#C9A86A] bg-[#C9A86A]/15 shadow-[0_0_20px_rgba(201,168,106,0.15)] text-white'
                          : 'border-white/10 bg-[#160B14] text-[#D0C2A8] hover:border-[#C9A86A]/40'
                      }`}
                    >
                      <div className="font-bold text-base text-[#F8F5EE]">
                        {lang === 'ar' ? occ.labelAr : occ.labelEn}
                      </div>
                      <div className="text-xs text-[#C5B49C] mt-1 font-light">
                        {lang === 'ar' ? occ.descAr : occ.descEn}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs text-[#C5B49C]">
                    {lang === 'ar' ? 'اختاري المناسبة للمتابعة' : 'Select an occasion to proceed'}
                  </span>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded bg-[#C9A86A] text-[#120B11] font-semibold text-xs hover:bg-[#E8CF99] transition-all flex items-center gap-1.5"
                  >
                    <span>{lang === 'ar' ? 'التالي: عدد الضيوف والقاعة' : 'Next: Guests & Hall'}</span>
                    <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Guests & Hall */}
            {step === 2 && (
              <div className="animate-in fade-in duration-300">
                <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold block mb-2">
                  {lang === 'ar' ? 'الخطوة الثانية' : 'STEP 02'}
                </span>
                <h3 className="font-royal text-2xl text-white font-bold mb-6">
                  {lang === 'ar' ? 'كم عدد ضيوفك الكرام؟' : 'Estimated Number of Guests?'}
                </h3>

                <div className="bg-[#150B13] p-6 rounded-xl border border-white/10 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-[#C9A86A] flex items-center gap-1.5 font-medium">
                      <Users className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'عدد الحضور المقدر' : 'Guest Count'}</span>
                    </span>
                    <span className="font-royal text-3xl font-bold text-white tabular-nums">
                      {guests} <span className="text-xs font-sans text-[#C9A86A]">{lang === 'ar' ? 'ضيف' : 'Guests'}</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="800"
                    step="25"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full accent-[#C9A86A] h-2 bg-white/15 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-white/40 mt-2">
                    <span>100 ضيف</span>
                    <span>450 متوسط</span>
                    <span>800 ضيف</span>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-white mb-3">
                  {lang === 'ar' ? 'أي قاعات القصر ترغبين بحجزها؟' : 'Preferred Palace Ballroom?'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      playRoyalChime(2, 0.8);
                      setHallSelection('queens');
                    }}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      hallSelection === 'queens'
                        ? 'border-[#C9A86A] bg-[#C9A86A]/20 text-white font-bold'
                        : 'border-white/10 bg-[#160B14] text-[#D0C2A8] hover:border-[#C9A86A]/40'
                    }`}
                  >
                    <div className="text-sm">{lang === 'ar' ? 'قاعة الملكات' : 'Queens Hall'}</div>
                    <div className="text-[11px] text-[#C9A86A] mt-1">{lang === 'ar' ? 'سيدات (حتى 750)' : 'Women (Up to 750)'}</div>
                  </button>

                  <button
                    onClick={() => {
                      playRoyalChime(2, 0.8);
                      setHallSelection('knights');
                    }}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      hallSelection === 'knights'
                        ? 'border-[#C9A86A] bg-[#C9A86A]/20 text-white font-bold'
                        : 'border-white/10 bg-[#160B14] text-[#D0C2A8] hover:border-[#C9A86A]/40'
                    }`}
                  >
                    <div className="text-sm">{lang === 'ar' ? 'قاعة الفرسان' : 'Knights Hall'}</div>
                    <div className="text-[11px] text-[#C9A86A] mt-1">{lang === 'ar' ? 'رجال (حتى 500)' : 'Men (Up to 500)'}</div>
                  </button>

                  <button
                    onClick={() => {
                      playRoyalChime(3, 0.8);
                      setHallSelection('both');
                    }}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      hallSelection === 'both'
                        ? 'border-[#C9A86A] bg-[#C9A86A]/20 text-white font-bold'
                        : 'border-white/10 bg-[#160B14] text-[#D0C2A8] hover:border-[#C9A86A]/40'
                    }`}
                  >
                    <div className="text-sm">{lang === 'ar' ? 'كلا القاعتين معاً' : 'Both Grand Halls'}</div>
                    <div className="text-[11px] text-[#C9A86A] mt-1">{lang === 'ar' ? 'حفل كامل مستقل' : 'Full Royal Suite'}</div>
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                  <button onClick={handlePrevStep} className="px-4 py-2 rounded text-xs text-[#D0C2A8] hover:text-white flex items-center gap-1">
                    <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                    <span>{lang === 'ar' ? 'السابق' : 'Back'}</span>
                  </button>
                  <button onClick={handleNextStep} className="px-6 py-2.5 rounded bg-[#C9A86A] text-[#120B11] font-semibold text-xs hover:bg-[#E8CF99] transition-all flex items-center gap-1.5">
                    <span>{lang === 'ar' ? 'التالي: الأجواء والطابع' : 'Next: Atmosphere'}</span>
                    <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Atmosphere */}
            {step === 3 && (
              <div className="animate-in fade-in duration-300">
                <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold block mb-2">
                  {lang === 'ar' ? 'الخطوة الثالثة' : 'STEP 03'}
                </span>
                <h3 className="font-royal text-2xl text-white font-bold mb-6">
                  {lang === 'ar' ? 'اختاري طابع وأجواء ليلتك' : 'Select The Visual Atmosphere'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {atmospheres.map((atm) => (
                    <button
                      key={atm.id}
                      onClick={() => {
                        playRoyalChime(3, 0.8);
                        setAtmosphere(atm.id);
                      }}
                      className={`p-5 rounded-xl text-right transition-all border ${
                        atmosphere === atm.id
                          ? 'border-[#C9A86A] bg-[#C9A86A]/20 text-white shadow-[0_0_20px_rgba(201,168,106,0.15)] font-bold'
                          : 'border-white/10 bg-[#160B14] text-[#D0C2A8] hover:border-[#C9A86A]/40'
                      }`}
                    >
                      <div className="text-base text-[#F8F5EE]">{lang === 'ar' ? atm.labelAr : atm.labelEn}</div>
                      <div className="text-xs text-[#C5B49C] mt-2 font-light">{lang === 'ar' ? atm.descAr : atm.descEn}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                  <button onClick={handlePrevStep} className="px-4 py-2 rounded text-xs text-[#D0C2A8] hover:text-white flex items-center gap-1">
                    <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                    <span>{lang === 'ar' ? 'السابق' : 'Back'}</span>
                  </button>
                  <button onClick={handleNextStep} className="px-6 py-2.5 rounded bg-[#C9A86A] text-[#120B11] font-semibold text-xs hover:bg-[#E8CF99] transition-all flex items-center gap-1.5">
                    <span>{lang === 'ar' ? 'التالي: لوحة الألوان' : 'Next: Palette'}</span>
                    <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Color Palette */}
            {step === 4 && (
              <div className="animate-in fade-in duration-300">
                <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold block mb-2">
                  {lang === 'ar' ? 'الخطوة الرابعة' : 'STEP 04'}
                </span>
                <h3 className="font-royal text-2xl text-white font-bold mb-6">
                  {lang === 'ar' ? 'اختاري لوحة ألوان الزهور والديكور' : 'Select Your Royal Color Palette'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        playRoyalChime(4, 0.8);
                        setColorTheme(c.id);
                      }}
                      className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                        colorTheme === c.id
                          ? 'border-[#C9A86A] bg-[#C9A86A]/20 text-white shadow-lg'
                          : 'border-white/10 bg-[#160B14] text-[#D0C2A8] hover:border-[#C9A86A]/40'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full border border-white/30 shadow-md flex items-center justify-center shrink-0"
                        style={{ backgroundColor: c.hex }}
                      >
                        {colorTheme === c.id && <Check className="w-5 h-5 text-black drop-shadow" />}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-[#F8F5EE]">{lang === 'ar' ? c.nameAr : c.nameEn}</div>
                        <div className="text-[11px] text-[#C5B49C]">{lang === 'ar' ? 'تنسيق متناسق للقاعة' : 'Harmonized Hall & Centerpiece'}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                  <button onClick={handlePrevStep} className="px-4 py-2 rounded text-xs text-[#D0C2A8] hover:text-white flex items-center gap-1">
                    <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                    <span>{lang === 'ar' ? 'السابق' : 'Back'}</span>
                  </button>
                  <button onClick={handleNextStep} className="px-6 py-2.5 rounded bg-[#C9A86A] text-[#120B11] font-semibold text-xs hover:bg-[#E8CF99] transition-all flex items-center gap-1.5">
                    <span>{lang === 'ar' ? 'التالي: الخدمات الإضافية والعرض' : 'Next: Services & Quote'}</span>
                    <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Bespoke Services & Submit */}
            {step === 5 && (
              <div className="animate-in fade-in duration-300">
                <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold block mb-2">
                  {lang === 'ar' ? 'الخطوة الخامسة والنهائية' : 'STEP 05: FINALE'}
                </span>
                <h3 className="font-royal text-2xl text-white font-bold mb-4">
                  {lang === 'ar' ? 'اختاري الخدمات الملكية التكميلية' : 'Enhance With Royal Services'}
                </h3>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {activeServices.map((serv) => {
                    const isSelected = selectedServices.includes(serv.id);
                    return (
                      <div
                        key={serv.id}
                        onClick={() => toggleService(serv.id)}
                        className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#C9A86A] bg-[#C9A86A]/15 text-white'
                            : 'border-white/10 bg-[#160B14] text-[#D0C2A8] hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center border ${
                              isSelected ? 'bg-[#C9A86A] border-[#C9A86A] text-[#120B11]' : 'border-white/20'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-xs sm:text-sm font-medium">
                            {lang === 'ar' ? serv.labelAr : serv.labelEn}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[#C9A86A] tabular-nums">
                          +{serv.price.toLocaleString()} ريال
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Lead Contact Form */}
                <form onSubmit={handleSubmitLead} className="mt-6 pt-5 border-t border-white/10 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#C9A86A] mb-1">الاسم الكريم *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="سارة العبدالله"
                        className="w-full bg-[#120B11] border border-white/15 focus:border-[#C9A86A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#C9A86A] mb-1">رقم الجوال *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="05XXXXXXXX"
                        className="w-full bg-[#120B11] border border-white/15 focus:border-[#C9A86A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#C9A86A] mb-1">التاريخ المبدئي</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-[#120B11] border border-white/15 focus:border-[#C9A86A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 py-2 rounded text-xs text-[#D0C2A8] hover:text-white flex items-center gap-1"
                    >
                      <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                      <span>{lang === 'ar' ? 'السابق' : 'Back'}</span>
                    </button>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <button
                        type="submit"
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded bg-gradient-to-r from-[#C9A86A] to-[#E8CF99] text-[#120B11] font-bold text-xs hover:brightness-110 shadow-lg transition-all"
                      >
                        {submitted ? '✓ تم حفظ العرض' : 'طلب عرض السعر الرسمي'}
                      </button>

                      {onOpenPayment && (
                        <button
                          type="button"
                          onClick={() =>
                            onOpenPayment({
                              amount: 10000,
                              name: name || 'عميل كريم',
                              phone: phone || '+966500000000',
                              purpose: `عربون حجز مصمم ليلة الملكات (${hallSelection})`
                            })
                          }
                          className="px-4 py-2.5 rounded bg-[#C9A86A]/20 hover:bg-[#C9A86A] text-[#C9A86A] hover:text-[#120B11] border border-[#C9A86A]/40 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>سداد عربون الحجز (مدى / Apple Pay)</span>
                        </button>
                      )}

                      <a
                        href={generateWhatsAppLink()}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>واتساب مباشر</span>
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Column: Preview & Estimator */}
          <div className="lg:col-span-5 bg-[#170E16] border border-[#C9A86A]/40 rounded-2xl overflow-hidden shadow-2xl sticky top-28">
            <div className="relative aspect-[16/10] overflow-hidden bg-black">
              <img
                src={hallSelection === 'knights' ? heroBallroomImg : queensBallroomImg}
                alt="Royal Night Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#170E16] via-transparent to-black/40" />

              <div
                className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/20 shadow-lg text-white"
                style={{
                  backgroundColor: colors.find(c => c.id === colorTheme)?.hex + '88'
                }}
              >
                {colors.find(c => c.id === colorTheme)?.nameAr}
              </div>

              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] uppercase tracking-widest text-[#C9A86A] block">
                  {lang === 'ar' ? 'معاينة ليلتك المخصصة' : 'YOUR BESPOKE NIGHT PREVIEW'}
                </span>
                <h4 className="font-royal text-xl text-white font-bold">
                  {occasions.find(o => o.id === occasion)?.labelAr}
                </h4>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-white/10">
                <div>
                  <span className="text-[#C4B49C] block">{lang === 'ar' ? 'عدد الضيوف' : 'Guests'}:</span>
                  <span className="font-semibold text-white text-sm tabular-nums">{guests} ضيف</span>
                </div>
                <div>
                  <span className="text-[#C4B49C] block">{lang === 'ar' ? 'القاعة' : 'Ballroom'}:</span>
                  <span className="font-semibold text-[#C9A86A]">
                    {hallSelection === 'both' ? 'كلا القاعتين' : hallSelection === 'knights' ? 'قاعة الفرسان' : 'قاعة الملكات'}
                  </span>
                </div>
                <div>
                  <span className="text-[#C4B49C] block">{lang === 'ar' ? 'الطابع' : 'Atmosphere'}:</span>
                  <span className="font-medium text-white">{atmospheres.find(a => a.id === atmosphere)?.labelAr}</span>
                </div>
                <div>
                  <span className="text-[#C4B49C] block">{lang === 'ar' ? 'الخدمات المختارة' : 'Services'}:</span>
                  <span className="font-medium text-white tabular-nums">{selectedServices.length} خدمات مضافة</span>
                </div>
              </div>

              {/* Cost Estimator Box */}
              <div className="bg-[#140C13] p-4 rounded-xl border border-[#C9A86A]/20">
                <div className="flex items-center justify-between text-xs text-[#C5B49C] mb-2">
                  <span className="flex items-center gap-1">
                    <Calculator className="w-3.5 h-3.5 text-[#C9A86A]" />
                    <span>{lang === 'ar' ? 'التقدير المبدئي الشامل' : 'Estimated Investment'}</span>
                  </span>
                  <span className="text-[11px] text-[#C9A86A] bg-[#C9A86A]/10 px-2 py-0.5 rounded">
                    شامل الضيافة والخدمات
                  </span>
                </div>

                <div className="font-royal text-2xl sm:text-3xl font-bold text-white tabular-nums flex items-baseline gap-2">
                  <span>{estimatedTotal.toLocaleString()}</span>
                  <span className="text-xs font-sans text-[#C9A86A] font-normal">ريال سعودي (تقديري)</span>
                </div>
              </div>

              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#C9A86A] via-[#E8CF99] to-[#C9A86A] text-[#120B11] font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(201,168,106,0.3)]"
              >
                <Send className="w-4 h-4" />
                <span>احصلي على العرض المخصص عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
