import React from 'react';
import palaceEntranceImg from '@/src/assets/images/palace_grand_entrance_1791122470162.jpg';
import { Crown, Sparkles, Building2, HeartHandshake } from 'lucide-react';

interface WelcomeSectionProps {
  lang: 'ar' | 'en';
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ lang }) => {
  const stats = [
    {
      value: '750+',
      labelAr: 'سعة الضيوف بالقاعة الكبرى',
      labelEn: 'Guest Capacity in Grand Hall',
      icon: Crown
    },
    {
      value: '2',
      labelAr: 'قاعات ملكية بمداخل مستقلة',
      labelEn: 'Independent Royal Ballrooms',
      icon: Building2
    },
    {
      value: '20+',
      labelAr: 'عاماً من عراقة المناسبات الفاخرة',
      labelEn: 'Years of Royal Hospitality',
      icon: Sparkles
    },
    {
      value: '100%',
      labelAr: 'خصوصية وأجنحة خاصة للعرائس',
      labelEn: 'Private Bridal Sanctuaries',
      icon: HeartHandshake
    }
  ];

  return (
    <section id="editorial-welcome" className="relative py-28 bg-[#150D14] overflow-hidden">
      {/* Decorative Golden Hairline Accents */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A86A]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 gsap-header">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C9A86A] font-semibold block mb-3 font-serif-en">
            {lang === 'ar' ? 'عراقة وفخامة قصر الملكات' : 'THE ESSENCE OF MALEKAT'}
          </span>
          <h2 className="font-royal text-3xl sm:text-5xl md:text-6xl text-[#F8F5EE] leading-tight">
            {lang === 'ar' ? (
              <>
                ليست مجرد قاعة احتفالات... <br />
                <span className="gold-shimmer font-bold">إنها ليلة تُروى للأجيال.</span>
              </>
            ) : (
              <>
                Not merely an event hall... <br />
                <span className="gold-shimmer font-bold">It is a royal tale told for generations.</span>
              </>
            )}
          </h2>
          <p className="mt-6 text-sm sm:text-base text-[#D0C2A8] leading-relaxed font-light">
            {lang === 'ar'
              ? 'صُمم قصر الملكات ليكون صرحاً يجمع بين الفخامة المعمارية الفيكتورية والفرنسية العريقة، وبين كرم الضيافة العربية الأصيلة. من لحظة وصول سيارة العروس وحتى وداع آخر الضيوف، كل ثانية محسوبة لتمنحك إحساس الملوكية.'
              : 'Malekat Palace was architecturally conceived to fuse European French Victorian grandeur with generous Arabian hospitality traditions. From the grand arrival to the final farewell, every fleeting moment is choreographed to royal perfection.'}
          </p>
        </div>

        {/* Cinematic Palace Exterior Showcase Card */}
        <div className="relative rounded-2xl overflow-hidden border border-[#C9A86A]/25 shadow-[0_20px_60px_rgba(0,0,0,0.7)] group gsap-panel-reveal">
          <div className="aspect-[21/9] sm:aspect-[16/7] w-full overflow-hidden bg-[#180E17]">
            <img
              src={palaceEntranceImg}
              alt="Malekat Palace Facade"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#120B11] via-[#120B11]/30 to-transparent" />
          </div>

          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-medium block mb-1">
                {lang === 'ar' ? 'الصرح الملكي الخارجي' : 'ROYAL EXTERIOR ARCHITECTURE'}
              </span>
              <h3 className="font-royal text-2xl sm:text-3xl text-white font-bold">
                {lang === 'ar' ? 'المدخل الإمبراطوري والواجهة الكلاسيكية' : 'The Imperial Neoclassical Facade'}
              </h3>
            </div>
            <div className="text-xs text-[#E5DEC9] bg-[#140C13]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-[#C9A86A]/30">
              {lang === 'ar' ? 'مواقف فسيحة · خدمة فالي VIP · حراسة وخصوصية تامة' : 'Spacious Valet · VIP Driveway · Full Privacy'}
            </div>
          </div>
        </div>

        {/* Quantified Rigor Proof Stats (Tabular Numerals, Clean Unboxed) */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 gsap-stagger-parent">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#1A0F19]/60 border border-[#C9A86A]/15 hover:border-[#C9A86A]/40 transition-colors flex flex-col items-center text-center gsap-stagger-item shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-[#C9A86A]/10 border border-[#C9A86A]/30 flex items-center justify-center text-[#C9A86A] mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-royal text-3xl sm:text-4xl font-bold text-[#FBF8F3] tracking-tight tabular-nums">
                  {stat.value}
                </span>
                <span className="mt-2 text-xs sm:text-sm text-[#C4B49C] font-light">
                  {lang === 'ar' ? stat.labelAr : stat.labelEn}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
