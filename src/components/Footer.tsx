import React from 'react';
import { MapPin, Phone, Instagram, Clock } from 'lucide-react';
import { SiteConfig } from '../db/palaceDatabase';

interface FooterProps {
  lang: 'ar' | 'en';
  contact?: SiteConfig['contact'];
}

export const Footer: React.FC<FooterProps> = ({ lang, contact }) => {
  return (
    <footer className="relative bg-[#0E070D] text-[#E5DEC9] border-t border-[#C9A86A]/20 pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[#C9A86A] text-xl">👑</span>
              <span className="font-royal text-2xl sm:text-3xl text-white font-bold tracking-wide">
                {lang === 'ar' ? 'قصر الملكات للاحتفالات' : 'MALEKAT PALACE'}
              </span>
            </div>
            <p className="font-royal text-base text-[#C9A86A] italic">
              {lang === 'ar' ? '"ليلة واحدة. ذكرى تدوم العمر."' : '"One Night. An Eternal Memory."'}
            </p>
            <p className="text-xs text-[#B5A48C] leading-relaxed max-w-sm font-light">
              {lang === 'ar'
                ? 'الصرح الرائد لحفلات الزفاف والمناسبات الملكية الكبرى، يجمع بين الفخامة المعمارية الكلاسيكية والضيافة العربية الأصيلة.'
                : 'The premier destination for bespoke royal weddings and grand celebrations, harmonizing European palatial architecture with gracious Arabian hospitality.'}
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-royal text-base text-white font-semibold mb-4">
              {lang === 'ar' ? 'أقسام القصر' : 'Palace Experiences'}
            </h4>
            <ul className="space-y-2 text-xs text-[#C5B49C]">
              <li>
                <a href="#palace-halls" className="hover:text-[#C9A86A] transition-colors">
                  {lang === 'ar' ? 'قاعة الملكات وقاعة الفرسان' : 'Royal Ballrooms'}
                </a>
              </li>
              <li>
                <a href="#virtual-tour" className="hover:text-[#C9A86A] transition-colors">
                  {lang === 'ar' ? 'الجولة الافتراضية 360°' : '360° Virtual Tour'}
                </a>
              </li>
              <li>
                <a href="#night-designer" className="hover:text-[#C9A86A] transition-colors">
                  {lang === 'ar' ? 'مصمم ليلة الملكات' : 'Night Designer'}
                </a>
              </li>
              <li>
                <a href="#grand-entrance" className="hover:text-[#C9A86A] transition-colors">
                  {lang === 'ar' ? 'زفات ومداخل العروس' : 'The Grand Entrance'}
                </a>
              </li>
              <li>
                <a href="#date-availability" className="hover:text-[#C9A86A] transition-colors">
                  {lang === 'ar' ? 'جدول التوافر والمواعيد' : 'Live Calendar'}
                </a>
              </li>
              <li>
                <a href="#royal-invitation" className="hover:text-[#C9A86A] transition-colors">
                  {lang === 'ar' ? 'دعوة الملكات الرقمية' : 'Digital Invitation'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-royal text-base text-white font-semibold mb-4">
              {lang === 'ar' ? 'التشريفات والزيارات' : 'Private Visits & Inquiries'}
            </h4>
            <div className="space-y-3 text-xs text-[#C5B49C]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C9A86A] shrink-0 mt-0.5" />
                <span>
                  {contact?.addressAr || (lang === 'ar'
                    ? 'طريق الملك فهد، حي الصحافة، الرياض، المملكة العربية السعودية'
                    : 'King Fahd Road, As Sahafah, Riyadh, Kingdom of Saudi Arabia')}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C9A86A] shrink-0" />
                <span dir="ltr" className="font-mono text-white">
                  {contact?.phone || '+966 11 400 9000'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C9A86A] shrink-0" />
                <span>
                  {contact?.visitingHoursAr || (lang === 'ar' ? 'استقبال المعاينات: يومياً من ٤:٠٠ م وحتى ١١:٠٠ م' : 'Walkthroughs: Daily 4:00 PM – 11:00 PM')}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-[#C9A86A] shrink-0" />
                <span>{contact?.instagramHandle || '@malekat_palace'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A7968] gap-4">
          <p>© {new Date().getFullYear()} {lang === 'ar' ? 'قصر الملكات للاحتفالات. جميع الحقوق محفوظة.' : 'Malekat Palace. All rights reserved.'}</p>

          <div className="flex items-center gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
            <span>·</span>
            <span className="hover:text-white transition-colors cursor-pointer">{lang === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
