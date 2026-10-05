import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, CalendarCheck, Phone, Instagram, MapPin, Sparkles, Send } from 'lucide-react';
import logoImg from '@/src/assets/images/palace_logo_crest_1791124779446.jpg';
import heroBallroomImg from '@/src/assets/images/hero_royal_ballroom_1791122453291.jpg';
import heroBrideImg from '@/src/assets/images/hero_bride_entrance_grand_1791124789640.jpg';
import palaceEntranceImg from '@/src/assets/images/palace_grand_entrance_1791122470162.jpg';
import queensBallroomImg from '@/src/assets/images/queens_ballroom_interior_1791122482334.jpg';
import { royalAudio, playRoyalChime } from '../utils/royalAudio';

interface NavbarProps {
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  onOpenBooking
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [audioActive, setAudioActive] = useState(royalAudio.isPlaying());
  const [menuSliderOpen, setMenuSliderOpen] = useState(false);
  const [activeMenuImage, setActiveMenuImage] = useState(heroBallroomImg);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = royalAudio.subscribe((playing) => {
      setAudioActive(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleAudio = () => {
    const nextState = royalAudio.toggleAmbience();
    setAudioActive(nextState);
    if (nextState) {
      playRoyalChime(4, 2.0);
    }
  };

  const navMenuItems = [
    { href: '#palace-halls', num: '01', titleAr: 'القاعات الملكية', titleEn: 'Royal Ballrooms', descAr: 'قاعة الملكات وقاعة الفرسان', descEn: "Queens & Knights Halls", image: heroBallroomImg },
    { href: '#virtual-tour', num: '02', titleAr: 'الجولة الافتراضية 360°', titleEn: 'Virtual 360° Tour', descAr: 'استكشاف تفاعلي لأجنحة القصر', descEn: 'Interactive Palace Walkthrough', image: queensBallroomImg },
    { href: '#night-designer', num: '03', titleAr: 'صممي ليلتك الملكية', titleEn: 'Night Designer & Quote', descAr: 'تخصيص الديكور والضيافة والتكلفة', descEn: 'Custom decor, guest count & pricing', image: heroBallroomImg },
    { href: '#grand-entrance', num: '04', titleAr: 'زفّات ومداخل العروس', titleEn: 'The Grand Entrance', descAr: 'سيناريوهات الدرج والستارة والموسيقى', descEn: 'Bridal descent & lighting choreography', image: heroBrideImg },
    { href: '#date-availability', num: '05', titleAr: 'التوافر والمواعيد', titleEn: 'Live Date Calendar', descAr: 'جدول المواعيد المتاحة وحجز المعاينات', descEn: 'Reserve walkthrough or preliminary date', image: palaceEntranceImg },
    { href: '#hospitality-section', num: '06', titleAr: 'الضيافة والبوفيه الملكي', titleEn: 'Royal Fine Dining', descAr: 'مراسم القهوة، الباتيسري، والبوفيه', descEn: 'Saudi coffee ceremony & French dessert carts', image: heroBallroomImg },
    { href: '#instagram-gallery', num: '07', titleAr: 'معرض الإنستقرام الحي', titleEn: 'Live Instagram Feed', descAr: 'لقطات حية من مناسبات القصر', descEn: 'Real moments captured from weddings', image: queensBallroomImg },
    { href: '#royal-invitation', num: '08', titleAr: 'دعوة الملكات الرقمية', titleEn: 'Digital Wedding Card', descAr: 'بطاقة دعوة خاصة وتأكيد الحضور', descEn: 'Custom invitation with live countdown', image: heroBrideImg }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#140C13]/95 backdrop-blur-md border-b border-[#C9A86A]/25 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.8)]'
            : 'bg-gradient-to-b from-[#120B11]/90 via-[#120B11]/50 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Lockup with Official Logo Crest */}
          <a
            href="#"
            onClick={() => playRoyalChime(3, 1)}
            className="flex items-center gap-3 group"
          >
            {/* Logo Crest Image */}
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-[#C9A86A] overflow-hidden bg-black shadow-[0_0_15px_rgba(201,168,106,0.4)] group-hover:scale-105 transition-transform duration-300">
              <img
                src={logoImg}
                alt="Malekat Palace Crest"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
            </div>

            {/* Typography */}
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-1.5">
                <span className="font-royal text-xl sm:text-2xl font-bold tracking-wide text-[#FBF8F3] group-hover:text-[#E8CF99] transition-colors">
                  {lang === 'ar' ? 'قصر الملكات' : 'MALEKAT PALACE'}
                </span>
                <span className="hidden sm:inline-block text-[#C9A86A] text-xs font-cinzel">
                  👑
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-cinzel text-[#C9A86A] tracking-[0.2em] uppercase font-semibold">
                For Every Queen... Her Crown!
              </span>
            </div>
          </a>

          {/* Right Utility Actions & Slider Menu Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Audio Ambience Button with Live Sound Equalizer */}
            <button
              onClick={handleToggleAudio}
              className={`px-3 py-1.5 rounded-full border text-xs flex items-center gap-2 transition-all cursor-pointer ${
                audioActive
                  ? 'border-[#C9A86A] bg-[#C9A86A]/15 text-[#C9A86A] shadow-[0_0_18px_rgba(201,168,106,0.35)]'
                  : 'border-white/15 bg-[#170E16]/60 text-white/60 hover:text-white hover:border-[#C9A86A]/40'
              }`}
              title={audioActive ? 'إيقاف المعزوفة الملكية' : 'تشغيل المعزوفة الملكية'}
              aria-label="Toggle royal music"
            >
              {audioActive ? (
                <>
                  <div className="flex items-end gap-[3px] h-3.5">
                    <span className="w-[3px] bg-[#C9A86A] rounded-full animate-bar-1" />
                    <span className="w-[3px] bg-[#C9A86A] rounded-full animate-bar-2" />
                    <span className="w-[3px] bg-[#C9A86A] rounded-full animate-bar-3" />
                    <span className="w-[3px] bg-[#C9A86A] rounded-full animate-bar-4" />
                  </div>
                  <span className="hidden sm:inline text-[11px] font-semibold">
                    {lang === 'ar' ? 'المعزوفة الملكية' : 'Music On'}
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-white/50" />
                  <span className="hidden sm:inline text-[11px]">
                    {lang === 'ar' ? 'تشغيل المعزوفة' : 'Music'}
                  </span>
                </>
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={onToggleLang}
              className="px-2.5 py-1 text-xs font-medium border border-[#C9A86A]/30 text-[#E5DEC9] hover:text-[#C9A86A] hover:border-[#C9A86A] rounded-lg transition-colors bg-[#170E16]/40 cursor-pointer"
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenBooking}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#140C13] bg-gradient-to-r from-[#C9A86A] via-[#E8CF99] to-[#C9A86A] hover:brightness-110 rounded-lg transition-all shadow-[0_0_20px_rgba(201,168,106,0.3)] whitespace-nowrap active:scale-95 cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'احجزي تاريخك' : 'Book Your Date'}</span>
            </button>

            {/* Clean Royal Menu Slider Trigger Button (Menu Icon Only) */}
            <button
              onClick={() => {
                playRoyalChime(3, 1);
                setMenuSliderOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl border border-[#C9A86A]/50 bg-[#1A0E18]/80 hover:bg-[#C9A86A] hover:text-[#120B11] text-[#F8F5EE] transition-all flex items-center gap-2 shadow-lg group cursor-pointer"
              aria-label="Open Palace Menu Slider"
            >
              <Menu className="w-5 h-5 text-[#C9A86A] group-hover:text-[#120B11] transition-colors" />
              <span className="text-xs font-bold font-cinzel tracking-wider">
                {lang === 'ar' ? 'القائمة' : 'MENU'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Opulent Full-Height Sliding Drawer Menu */}
      {menuSliderOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
          {/* Backdrop Scrim */}
          <div
            onClick={() => setMenuSliderOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-pointer"
          />

          {/* Drawer Container (Side-by-side on laptop/desktop, comfortable on mobile) */}
          <div className="relative w-full max-w-xl md:max-w-4xl lg:max-w-5xl bg-[#140B12] border-l border-[#C9A86A]/40 shadow-[0_0_90px_rgba(0,0,0,0.98)] z-10 flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-400">
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-[#C9A86A]/20 flex items-center justify-between bg-[#110910] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#C9A86A] overflow-hidden bg-black shadow-[0_0_15px_rgba(201,168,106,0.3)]">
                  <img src={logoImg} alt="Malekat Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-royal text-lg sm:text-xl text-white font-bold">
                    {lang === 'ar' ? 'قصر الملكات للاحتفالات' : 'MALEKAT PALACE'}
                  </h3>
                  <span className="text-[10px] font-cinzel text-[#C9A86A] tracking-wider uppercase block">
                    For Every Queen... Her Crown!
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMenuSliderOpen(false)}
                className="w-10 h-10 rounded-full border border-white/20 hover:border-[#C9A86A] text-white/70 hover:text-[#C9A86A] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Body: Side-by-Side on Laptop (Image on the Right, Menu on the Left) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Image Column on the Right (in RTL): High Definition Palace Photography */}
              <div className="hidden md:flex md:w-5/12 lg:w-1/2 p-6 flex-col justify-between shrink-0 border-l rtl:border-l-0 rtl:border-r border-[#C9A86A]/20 bg-[#10080F]">
                <div className="relative rounded-3xl overflow-hidden border border-[#C9A86A]/40 shadow-2xl h-full flex flex-col justify-end group">
                  <img
                    src={activeMenuImage}
                    alt="Malekat Palace"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 brightness-105 contrast-105 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />

                  <div className="relative z-10 p-6">
                    <span className="text-[10px] font-cinzel text-[#C9A86A] uppercase tracking-[0.25em] font-semibold block mb-1">
                      {lang === 'ar' ? 'صرح الأساطير الملكية' : 'THE ROYAL ESTATE'}
                    </span>
                    <h4 className="font-royal text-xl lg:text-2xl text-white font-bold mb-2">
                      {lang === 'ar' ? 'قصر الملكات · أبهى ليالي العمر' : 'Malekat Palace · An Eternal Tale'}
                    </h4>
                    <p className="text-xs text-[#E5DEC9] line-clamp-2 leading-relaxed font-light mb-4">
                      {lang === 'ar'
                        ? 'فخامة معمارية متفردة، وخدمة فندقية 5 نجوم تليق بأبهى ليالي الزفاف في قلب العاصمة الرياض.'
                        : 'Unparalleled architectural grandeur and 5-star royal banquet service in the heart of Riyadh.'}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] bg-[#C9A86A] text-[#120B11] font-bold px-3 py-1 rounded-full shadow">
                        {lang === 'ar' ? 'معاينات VIP يومياً' : 'Daily VIP Walkthroughs'}
                      </span>
                      <span className="text-[11px] text-white/85 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        {lang === 'ar' ? 'طريق الملك فهد' : 'King Fahd Road'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Links Column (Immediately Visible & Beside the Image) */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#C9A86A] font-cinzel font-semibold block mb-3">
                    {lang === 'ar' ? 'أقسام وتجارب القصر' : 'PALACE EXPERIENCES'}
                  </span>

                  <div className="space-y-2">
                    {navMenuItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onMouseEnter={() => {
                          if (item.image) setActiveMenuImage(item.image);
                        }}
                        onClick={() => {
                          playRoyalChime(3, 0.8);
                          setMenuSliderOpen(false);
                        }}
                        className="group p-3 rounded-2xl border border-white/5 hover:border-[#C9A86A]/40 bg-[#180E16]/60 hover:bg-[#C9A86A]/15 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-cinzel text-xs font-bold text-[#C9A86A] w-6 shrink-0">
                            {item.num}
                          </span>
                          <div>
                            <h4 className="font-royal text-base text-[#F8F5EE] group-hover:text-[#E8CF99] transition-colors font-bold">
                              {lang === 'ar' ? item.titleAr : item.titleEn}
                            </h4>
                            <p className="text-[11px] text-[#A6957E] group-hover:text-[#C9A86A] transition-colors line-clamp-1">
                              {lang === 'ar' ? item.descAr : item.descEn}
                            </p>
                          </div>
                        </div>
                        <span className="text-[#C9A86A] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ltr:rotate-180">
                          ←
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Drawer Footer & Quick Direct Contact */}
                <div className="pt-5 mt-4 border-t border-[#C9A86A]/20 space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={handleToggleAudio}
                      className="flex items-center gap-2 text-[#C9A86A] hover:underline cursor-pointer"
                    >
                      {audioActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                      <span>{audioActive ? (lang === 'ar' ? 'المعزوفة نشطة' : 'Music Playing') : (lang === 'ar' ? 'تشغيل المعزوفة' : 'Play Music')}</span>
                    </button>

                    <div className="flex items-center gap-3 text-xs text-[#C5B49C]">
                      <a href="tel:+966114009000" className="hover:text-white flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#C9A86A]" />
                        <span>اتصال</span>
                      </a>
                      <span>·</span>
                      <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                        <Instagram className="w-3.5 h-3.5 text-[#C9A86A]" />
                        <span>إنستقرام</span>
                      </a>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/966501234567"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A86A] via-[#E8CF99] to-[#C9A86A] text-[#120B11] font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(201,168,106,0.3)] hover:brightness-110 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تواصل مباشر مع مديرة التشريفات' : 'Direct WhatsApp Concierge'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
