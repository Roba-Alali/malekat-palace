import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, PhoneCall, CalendarCheck, HelpCircle } from 'lucide-react';
import { playRoyalChime } from '../utils/royalAudio';

interface SmartBookingAssistantProps {
  lang: 'ar' | 'en';
  onNavigateSection: (sectionId: string) => void;
  onAddLead: (lead: any) => void;
}

export const SmartBookingAssistant: React.FC<SmartBookingAssistantProps> = ({
  lang,
  onNavigateSection,
  onAddLead
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text:
        lang === 'ar'
          ? 'مرحباً بكِ في قصر الملكات 👑. أنا مساعدكِ الملكي، كيف يسعدني أن أخدمكِ اليوم في التخطيط لليلة العمر؟'
          : 'Welcome to Malekat Palace 👑. I am your Royal Concierge. How may I assist in planning your imperial night?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [leadData, setLeadData] = useState({
    name: '',
    phone: '',
    occasion: 'زفاف',
    date: '2026-11-20',
    guests: 400
  });

  const quickPrompts = [
    {
      id: 'tour',
      labelAr: '🗓️ حجز موعد زيارة للقصر',
      labelEn: '🗓️ Book Palace Walkthrough',
      action: () => {
        onNavigateSection('date-availability');
        appendBotReply(
          lang === 'ar'
            ? 'يسرنا استقبالكِ! تم توجيهكِ لتقويم المواعيد لاختيار التاريخ المناسب لزيارة القصر.'
            : 'We look forward to welcoming you! Redirecting to our live calendar.'
        );
      }
    },
    {
      id: 'design',
      labelAr: '✨ تصميم ليلة الزفاف وتقدير التكلفة',
      labelEn: '✨ Design Night & Estimate',
      action: () => {
        onNavigateSection('night-designer');
        appendBotReply(
          lang === 'ar'
            ? 'رائع! انتقلنا إلى مصمم ليلة الملكات لتخصيص الأجواء وحساب التكلفة التقديرية بدقة.'
            : 'Wonderful! Taking you to the Royal Night Designer.'
        );
      }
    },
    {
      id: 'halls',
      labelAr: '🏛️ سعة القاعات والتجهيزات',
      labelEn: '🏛️ Ballrooms & Capacities',
      action: () => {
        onNavigateSection('palace-halls');
        appendBotReply(
          lang === 'ar'
            ? 'قصر الملكات يضم قاعة الملكات للسيدات (تتسع حتى 750 ضيفة) وقاعة الفرسان للرجال (تتسع حتى 500 ضيف) بمداخل خاصة ومستقلة.'
            : 'Malekat Palace features the Queens Hall (up to 750 guests) and Knights Hall (up to 500 guests) with independent entries.'
        );
      }
    },
    {
      id: 'speak_manager',
      labelAr: '💬 تواصل مباشر مع مديرة التشريفات',
      labelEn: '💬 Speak to Palace Concierge',
      action: () => {
        setLeadFormOpen(true);
      }
    }
  ];

  const appendBotReply = (reply: string) => {
    setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playRoyalChime(2, 0.8);
    const userMsg = inputText.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');

    setTimeout(() => {
      playRoyalChime(3, 1.2);
      if (userMsg.includes('سعر') || userMsg.includes('تكلفة') || userMsg.includes('price')) {
        appendBotReply(
          lang === 'ar'
            ? 'تبدأ الباقات الملكية لقاعة الملكات من 45,000 ريال وتشمل البوفيه الفاخر والخدمات التكميلية بحسب عدد الضيوف. هل ترغبين بفتح مصمم التكلفة؟'
            : 'Royal wedding packages start from 45,000 SAR tailored to guest counts and catering options.'
        );
      } else if (userMsg.includes('تاريخ') || userMsg.includes('موعد') || userMsg.includes('date')) {
        appendBotReply(
          lang === 'ar'
            ? 'تتوفر مواعيد متبقية لشهور خريف وشتاء 2026/2027. يرجى مراجعة تقويم التوافر أو تزويدنا برقمكِ للتواصل المباشر.'
            : 'Select dates remain available for 2026/2027. You can check the calendar or leave your phone for a callback.'
        );
      } else {
        appendBotReply(
          lang === 'ar'
            ? 'شكراً لاهتمامكِ الراقي بقصر الملكات. سيقوم فريق علاقات كبار الشخصيات بالإجابة فوراً، أو يمكنكِ الضغط على زر واتساب أدناه للتواصل السريع.'
            : 'Thank you for contacting Malekat Palace. Our concierge team is at your disposal.'
        );
      }
    }, 600);
  };

  const handleSubmitLeadForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.name || !leadData.phone) return;

    playRoyalChime(4, 2);
    onAddLead({
      id: `lead-${Date.now()}`,
      name: leadData.name,
      phone: leadData.phone,
      occasion: leadData.occasion,
      date: leadData.date,
      guests: leadData.guests,
      hall: 'قاعة الملكات',
      theme: 'Royal Imperial',
      estimatedBudget: 75000,
      status: 'new',
      notes: 'طلب عبر مساعد الملكات الذكي - استفسار مباشر',
      createdAt: new Date().toISOString().split('T')[0]
    });

    setLeadFormOpen(false);
    appendBotReply(
      lang === 'ar'
        ? `أهلاً بكِ أ/ ${leadData.name}. تم تسجيل طلبكِ بنجاح، وستتصل بكِ مديرة الحجوزات قريباً جداً على الرقم ${leadData.phone}.`
        : `Thank you ${leadData.name}. Your inquiry is recorded and our events director will reach out shortly.`
    );
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            playRoyalChime(3, 1.2);
            setIsOpen(!isOpen);
          }}
          className="relative px-4 py-3 rounded-full bg-gradient-to-r from-[#C9A86A] via-[#E8CF99] to-[#C9A86A] text-[#120B11] font-bold text-xs tracking-wider shadow-[0_0_30px_rgba(201,168,106,0.5)] hover:shadow-[0_0_40px_rgba(201,168,106,0.7)] flex items-center gap-2 hover:scale-105 transition-all"
        >
          <span className="text-base">👑</span>
          <span className="font-royal text-sm font-bold">
            {lang === 'ar' ? 'مساعد الملكات' : 'Royal Concierge'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
        </button>
      </div>

      {/* Concierge Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 bg-[#170E16] border border-[#C9A86A]/50 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col h-[520px] animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="bg-[#120B11] p-4 border-b border-[#C9A86A]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#C9A86A]/20 border border-[#C9A86A] flex items-center justify-center text-sm font-serif text-[#C9A86A]">
                👑
              </div>
              <div>
                <span className="font-royal text-base text-white font-bold block">
                  {lang === 'ar' ? 'مساعد قصر الملكات' : 'Malekat Concierge'}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {lang === 'ar' ? 'متاح لخدمتكِ الآن' : 'At your service'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white p-1 rounded-lg"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#190E18]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#C9A86A] text-[#120B11] font-medium rounded-br-none'
                      : 'bg-[#120B11] text-[#E5DEC9] border border-white/10 rounded-bl-none shadow'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Quick Action Chips */}
            <div className="pt-2 space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest text-[#C9A86A] font-medium block mb-1">
                {lang === 'ar' ? 'الخيارات السريعة:' : 'Quick Options:'}
              </span>
              {quickPrompts.map((qp) => (
                <button
                  key={qp.id}
                  onClick={() => {
                    playRoyalChime(2, 0.8);
                    qp.action();
                  }}
                  className="w-full text-right py-2 px-3 rounded-lg border border-[#C9A86A]/20 bg-[#140C13] hover:bg-[#C9A86A]/15 text-[#D7C7B0] hover:text-[#C9A86A] text-xs transition-colors flex items-center justify-between"
                >
                  <span>{lang === 'ar' ? qp.labelAr : qp.labelEn}</span>
                  <span className="text-[#C9A86A]">←</span>
                </button>
              ))}
            </div>

            {/* In-chat Lead Form */}
            {leadFormOpen && (
              <form onSubmit={handleSubmitLeadForm} className="bg-[#120B11] p-3.5 rounded-xl border border-[#C9A86A]/40 space-y-2.5 mt-2 animate-in fade-in">
                <span className="font-royal text-sm text-white font-bold block">
                  {lang === 'ar' ? 'طلب اتصال مباشر من التشريفات' : 'VIP Callback Request'}
                </span>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'الاسم الكريم' : 'Your Name'}
                  value={leadData.name}
                  onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                  className="w-full bg-[#170E16] border border-white/20 rounded p-1.5 text-xs text-white outline-none focus:border-[#C9A86A]"
                />
                <input
                  type="tel"
                  required
                  placeholder={lang === 'ar' ? 'رقم الجوال' : 'Phone Number'}
                  value={leadData.phone}
                  onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                  className="w-full bg-[#170E16] border border-white/20 rounded p-1.5 text-xs text-white outline-none focus:border-[#C9A86A]"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 rounded bg-[#C9A86A] text-[#120B11] font-bold text-xs"
                  >
                    {lang === 'ar' ? 'إرسال الطلب' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeadFormOpen(false)}
                    className="px-2 py-1.5 text-xs text-white/50"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Input */}
          <form onSubmit={handleSendCustomMessage} className="p-2.5 bg-[#120B11] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتبي استفساركِ هنا...' : 'Type your inquiry here...'}
              className="flex-1 bg-[#190E18] border border-white/15 focus:border-[#C9A86A] rounded-lg px-3 py-2 text-xs text-white outline-none"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-[#C9A86A] hover:bg-[#E8CF99] text-[#120B11] transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
