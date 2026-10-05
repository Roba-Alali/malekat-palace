import React from 'react';
import { HospitalityItem } from '../db/palaceDatabase';
import royalBuffetImg from '@/src/assets/images/royal_hospitality_buffet_1791122510172.jpg';
import { Coffee, UtensilsCrossed, Wine, Cake } from 'lucide-react';

interface HospitalitySectionProps {
  lang: 'ar' | 'en';
  items?: HospitalityItem[];
}

export const HospitalitySection: React.FC<HospitalitySectionProps> = ({ lang, items = [] }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'coffee':
        return Coffee;
      case 'cake':
        return Cake;
      case 'dining':
        return UtensilsCrossed;
      default:
        return Wine;
    }
  };

  return (
    <section id="hospitality-section" className="relative py-28 bg-[#150D14] text-[#F8F5EE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 gsap-header">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C9A86A] font-semibold block mb-3 font-serif-en">
            {lang === 'ar' ? 'كرم الضيافة وأناقة التقديم' : 'ROYAL HOSPITALITY & FINE DINING'}
          </span>
          <h2 className="font-royal text-3xl sm:text-5xl md:text-6xl text-white font-bold leading-tight">
            {lang === 'ar' ? (
              <>
                التفاصيل التي <br />
                <span className="gold-shimmer font-bold">يتذكرها ضيوفكِ دائماً.</span>
              </>
            ) : (
              <>
                The Exquisite Details <br />
                <span className="gold-shimmer font-bold">Your Guests Forever Cherish.</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#D0C2A8] font-light">
            {lang === 'ar'
              ? 'الضيافة في قصر الملكات فنّ متوارث؛ من فنجان القهوة الأول وحتى آخر حبة حلوى، نضمن لكِ خدمة استثنائية تعكس كرمك وترفع رأسك أمام ضيوفك.'
              : 'Hospitality at Malekat Palace is a cultivated art form. From the welcoming cup of fragrant coffee to the final dessert trolley, every touchpoint honors your guests.'}
          </p>
        </div>

        {/* Showcase Image & Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-[#C9A86A]/30 relative aspect-[4/3] group shadow-2xl gsap-reveal">
            <img
              src={royalBuffetImg}
              alt="Royal Hospitality Buffet"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120B11] via-transparent to-black/20" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-medium block mb-1">
                {lang === 'ar' ? 'طاقم ضيافة احترافي متكامل' : '5-STAR SERVICE STAFF'}
              </span>
              <h3 className="font-royal text-2xl text-white font-bold">
                {lang === 'ar' ? 'إشراف كامل على كل طاولة طوال الحفل' : 'Dedicated Banquet Table Butler Service'}
              </h3>
            </div>
          </div>

          {/* Experience Features (Staggered Children) */}
          <div className="lg:col-span-6 space-y-4 gsap-stagger-parent">
            {items.map((exp, idx) => {
              const Icon = getIcon(exp.iconType);
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#190E18] border border-white/10 hover:border-[#C9A86A]/40 transition-all flex items-start gap-4 gsap-stagger-item shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#C9A86A]/10 border border-[#C9A86A]/30 flex items-center justify-center text-[#C9A86A] shrink-0 mt-0.5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-royal text-xl text-white font-bold mb-1">
                      {lang === 'ar' ? exp.titleAr : exp.titleEn}
                    </h4>
                    <p className="text-xs text-[#C5B49C] leading-relaxed font-light">
                      {lang === 'ar' ? exp.descAr : exp.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
