import React, { useState } from 'react';
import { PaymentTransaction } from '../db/palaceDatabase';
import { X, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Lock, Printer, ArrowRight, ArrowLeft, Download } from 'lucide-react';
import { playRoyalChime } from '../utils/royalAudio';

interface PaymentGatewayModalProps {
  lang: 'ar' | 'en';
  defaultAmount?: number;
  clientName?: string;
  clientPhone?: string;
  purpose?: string;
  leadId?: string;
  onSuccess: (tx: PaymentTransaction) => void;
  onClose: () => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  lang,
  defaultAmount = 10000,
  clientName = 'سارة المنصور',
  clientPhone = '+966501234567',
  purpose = 'عربون تأكيد حجز قاعة الملكات',
  leadId,
  onSuccess,
  onClose
}) => {
  const [step, setStep] = useState<'details' | 'method' | 'card' | 'otp' | 'receipt'>('details');
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [method, setMethod] = useState<'mada' | 'apple_pay' | 'visa_mastercard' | 'stc_pay'>('mada');
  const [name, setName] = useState(clientName);
  const [phone, setPhone] = useState(clientPhone);
  const [bookingPurpose, setBookingPurpose] = useState(purpose);

  // Card details
  const [cardNumber, setCardNumber] = useState('4192 8820 1930 4588');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('382');
  const [cardholder, setCardholder] = useState(clientName);

  // OTP
  const [otpCode, setOtpCode] = useState('1234');
  const [userOtp, setUserOtp] = useState('');
  const [processing, setProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);

  const formatCardNumber = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    return raw.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleStartCardPayment = () => {
    playRoyalChime(3, 1);
    if (method === 'apple_pay') {
      // Direct simulated Apple Pay sheet
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        finishTransaction();
      }, 1500);
    } else {
      setStep('card');
    }
  };

  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    playRoyalChime(2, 0.8);
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep('otp');
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      finishTransaction();
    }, 1200);
  };

  const finishTransaction = () => {
    playRoyalChime(5, 2.5);
    const txRef = `MLK-TX-${Math.floor(10000 + Math.random() * 90000)}`;
    const authCode = `AUTH-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];

    const newTx: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      transactionRef: txRef,
      leadId,
      clientName: name,
      clientPhone: phone,
      amount,
      paymentMethod: method,
      paymentType: amount >= 40000 ? 'full' : 'deposit',
      status: 'paid',
      date: dateStr,
      timestamp: timeStr,
      cardLast4: cardNumber.replace(/\s/g, '').slice(-4) || '8830',
      authCode,
      purpose: bookingPurpose
    };

    setCompletedTx(newTx);
    onSuccess(newTx);
    setStep('receipt');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#180E17] border border-[#C9A86A]/50 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#120B11] p-5 border-b border-[#C9A86A]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C9A86A]/20 border border-[#C9A86A] flex items-center justify-center text-[#C9A86A] text-base font-serif">
              👑
            </div>
            <div>
              <h3 className="font-royal text-lg text-white font-bold">
                {lang === 'ar' ? 'بوابة الدفع الإلكتروني الملكية' : 'Royal Payment Gateway'}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                <span>{lang === 'ar' ? 'معاملة مشفرة وآمنة 256-bit SSL' : '256-Bit SSL Encrypted & Verified'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close payment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {/* STEP 1: Details & Amount */}
          {step === 'details' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-[#120B11] p-4 rounded-2xl border border-white/10 space-y-3">
                <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold block">
                  {lang === 'ar' ? 'تفاصيل السداد والمبلغ' : 'PAYMENT SUMMARY'}
                </span>
                <div>
                  <label className="text-xs text-[#C5B49C] block mb-1">
                    {lang === 'ar' ? 'المبلغ المطلوب سداده (ريال سعودي)' : 'Payment Amount (SAR)'}
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[5000, 15000, 30000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset)}
                        className={`py-2 px-2 rounded-lg border text-xs font-semibold tabular-nums transition-all ${
                          amount === preset
                            ? 'border-[#C9A86A] bg-[#C9A86A]/20 text-white'
                            : 'border-white/10 bg-[#170E16] text-[#D0C2A8]'
                        }`}
                      >
                        {preset.toLocaleString()} ريال
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-[#170E16] border border-white/20 focus:border-[#C9A86A] rounded-xl px-4 py-2.5 text-base font-bold text-white tabular-nums outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#C5B49C] block mb-1">
                    {lang === 'ar' ? 'الغرض من الدفعة' : 'Purpose'}
                  </label>
                  <input
                    type="text"
                    value={bookingPurpose}
                    onChange={(e) => setBookingPurpose(e.target.value)}
                    className="w-full bg-[#170E16] border border-white/20 focus:border-[#C9A86A] rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#C5B49C] block mb-1">
                    {lang === 'ar' ? 'اسم العميلة / العميل' : 'Client Name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setCardholder(e.target.value);
                    }}
                    className="w-full bg-[#120B11] border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#C5B49C] block mb-1">
                    {lang === 'ar' ? 'رقم الجوال' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#120B11] border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    playRoyalChime(2, 0.8);
                    setStep('method');
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C9A86A] via-[#E8CF99] to-[#C9A86A] text-[#120B11] font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-lg transition-all"
                >
                  <span>{lang === 'ar' ? 'المتابعة لاختيار وسيلة الدفع' : 'Proceed to Payment Method'}</span>
                  <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Method Selection */}
          {step === 'method' && (
            <div className="space-y-4 animate-in fade-in">
              <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold block mb-1">
                {lang === 'ar' ? 'اختاري وسيلة السداد المفضلة' : 'CHOOSE PAYMENT METHOD'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'mada',
                    nameAr: 'بطاقة مدى (Mada)',
                    nameEn: 'Mada Debit Card',
                    descAr: 'سحب فوري بدون رسوم إضافية',
                    descEn: 'Instant zero-fee local debit',
                    badge: 'مدى'
                  },
                  {
                    id: 'apple_pay',
                    nameAr: 'Apple Pay',
                    nameEn: 'Apple Pay',
                    descAr: 'دفع فوري بلمسة واحدة أو Face ID',
                    descEn: 'One-tap biometric checkout',
                    badge: 'Apple Pay'
                  },
                  {
                    id: 'visa_mastercard',
                    nameAr: 'Visa / Mastercard',
                    nameEn: 'Visa / Mastercard Credit',
                    descAr: 'البطاقات الائتمانية المحلية والدولية',
                    descEn: 'International & local cards',
                    badge: 'Credit'
                  },
                  {
                    id: 'stc_pay',
                    nameAr: 'STC Pay',
                    nameEn: 'STC Pay Wallet',
                    descAr: 'محفظة الدفع الرقمية',
                    descEn: 'Direct digital wallet',
                    badge: 'stc pay'
                  }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      playRoyalChime(2, 0.6);
                      setMethod(m.id as any);
                    }}
                    className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      method === m.id
                        ? 'border-[#C9A86A] bg-[#C9A86A]/20 shadow-md ring-1 ring-[#C9A86A]'
                        : 'border-white/10 bg-[#120B11] text-[#D0C2A8] hover:border-[#C9A86A]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="font-bold text-sm text-white">
                        {lang === 'ar' ? m.nameAr : m.nameEn}
                      </span>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono text-[#C9A86A]">
                        {m.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#A6957E]">
                      {lang === 'ar' ? m.descAr : m.descEn}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  onClick={() => setStep('details')}
                  className="px-4 py-2 text-xs text-[#D0C2A8] hover:text-white"
                >
                  {lang === 'ar' ? 'السابق' : 'Back'}
                </button>
                <button
                  onClick={handleStartCardPayment}
                  disabled={processing}
                  className="px-6 py-2.5 rounded-xl bg-[#C9A86A] hover:bg-[#E8CF99] text-[#120B11] font-bold text-xs flex items-center gap-2 transition-all shadow"
                >
                  {processing ? (
                    <span>{lang === 'ar' ? 'جاري المعالجة...' : 'Processing...'}</span>
                  ) : (
                    <span>{lang === 'ar' ? 'المتابعة لتأكيد الدفع' : 'Proceed to Checkout'}</span>
                  )}
                  <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Card Details Form with Visual Card */}
          {step === 'card' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Visual Card Representation */}
              <div className="relative aspect-[16/9] max-w-sm mx-auto rounded-2xl p-6 bg-gradient-to-tr from-[#1E0F1D] via-[#3B1F38] to-[#60355B] border border-[#C9A86A]/60 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <span className="font-royal text-base text-[#C9A86A] font-bold">MALEKAT PALACE</span>
                  <span className="text-xs font-mono font-bold bg-[#C9A86A]/20 px-2 py-0.5 rounded border border-[#C9A86A]/40 text-[#C9A86A]">
                    {method === 'mada' ? 'مدى · mada' : 'VISA'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] tracking-widest text-[#C5B49C]">CARD NUMBER</div>
                  <div className="font-mono text-lg sm:text-xl tracking-wider font-bold">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                </div>

                <div className="flex items-end justify-between text-xs">
                  <div>
                    <div className="text-[9px] text-[#C5B49C]">CARDHOLDER</div>
                    <div className="font-semibold uppercase tracking-wider">{cardholder || 'VALUED CLIENT'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-[#C5B49C]">EXPIRES</div>
                    <div className="font-mono font-semibold">{cardExpiry || 'MM/YY'}</div>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleProceedToOtp} className="space-y-3 text-xs">
                <div>
                  <label className="text-[#C5B49C] block mb-1">اسم حامل البطاقة (بالإنجليزية أو العربية)</label>
                  <input
                    type="text"
                    required
                    value={cardholder}
                    onChange={(e) => setCardholder(e.target.value)}
                    className="w-full bg-[#120B11] border border-white/20 focus:border-[#C9A86A] rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#C5B49C] block mb-1">رقم البطاقة (١٦ رقماً)</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className="w-full bg-[#120B11] border border-white/20 focus:border-[#C9A86A] rounded-lg px-3 py-2 text-white font-mono text-sm tracking-widest outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#C5B49C] block mb-1">تاريخ الانتهاء (شهر / سنة)</label>
                    <input
                      type="text"
                      required
                      placeholder="11/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-[#120B11] border border-white/20 focus:border-[#C9A86A] rounded-lg px-3 py-2 text-white font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[#C5B49C] block mb-1">رمز الأمان CVV (٣ أرقام)</label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-[#120B11] border border-white/20 focus:border-[#C9A86A] rounded-lg px-3 py-2 text-white font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setStep('method')}
                    className="px-4 py-2 text-xs text-[#D0C2A8] hover:text-white"
                  >
                    السابق
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A86A] to-[#E8CF99] text-[#120B11] font-bold text-xs flex items-center gap-2 shadow"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>سداد {amount.toLocaleString()} ريال بأمان</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: 3D Secure OTP Simulation */}
          {step === 'otp' && (
            <div className="space-y-5 text-center animate-in fade-in py-4">
              <div className="w-14 h-14 rounded-full bg-[#C9A86A]/20 border border-[#C9A86A] flex items-center justify-center text-[#C9A86A] mx-auto">
                <Smartphone className="w-7 h-7 animate-pulse" />
              </div>

              <div>
                <h4 className="font-royal text-xl text-white font-bold mb-1">
                  التحقق الأمني من البنك (3D Secure)
                </h4>
                <p className="text-xs text-[#C5B49C] max-w-sm mx-auto">
                  تم إرسال رمز تحقق مؤقت إلى هاتفك المسجل لدى البنك. الرمز التجريبي للمحاكاة هو: <span className="font-bold text-[#C9A86A] font-mono">1234</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="max-w-xs mx-auto space-y-4">
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="1234"
                  value={userOtp}
                  onChange={(e) => setUserOtp(e.target.value)}
                  className="w-full text-center bg-[#120B11] border-2 border-[#C9A86A] rounded-xl py-3 text-2xl font-mono tracking-[0.5em] text-white outline-none"
                />

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3 rounded-xl bg-[#C9A86A] hover:bg-[#E8CF99] text-[#120B11] font-bold text-xs shadow-lg transition-all"
                >
                  {processing ? 'جاري التحقق وإصدار السند...' : 'تأكيد السداد وإصدار الإيصال الملكي'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 5: Official Royal Payment Receipt */}
          {step === 'receipt' && completedTx && (
            <div className="space-y-6 animate-in fade-in py-2">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                  PAYMENT SUCCESSFUL · تم السداد بنجاح
                </span>
                <h3 className="font-royal text-2xl text-white font-bold">
                  سند قبض إلكتروني معتمد
                </h3>
              </div>

              {/* Receipt Card */}
              <div className="bg-[#120B11] border border-[#C9A86A]/40 rounded-2xl p-5 space-y-3 text-xs shadow-inner">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-[#C5B49C]">رقم العملية المرجعي:</span>
                  <span className="font-mono font-bold text-[#C9A86A]">{completedTx.transactionRef}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-[#C5B49C]">اسم العميلة / العميل:</span>
                  <span className="font-bold text-white">{completedTx.clientName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-[#C5B49C]">المبلغ المسدد:</span>
                  <span className="font-royal text-lg font-bold text-white tabular-nums">
                    {completedTx.amount.toLocaleString()} ريال سعودي
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-[#C5B49C]">وسيلة الدفع:</span>
                  <span className="font-semibold text-white uppercase">{completedTx.paymentMethod.replace('_', ' ')} (•••• {completedTx.cardLast4})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-[#C5B49C]">رمز التفويض البنكي:</span>
                  <span className="font-mono text-emerald-400">{completedTx.authCode}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#A6957E] pt-1">
                  <span>التاريخ والوقت:</span>
                  <span className="font-mono">{completedTx.date} - {completedTx.timestamp}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:flex-1 py-2.5 rounded-xl border border-[#C9A86A]/40 hover:bg-[#C9A86A]/10 text-xs font-semibold text-[#C9A86A] flex items-center justify-center gap-1.5 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة السند الملكي</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#C9A86A] hover:bg-[#E8CF99] text-[#120B11] font-bold text-xs flex items-center justify-center transition-all"
                >
                  <span>إغلاق وحفظ السجل</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
