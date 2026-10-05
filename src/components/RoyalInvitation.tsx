import React, { useState, useEffect } from 'react';
import { Mail, Share2, Sparkles, Clock, Music, Check, Copy } from 'lucide-react';
import { playRoyalChime } from '../utils/royalAudio';

interface RoyalInvitationProps {
  lang: 'ar' | 'en';
}

export const RoyalInvitation: React.FC<RoyalInvitationProps> = ({ lang }) => {
  const [brideName, setBrideName] = useState('سارة');
  const [groomName, setGroomName] = useState('عبدالعزيز');
  const [weddingDate, setWeddingDate] = useState('2026-12-15');
  const [copied, setCopied] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(148);
  const [hasRsvp, setHasRsvp] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 72,
    hours: 14,
    minutes: 36,
    seconds: 40
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        return {
          ...prev,
          seconds: 59,
          minutes: prev.minutes > 0 ? prev.minutes - 1 : 59
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyLink = () => {
    playRoyalChime(3, 1);
    navigator.clipboard.writeText(window.location.href + '#royal-invitation');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleRSVP = () => {
    if (hasRsvp) return;
    playRoyalChime(5, 2);
    setRsvpCount((prev) => prev + 1);
    setHasRsvp(true);
  };

  return (
    <section id="royal-invitation" className="relative py-28 bg-[#150D14] text-[#F8F5EE] overflow-hidden">
      {/* Decorative hairline */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A86A]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A86A] mb-3 font-semibold font-serif-en">
            <Mail className="w-4 h-4 text-[#C9A86A]" />
            <span>{lang === 'ar' ? 'بطاقة الدعوة الرقمية الفاخرة' : 'ROYAL DIGITAL INVITATION'}</span>
          </div>
          <h2 className="font-royal text-3xl sm:text-5xl text-white font-bold leading-tight">
            {lang === 'ar' ? 'دعوة الملكات الخاصة لضيوفكِ' : 'Your Bespoke Royal Digital Invitation'}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#D0C2A8] font-light">
            {lang === 'ar'
              ? 'خدمة حصرية لكل عروس في قصر الملكات: بطاقة دعوة تفاعلية تشاركينها مع أحبابك مع عداد تنازلي وموقع القصر وتأكيد الحضور (RSVP).'
              : 'An exclusive feature for Malekat Palace couples: a bespoke digital invitation card with live countdown, RSVP, and palace coordinates.'}
          </p>
        </div>

        {/* 2-Column: Customizer on Left, Live Invitation Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Controls Box */}
          <div className="lg:col-span-5 bg-[#190E18] border border-[#C9A86A]/30 rounded-2xl p-6 sm:p-7 shadow-xl">
            <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold block mb-4">
              {lang === 'ar' ? 'تخصيص بيانات الدعوة' : 'CUSTOMIZE INVITATION'}
            </span>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#C5B49C] mb-1 font-medium">
                  {lang === 'ar' ? 'اسم العروس' : 'Bride Name'}
                </label>
                <input
                  type="text"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  className="w-full bg-[#120B11] border border-white/20 focus:border-[#C9A86A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[#C5B49C] mb-1 font-medium">
                  {lang === 'ar' ? 'اسم العريس' : 'Groom Name'}
                </label>
                <input
                  type="text"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  className="w-full bg-[#120B11] border border-white/20 focus:border-[#C9A86A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[#C5B49C] mb-1 font-medium">
                  {lang === 'ar' ? 'تاريخ ليلة العمر' : 'Wedding Date'}
                </label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full bg-[#120B11] border border-white/20 focus:border-[#C9A86A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 rounded-lg border border-[#C9A86A]/40 hover:bg-[#C9A86A]/10 text-xs font-semibold text-[#C9A86A] flex items-center justify-center gap-2 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (lang === 'ar' ? 'تم نسخ رابط الدعوة' : 'Link Copied!') : (lang === 'ar' ? 'نسخ رابط الدعوة للمشاركة' : 'Copy Invitation Link')}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`بكل الحب والفرح، ندعوكم لحضور حفل زفاف ${brideName} & ${groomName} في قصر الملكات بتاريخ ${weddingDate}. يسعدنا تشريفكم!`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow"
              >
                <Share2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'مشاركة عبر واتساب العائلة' : 'Share via WhatsApp'}</span>
              </a>
            </div>
          </div>

          {/* Invitation Card Artifact */}
          <div className="lg:col-span-7">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-[#211320] via-[#1A0E18] to-[#120B11] border-2 border-[#C9A86A]/60 rounded-3xl p-8 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-center">
              {/* Corner Ornaments */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#C9A86A]/70" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#C9A86A]/70" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#C9A86A]/70" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#C9A86A]/70" />

              {/* Islamic Basmala / Opening */}
              <div className="font-royal text-base sm:text-lg text-[#C9A86A] mb-3">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </div>

              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5B49C] block mb-2 font-serif-en">
                ROYAL WEDDING INVITATION
              </span>

              <p className="font-royal text-sm sm:text-base text-[#E5DEC9] leading-relaxed mb-6">
                بكل مشاعر الود والسرور، تتشرف عائلتا الكريمتان بدعوتكم لمشاركتنا فرحة العمر بمناسبة زفاف
              </p>

              {/* Bride & Groom Royal Typography */}
              <div className="my-6 py-4 border-y border-[#C9A86A]/30">
                <h3 className="font-royal text-3xl sm:text-4xl text-white font-bold tracking-wide">
                  {brideName}
                </h3>
                <span className="font-royal text-xl text-[#C9A86A] my-1 block">&</span>
                <h3 className="font-royal text-3xl sm:text-4xl text-white font-bold tracking-wide">
                  {groomName}
                </h3>
              </div>

              {/* Date & Palace Location */}
              <div className="space-y-1 mb-6">
                <div className="font-royal text-lg text-[#C9A86A] tabular-nums font-bold">
                  {weddingDate}
                </div>
                <div className="text-xs uppercase tracking-widest text-[#F8F5EE] font-semibold">
                  {lang === 'ar' ? 'قصر الملكات للاحتفالات' : 'MALEKAT PALACE'}
                </div>
                <div className="text-[11px] text-[#A6957E]">
                  {lang === 'ar' ? 'القاعة الكبرى · الرياض' : 'Grand Royal Ballroom'}
                </div>
              </div>

              {/* Countdown Clock */}
              <div className="bg-[#120B11]/80 rounded-xl p-3 border border-[#C9A86A]/20 mb-6">
                <span className="text-[10px] uppercase tracking-widest text-[#C9A86A] block mb-2">
                  {lang === 'ar' ? 'العد التنازلي لليلة العمر' : 'COUNTDOWN TO THE ROYAL NIGHT'}
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-[#1A0E18] p-1.5 rounded-lg border border-white/5">
                    <span className="font-royal text-lg sm:text-xl font-bold text-white tabular-nums">
                      {timeLeft.days}
                    </span>
                    <span className="block text-[9px] text-[#C5B49C]">{lang === 'ar' ? 'يوم' : 'Days'}</span>
                  </div>
                  <div className="bg-[#1A0E18] p-1.5 rounded-lg border border-white/5">
                    <span className="font-royal text-lg sm:text-xl font-bold text-white tabular-nums">
                      {timeLeft.hours}
                    </span>
                    <span className="block text-[9px] text-[#C5B49C]">{lang === 'ar' ? 'ساعة' : 'Hours'}</span>
                  </div>
                  <div className="bg-[#1A0E18] p-1.5 rounded-lg border border-white/5">
                    <span className="font-royal text-lg sm:text-xl font-bold text-white tabular-nums">
                      {timeLeft.minutes}
                    </span>
                    <span className="block text-[9px] text-[#C5B49C]">{lang === 'ar' ? 'دقيقة' : 'Mins'}</span>
                  </div>
                  <div className="bg-[#1A0E18] p-1.5 rounded-lg border border-white/5">
                    <span className="font-royal text-lg sm:text-xl font-bold text-[#C9A86A] tabular-nums">
                      {timeLeft.seconds}
                    </span>
                    <span className="block text-[9px] text-[#C5B49C]">{lang === 'ar' ? 'ثانية' : 'Secs'}</span>
                  </div>
                </div>
              </div>

              {/* RSVP Action */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <span className="text-[#A6957E] text-[11px] tabular-nums">
                  {rsvpCount} {lang === 'ar' ? 'ضيف أكدوا الحضور' : 'Guests Confirmed'}
                </span>
                <button
                  onClick={handleRSVP}
                  disabled={hasRsvp}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    hasRsvp
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#C9A86A] hover:bg-[#E8CF99] text-[#120B11]'
                  }`}
                >
                  {hasRsvp ? (lang === 'ar' ? '✓ تم تأكيد الحضور' : '✓ RSVP Confirmed') : (lang === 'ar' ? 'تأكيد الحضور (RSVP)' : 'Confirm RSVP')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
