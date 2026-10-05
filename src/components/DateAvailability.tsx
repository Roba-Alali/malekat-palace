import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, ChevronRight, ChevronLeft, MapPin, Send, CreditCard } from 'lucide-react';
import { AvailabilityDate } from '../data/palaceData';
import { playRoyalChime } from '../utils/royalAudio';

interface DateAvailabilityProps {
  lang: 'ar' | 'en';
  schedule?: AvailabilityDate[];
  onBookTour: (details: any) => void;
  onOpenPayment?: (details: any) => void;
}

export const DateAvailability: React.FC<DateAvailabilityProps> = ({
  lang,
  schedule = [],
  onBookTour,
  onOpenPayment
}) => {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-15');
  const [selectedHall, setSelectedHall] = useState<'both' | 'queens' | 'knights'>('queens');
  const [selectedTime, setSelectedTime] = useState<'evening' | 'afternoon'>('evening');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'tour' | 'hold'>('tour');

  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeekAr = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  const daysOfWeekEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const getDateStatus = (day: number): AvailabilityDate | undefined => {
    const formatted = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return schedule.find((item) => item.date === formatted);
  };

  const handleDayClick = (day: number) => {
    playRoyalChime(3, 1);
    const formatted = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(formatted);
  };

  const handlePrevMonth = () => {
    playRoyalChime(1, 0.8);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    playRoyalChime(1, 0.8);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const selectedDateObj = schedule.find((d) => d.date === selectedDate);
  const isBooked = selectedDateObj?.status === 'booked';

  const handleOpenBooking = (type: 'tour' | 'hold') => {
    setBookingType(type);
    setModalOpen(true);
    playRoyalChime(4, 1.5);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    playRoyalChime(5, 2.5);
    onBookTour({
      name,
      phone,
      date: selectedDate,
      hall: selectedHall,
      time: selectedTime,
      type: bookingType
    });
    setModalOpen(false);
  };

  const generateWhatsAppCalendarLink = () => {
    const hallStr = selectedHall === 'both' ? 'كلا القاعتين' : selectedHall === 'knights' ? 'قاعة الفرسان' : 'قاعة الملكات';
    const timeStr = selectedTime === 'evening' ? 'مسائية' : 'عصرية';
    const text = `السلام عليكم ورحمة الله،
أود الاستفسار عن حجز وتوافر قصر الملكات:
• *التاريخ*: ${selectedDate}
• *الفترة*: ${timeStr}
• *القاعة*: ${hallStr}
• *الاسم*: ${name || 'عميل كريم'}
• *الطلب*: ${bookingType === 'tour' ? 'حجز موعد زيارة ومعاينة ميدانية للقصر' : 'طلب حجز مبدئي للتاريخ'}

يرجى تأكيد التوافر وإفادتي بالخطوة التالية. شكراً جزيلاً ✨👑`;

    return `https://wa.me/966500000000?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="date-availability" className="relative py-28 bg-[#120B11] text-[#F8F5EE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A86A] mb-3 font-semibold font-serif-en">
            <Calendar className="w-4 h-4 text-[#C9A86A]" />
            <span>{lang === 'ar' ? 'التوافر الحي والمواعيد' : 'LIVE DATE AVAILABILITY & CALENDAR'}</span>
          </div>
          <h2 className="font-royal text-3xl sm:text-5xl text-white font-bold leading-tight">
            {lang === 'ar' ? 'اختاري تاريخك، ولحظتك الملكية' : 'Your Date, Your Royal Moment'}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#D0C2A8] font-light">
            {lang === 'ar'
              ? 'اطّلعي على جدول المواعيد المتاحة بقصر الملكات، واحجزي جولة معاينة خاصة بالقصر أو اطلبي حجزاً مبدئياً لتثبيت موعدك.'
              : 'View live availability for upcoming wedding seasons. Reserve a palace site tour or request a preliminary date hold.'}
          </p>
        </div>

        {/* Calendar Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Month Grid */}
          <div className="lg:col-span-8 bg-[#180E17] border border-[#C9A86A]/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-full border border-white/10 hover:border-[#C9A86A] text-[#C9A86A] hover:bg-[#C9A86A]/10 transition-colors"
                aria-label="Previous Month"
              >
                <ChevronRight className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />
              </button>

              <div className="text-center">
                <span className="font-royal text-2xl sm:text-3xl text-white font-bold tracking-wide">
                  {lang === 'ar' ? monthNamesAr[currentMonth] : monthNamesEn[currentMonth]} {currentYear}
                </span>
                <span className="block text-[11px] uppercase tracking-widest text-[#C9A86A] mt-0.5">
                  {lang === 'ar' ? 'موسم الأعراس الملكية' : 'Royal Wedding Season'}
                </span>
              </div>

              <button
                onClick={handleNextMonth}
                className="p-2 rounded-full border border-white/10 hover:border-[#C9A86A] text-[#C9A86A] hover:bg-[#C9A86A]/10 transition-colors"
                aria-label="Next Month"
              >
                <ChevronLeft className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[#C9A86A] mb-3">
              {(lang === 'ar' ? daysOfWeekAr : daysOfWeekEn).map((d, i) => (
                <div key={i} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-14 sm:h-16 rounded-xl bg-transparent" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const formatted = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const statusObj = getDateStatus(day);
                const status = statusObj?.status || 'available';
                const isSelected = selectedDate === formatted;

                let statusBadge = (
                  <span className="text-[10px] text-emerald-400 font-medium">
                    {lang === 'ar' ? 'متاح' : 'Available'}
                  </span>
                );

                let cellBg = 'bg-[#140C13] border-white/10 hover:border-[#C9A86A]/50';

                if (status === 'booked') {
                  statusBadge = (
                    <span className="text-[10px] text-red-400/80 font-normal">
                      {lang === 'ar' ? 'محجوز' : 'Booked'}
                    </span>
                  );
                  cellBg = 'bg-black/40 border-red-900/20 opacity-60';
                } else if (status === 'limited') {
                  statusBadge = (
                    <span className="text-[10px] text-amber-400 font-medium">
                      {lang === 'ar' ? 'محدود' : 'Hold'}
                    </span>
                  );
                  cellBg = 'bg-[#1E1210] border-amber-800/30';
                }

                if (isSelected) {
                  cellBg = 'bg-[#2A1525] border-[#C9A86A] shadow-[0_0_20px_rgba(201,168,106,0.35)] ring-1 ring-[#C9A86A]';
                }

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`h-14 sm:h-16 p-2 rounded-xl border flex flex-col justify-between items-center text-center transition-all ${cellBg}`}
                  >
                    <span className={`text-sm sm:text-base font-bold tabular-nums ${isSelected ? 'text-[#C9A86A]' : 'text-white'}`}>
                      {day}
                    </span>
                    {statusBadge}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#C5B49C]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 shadow" />
                <span>{lang === 'ar' ? 'متاح للحجز الفوري' : 'Available'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500/80 shadow" />
                <span>{lang === 'ar' ? 'طلب زيارة / حجز معلّق' : 'Preliminary Hold'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/60 shadow" />
                <span>{lang === 'ar' ? 'محجوز بالكامل' : 'Fully Booked'}</span>
              </div>
            </div>
          </div>

          {/* Right: Selected Date Action Card */}
          <div className="lg:col-span-4 bg-[#180E17] border border-[#C9A86A]/40 rounded-2xl p-6 sm:p-7 shadow-2xl">
            <span className="text-[11px] uppercase tracking-widest text-[#C9A86A] font-semibold block mb-1">
              {lang === 'ar' ? 'تفاصيل الموعد المختار' : 'SELECTED DATE SUMMARY'}
            </span>
            <h3 className="font-royal text-2xl text-white font-bold mb-4 tabular-nums">
              {selectedDate}
            </h3>

            <div className="space-y-4 text-xs mb-6">
              <div>
                <label className="text-[#C5B49C] block mb-2 font-medium">
                  {lang === 'ar' ? 'القاعة المستهدفة:' : 'Target Hall:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'queens', labelAr: 'الملكات', labelEn: 'Queens' },
                    { id: 'knights', labelAr: 'الفرسان', labelEn: 'Knights' },
                    { id: 'both', labelAr: 'كلاهما', labelEn: 'Both' }
                  ].map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHall(h.id as any)}
                      className={`py-2 px-2 rounded-lg border text-center font-medium transition-all ${
                        selectedHall === h.id
                          ? 'border-[#C9A86A] bg-[#C9A86A]/20 text-[#C9A86A]'
                          : 'border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      {lang === 'ar' ? h.labelAr : h.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#C5B49C] block mb-2 font-medium">
                  {lang === 'ar' ? 'الفترة:' : 'Time Period:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedTime('evening')}
                    className={`py-2 px-3 rounded-lg border text-center font-medium flex items-center justify-center gap-1.5 transition-all ${
                      selectedTime === 'evening'
                        ? 'border-[#C9A86A] bg-[#C9A86A]/20 text-[#C9A86A]'
                        : 'border-white/10 text-white/70 hover:border-white/30'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'فترة مسائية (سهرة)' : 'Evening Gala'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedTime('afternoon')}
                    className={`py-2 px-3 rounded-lg border text-center font-medium flex items-center justify-center gap-1.5 transition-all ${
                      selectedTime === 'afternoon'
                        ? 'border-[#C9A86A] bg-[#C9A86A]/20 text-[#C9A86A]'
                        : 'border-white/10 text-white/70 hover:border-white/30'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'فترة عصرية' : 'Afternoon'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#140C13] border border-white/10 mb-6 text-xs text-[#D7C7B0]">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#C9A86A]" />
                <span className="font-semibold text-white">
                  {isBooked
                    ? (lang === 'ar' ? 'هذا التاريخ محجوز مسبقاً' : 'This date is already reserved')
                    : (lang === 'ar' ? 'التاريخ متاح للحجز والمعاينة' : 'Date available for private tour & booking')}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                disabled={isBooked}
                onClick={() => handleOpenBooking('tour')}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#C9A86A] via-[#E8CF99] to-[#C9A86A] text-[#120B11] font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(201,168,106,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MapPin className="w-4 h-4" />
                <span>{lang === 'ar' ? 'احجزي موعد زيارة للقصر' : 'Schedule Venue Tour'}</span>
              </button>

              {onOpenPayment && (
                <button
                  disabled={isBooked}
                  onClick={() =>
                    onOpenPayment({
                      amount: 15000,
                      name: name || 'عميل كريم',
                      phone: phone || '+966500000000',
                      purpose: `عربون تأكيد حجز تاريخ (${selectedDate}) - ${selectedHall}`
                    })
                  }
                  className="w-full py-2.5 rounded-lg bg-[#C9A86A]/20 hover:bg-[#C9A86A] text-[#C9A86A] hover:text-[#120B11] border border-[#C9A86A]/40 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>دفع عربون تأكيد التاريخ (بوابة الدفع الإلكتروني)</span>
                </button>
              )}

              <a
                href={generateWhatsAppCalendarLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'ar' ? 'استفسار عبر واتساب مباشرة' : 'Inquire on WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal for Visit Booking */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-[#190E18] border border-[#C9A86A]/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <h3 className="font-royal text-2xl text-white font-bold mb-2">
                {bookingType === 'tour'
                  ? (lang === 'ar' ? 'حجز موعد زيارة ومعاينة ميدانية' : 'Book Palace Walkthrough Visit')
                  : (lang === 'ar' ? 'طلب تثبيت وحجز مبدئي' : 'Request Preliminary Date Reservation')}
              </h3>
              <p className="text-xs text-[#C5B49C] mb-6">
                {lang === 'ar'
                  ? `التاريخ المختار: ${selectedDate} · سيقوم فريق التشريفات بالتواصل لتأكيد الزيارة.`
                  : `Selected Date: ${selectedDate}. Our royal relations team will confirm your walkthrough.`}
              </p>

              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#C9A86A] mb-1 font-medium">
                    {lang === 'ar' ? 'الاسم الكريم' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="سارة المنصور"
                    className="w-full bg-[#120B11] border border-white/20 focus:border-[#C9A86A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#C9A86A] mb-1 font-medium">
                    {lang === 'ar' ? 'رقم الجوال (واتساب للتأكيد)' : 'WhatsApp Phone'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full bg-[#120B11] border border-white/20 focus:border-[#C9A86A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs text-[#D0C2A8] hover:text-white"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded bg-[#C9A86A] hover:bg-[#E8CF99] text-[#120B11] font-bold text-xs transition-colors"
                  >
                    {lang === 'ar' ? 'تأكيد الموعد' : 'Confirm Appointment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
