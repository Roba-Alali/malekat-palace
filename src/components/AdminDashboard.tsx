import React, { useState } from 'react';
import {
  PalaceDatabaseState,
  savePalaceDatabase,
  resetPalaceDatabase,
  NightService,
  PaymentTransaction
} from '../db/palaceDatabase';
import { HallInfo, LeadCRM, AvailabilityDate, InstagramPost } from '../data/palaceData';
import {
  X,
  LayoutDashboard,
  Building2,
  Sparkles,
  Calendar,
  Compass,
  UtensilsCrossed,
  Instagram,
  Users,
  CreditCard,
  Settings,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Download,
  Upload,
  Check,
  Eye,
  EyeOff,
  MessageSquare,
  Mail,
  Lock,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { playRoyalChime } from '../utils/royalAudio';
import { PaymentGatewayModal } from './PaymentGatewayModal';

interface AdminDashboardProps {
  lang: 'ar' | 'en';
  db: PalaceDatabaseState;
  onUpdateDb: (newDb: PalaceDatabaseState) => void;
  onClose: () => void;
}

type TabType =
  | 'overview'
  | 'site_config'
  | 'halls'
  | 'night_designer'
  | 'calendar'
  | 'virtual_tour'
  | 'entrances'
  | 'hospitality'
  | 'instagram'
  | 'crm'
  | 'payments'
  | 'database';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  db,
  onUpdateDb,
  onClose
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('palace_admin_auth') === 'true';
  });
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [draftDb, setDraftDb] = useState<PalaceDatabaseState>(JSON.parse(JSON.stringify(db)));
  const [savedNotice, setSavedNotice] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedLeadForPayment, setSelectedLeadForPayment] = useState<LeadCRM | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    // Verify credentials:
    // Accept: admin@malekat.sa, mmg.webhost@gmail.com, or admin with malekat2026 or admin password
    const isEmailValid =
      cleanEmail === 'admin@malekat.sa' ||
      cleanEmail === 'mmg.webhost@gmail.com' ||
      cleanEmail === 'admin' ||
      (cleanEmail.includes('@') && cleanEmail.length > 5);

    const isPasswordValid =
      cleanPass === 'malekat2026' ||
      cleanPass === 'admin' ||
      cleanPass === '123456';

    if (isEmailValid && isPasswordValid) {
      playRoyalChime(4, 2);
      setIsAuthenticated(true);
      setLoginError(null);
      if (rememberMe && typeof window !== 'undefined') {
        sessionStorage.setItem('palace_admin_auth', 'true');
      }
    } else {
      playRoyalChime(1, 0.5);
      setLoginError(
        lang === 'ar'
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى إدخال البيانات المعتمدة.'
          : 'Invalid email address or password. Please verify credentials.'
      );
    }
  };

  const handleLogout = () => {
    playRoyalChime(2, 0.8);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('palace_admin_auth');
    }
    setIsAuthenticated(false);
    setEmailInput('');
    setPasswordInput('');
  };

  const handleSave = () => {
    playRoyalChime(5, 2);
    savePalaceDatabase(draftDb);
    onUpdateDb(draftDb);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من استعادة بيانات القصر الافتراضية؟')) {
      const reset = resetPalaceDatabase();
      setDraftDb(reset);
      onUpdateDb(reset);
      playRoyalChime(1, 1);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(draftDb, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `malekat_palace_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && imported.siteConfig) {
          setDraftDb(imported);
          savePalaceDatabase(imported);
          onUpdateDb(imported);
          alert('تم استيراد قاعدة البيانات بنجاح!');
        }
      } catch (err) {
        alert('ملف غير صالح.');
      }
    };
    reader.readAsText(file);
  };

  // Payment success handler
  const handlePaymentSuccess = (tx: PaymentTransaction) => {
    const updatedPayments = [tx, ...draftDb.payments];
    let updatedLeads = draftDb.leads;

    if (tx.leadId) {
      updatedLeads = draftDb.leads.map((l) =>
        l.id === tx.leadId ? { ...l, status: 'confirmed' as const } : l
      );
    }

    const nextState = {
      ...draftDb,
      payments: updatedPayments,
      leads: updatedLeads
    };
    setDraftDb(nextState);
    savePalaceDatabase(nextState);
    onUpdateDb(nextState);
    setPaymentModalOpen(false);
  };

  // Stats calculation
  const totalRevenue = draftDb.payments.reduce((acc, curr) => acc + (curr.status === 'paid' ? curr.amount : 0), 0);
  const confirmedLeads = draftDb.leads.filter((l) => l.status === 'confirmed').length;
  const visitLeads = draftDb.leads.filter((l) => l.status === 'visit_scheduled').length;

  // If user is not authenticated, display the Royal Admin Login Gate
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-[#160D15] border border-[#C9A86A]/50 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] p-7 sm:p-9 overflow-hidden">
          {/* Subtle gold crown accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A86A] to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 left-5 w-8 h-8 rounded-full border border-white/20 hover:border-[#C9A86A] text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={lang === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Gate Header */}
          <div className="text-center mb-7">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#C9A86A]/10 border border-[#C9A86A]/40 flex items-center justify-center text-[#C9A86A] shadow-[0_0_25px_rgba(201,168,106,0.25)]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="font-royal text-2xl sm:text-3xl font-bold text-white mb-1.5">
              {lang === 'ar' ? 'تسجيل دخول إدارة القصر' : 'Palace Administration'}
            </h2>
            <p className="text-xs text-[#C5B49C]">
              {lang === 'ar'
                ? 'بوابة الدخول الإدارية المعتمدة للمشرفين والتشريفات'
                : 'Restricted administrative access for authorized staff only'}
            </p>
          </div>

          {/* Error Message Alert */}
          {loginError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs text-center leading-relaxed">
              {loginError}
            </div>
          )}

          {/* Login Form: Email & Password */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#E5DEC9] mb-1.5">
                {lang === 'ar' ? 'البريد الإلكتروني للإدارة' : 'Admin Email'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@malekat.sa"
                  className="w-full bg-[#110911] border border-white/15 focus:border-[#C9A86A] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors ltr:pl-10 rtl:pr-10"
                />
                <Mail className="w-4 h-4 text-[#C9A86A] absolute top-3.5 ltr:left-3 rtl:right-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5DEC9] mb-1.5">
                {lang === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#110911] border border-white/15 focus:border-[#C9A86A] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors ltr:pl-10 ltr:pr-10 rtl:pr-10 rtl:pl-10"
                />
                <Lock className="w-4 h-4 text-[#C9A86A] absolute top-3.5 ltr:left-3 rtl:right-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3.5 ltr:right-3 rtl:left-3 text-white/50 hover:text-white cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#A6957E] pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-[#110911] text-[#C9A86A] focus:ring-0 cursor-pointer"
                />
                <span>{lang === 'ar' ? 'تذكر الجلسة' : 'Remember session'}</span>
              </label>

              <span className="text-[11px] text-[#C9A86A]">
                {lang === 'ar' ? 'بيانات معتمدة' : 'Authorized Access'}
              </span>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#C9A86A] via-[#E8CF99] to-[#C9A86A] text-[#120B11] font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-[0_0_20px_rgba(201,168,106,0.3)] transition-all cursor-pointer active:scale-98"
            >
              <ShieldCheck className="w-4 h-4 text-[#120B11]" />
              <span>{lang === 'ar' ? 'تسجيل الدخول إلى لوحة التحكم' : 'Sign In to Dashboard'}</span>
            </button>
          </form>

          {/* Credentials Helper Hint Box */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[11px] text-[#C4B49C] leading-relaxed">
              {lang === 'ar' ? (
                <>
                  البريد المعتمد: <span className="text-white font-mono">admin@malekat.sa</span> <br />
                  كلمة المرور: <span className="text-white font-mono">malekat2026</span>
                </>
              ) : (
                <>
                  Default email: <span className="text-white font-mono">admin@malekat.sa</span> <br />
                  Default password: <span className="text-white font-mono">malekat2026</span>
                </>
              )}
            </p>

            <button
              onClick={onClose}
              className="mt-4 text-xs text-[#C9A86A] hover:underline cursor-pointer"
            >
              {lang === 'ar' ? '← العودة إلى واجهة الموقع' : '← Return to Website'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl bg-[#160D15] border border-[#C9A86A]/50 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col h-[94vh]">
        {/* Top Header */}
        <div className="bg-[#120B11] px-6 py-4 border-b border-[#C9A86A]/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A86A]/20 border border-[#C9A86A] flex items-center justify-center text-[#C9A86A] text-lg font-serif">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-royal text-xl sm:text-2xl text-white font-bold">
                  {lang === 'ar' ? 'لوحة تحكم إدارة قصر الملكات' : 'Malekat Palace Master Admin'}
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">
                  #admin verified
                </span>
              </div>
              <p className="text-xs text-[#C5B49C]">
                {lang === 'ar'
                  ? 'إدارة محتوى القصر، القاعات، التقويم، مصمم الليالي، وبوابة الدفع'
                  : 'Manage all site sections, ballrooms, calendar availability & payment gateway'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedNotice && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
                <Check className="w-4 h-4" />
                {lang === 'ar' ? 'تم حفظ التعديلات بنجاح' : 'Changes Saved!'}
              </span>
            )}

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#C9A86A] hover:bg-[#E8CF99] text-[#120B11] font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{lang === 'ar' ? 'حفظ كافة التغييرات' : 'Save Changes'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title={lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-white/20 text-white/70 hover:text-white hover:bg-white/5 text-xs flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#C9A86A]" />
              <span>{lang === 'ar' ? 'العودة للموقع' : 'View Site'}</span>
            </button>
          </div>
        </div>

        {/* Layout: Sidebar Tabs on Right (RTL), Content on Left */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-64 bg-[#130912] border-b md:border-b-0 md:border-l border-white/10 p-3 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1 shrink-0">
            {[
              { id: 'overview', labelAr: 'نظرة عامة وإحصائيات', labelEn: 'Overview', icon: LayoutDashboard },
              { id: 'site_config', labelAr: 'الهوية والشاشات الرئيسية', labelEn: 'Hero & Identity', icon: Settings },
              { id: 'halls', labelAr: 'إدارة القاعات والمواصفات', labelEn: 'Halls Manager', icon: Building2 },
              { id: 'night_designer', labelAr: 'مصمم ليلة الملكات والأسعار', labelEn: 'Night Designer & Pricing', icon: Sparkles },
              { id: 'calendar', labelAr: 'تقويم التوافر والمواعيد', labelEn: 'Availability Calendar', icon: Calendar },
              { id: 'virtual_tour', labelAr: 'الجولة الافتراضية 360°', labelEn: '360° Tour Hotspots', icon: Compass },
              { id: 'entrances', labelAr: 'زفات ومداخل العروس', labelEn: 'Grand Entrances', icon: Sparkles },
              { id: 'hospitality', labelAr: 'الضيافة والبوفيه الملكي', labelEn: 'Hospitality & Dining', icon: UtensilsCrossed },
              { id: 'instagram', labelAr: 'معرض الإنستقرام', labelEn: 'Instagram Feed', icon: Instagram },
              { id: 'crm', labelAr: 'إدارة الحجوزات والعملاء (CRM)', labelEn: 'Leads & Bookings', icon: Users },
              { id: 'payments', labelAr: 'بوابة الدفع والسندات الإلكترونية', labelEn: 'Payment Gateway', icon: CreditCard },
              { id: 'database', labelAr: 'النسخ الاحتياطي وقاعدة البيانات', labelEn: 'Database Tools', icon: Save }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playRoyalChime(2, 0.6);
                    setActiveTab(tab.id as TabType);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-right text-xs font-semibold flex items-center gap-2.5 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#C9A86A] text-[#120B11] shadow font-bold'
                      : 'text-[#D0C2A8] hover:bg-white/5 hover:text-[#C9A86A]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content Panel */}
          <div className="flex-1 p-5 sm:p-8 overflow-y-auto bg-[#170E16]">
            {/* 1. OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="font-royal text-2xl text-white font-bold mb-4">
                  {lang === 'ar' ? 'ملخص الأداء والمبيعات' : 'Palace Performance Overview'}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#120B11] p-5 rounded-2xl border border-white/10">
                    <span className="text-xs text-[#C5B49C] block mb-1">إجمالي الإيرادات المسددة</span>
                    <span className="font-royal text-3xl font-bold text-[#C9A86A] tabular-nums">
                      {totalRevenue.toLocaleString()} <span className="text-xs font-sans">ريال</span>
                    </span>
                  </div>

                  <div className="bg-[#120B11] p-5 rounded-2xl border border-white/10">
                    <span className="text-xs text-[#C5B49C] block mb-1">حجوزات مؤكدة</span>
                    <span className="font-royal text-3xl font-bold text-emerald-400 tabular-nums">
                      {confirmedLeads}
                    </span>
                  </div>

                  <div className="bg-[#120B11] p-5 rounded-2xl border border-white/10">
                    <span className="text-xs text-[#C5B49C] block mb-1">مواعيد معاينات قادمة</span>
                    <span className="font-royal text-3xl font-bold text-amber-400 tabular-nums">
                      {visitLeads}
                    </span>
                  </div>

                  <div className="bg-[#120B11] p-5 rounded-2xl border border-white/10">
                    <span className="text-xs text-[#C5B49C] block mb-1">إجمالي طلبات الحجز</span>
                    <span className="font-royal text-3xl font-bold text-white tabular-nums">
                      {draftDb.leads.length}
                    </span>
                  </div>
                </div>

                {/* Quick actions box */}
                <div className="bg-[#120B11] p-6 rounded-2xl border border-[#C9A86A]/30 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="font-royal text-lg text-white font-bold">بوابة الدفع وسداد العربون</h4>
                    <p className="text-xs text-[#C5B49C]">
                      يمكنك تجربة واختبار بوابة الدفع الإلكتروني الملكية لمحاكاة سحب بطاقات مدى وApple Pay وإصدار السندات.
                    </p>
                  </div>
                  <button
                    onClick={() => setPaymentModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#C9A86A] hover:bg-[#E8CF99] text-[#120B11] font-bold text-xs flex items-center gap-2 shadow"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>إجراء تجربة سداد الآن</span>
                  </button>
                </div>

                {/* Recent leads table */}
                <div className="bg-[#120B11] p-6 rounded-2xl border border-white/10">
                  <h4 className="font-royal text-lg text-white font-bold mb-4">آخر طلبات الحجز والاستفسارات</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-[#C9A86A]">
                          <th className="pb-2">الاسم</th>
                          <th className="pb-2">المناسبة</th>
                          <th className="pb-2">التاريخ</th>
                          <th className="pb-2">القاعة</th>
                          <th className="pb-2">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {draftDb.leads.slice(0, 4).map((l) => (
                          <tr key={l.id} className="hover:bg-white/5">
                            <td className="py-2.5 font-bold text-white">{l.name}</td>
                            <td className="py-2.5 text-[#E5DEC9]">{l.occasion}</td>
                            <td className="py-2.5 tabular-nums font-mono">{l.date}</td>
                            <td className="py-2.5 text-[#C9A86A]">{l.hall}</td>
                            <td className="py-2.5">
                              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-semibold">
                                {l.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SITE CONFIG (HERO & GENERAL) */}
            {activeTab === 'site_config' && (
              <div className="space-y-6">
                <h3 className="font-royal text-2xl text-white font-bold mb-2">
                  {lang === 'ar' ? 'إعدادات هوية القصر والواجهة' : 'Palace Identity & Hero Settings'}
                </h3>

                <div className="bg-[#120B11] p-6 rounded-2xl border border-white/10 space-y-4 text-xs">
                  <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold block">
                    نصوص الشاشة الافتتاحية (Hero Section)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#C5B49C] block mb-1">اسم القصر (بالعربية)</label>
                      <input
                        type="text"
                        value={draftDb.siteConfig.hero.titleAr}
                        onChange={(e) =>
                          setDraftDb({
                            ...draftDb,
                            siteConfig: {
                              ...draftDb.siteConfig,
                              hero: { ...draftDb.siteConfig.hero, titleAr: e.target.value }
                            }
                          })
                        }
                        className="w-full bg-[#180E17] border border-white/20 focus:border-[#C9A86A] rounded-lg p-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[#C5B49C] block mb-1">اسم القصر (بالإنجليزية)</label>
                      <input
                        type="text"
                        value={draftDb.siteConfig.hero.titleEn}
                        onChange={(e) =>
                          setDraftDb({
                            ...draftDb,
                            siteConfig: {
                              ...draftDb.siteConfig,
                              hero: { ...draftDb.siteConfig.hero, titleEn: e.target.value }
                            }
                          })
                        }
                        className="w-full bg-[#180E17] border border-white/20 focus:border-[#C9A86A] rounded-lg p-2.5 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#C5B49C] block mb-1">العبارة الملكية الرئيسية (العنوان العريض)</label>
                    <input
                      type="text"
                      value={draftDb.siteConfig.hero.sloganAr}
                      onChange={(e) =>
                        setDraftDb({
                          ...draftDb,
                          siteConfig: {
                            ...draftDb.siteConfig,
                            hero: { ...draftDb.siteConfig.hero, sloganAr: e.target.value }
                          }
                        })
                      }
                      className="w-full bg-[#180E17] border border-white/20 focus:border-[#C9A86A] rounded-lg p-2.5 text-white font-royal text-base"
                    />
                  </div>

                  <div>
                    <label className="text-[#C5B49C] block mb-1">الوصف الفرعي لليلة العمر</label>
                    <textarea
                      rows={2}
                      value={draftDb.siteConfig.hero.descriptionAr}
                      onChange={(e) =>
                        setDraftDb({
                          ...draftDb,
                          siteConfig: {
                            ...draftDb.siteConfig,
                            hero: { ...draftDb.siteConfig.hero, descriptionAr: e.target.value }
                          }
                        })
                      }
                      className="w-full bg-[#180E17] border border-white/20 focus:border-[#C9A86A] rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="bg-[#120B11] p-6 rounded-2xl border border-white/10 space-y-4 text-xs">
                  <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold block">
                    بيانات التواصل والتشريفات
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#C5B49C] block mb-1">رقم الهاتف الرسمي</label>
                      <input
                        type="text"
                        value={draftDb.siteConfig.contact.phone}
                        onChange={(e) =>
                          setDraftDb({
                            ...draftDb,
                            siteConfig: {
                              ...draftDb.siteConfig,
                              contact: { ...draftDb.siteConfig.contact, phone: e.target.value }
                            }
                          })
                        }
                        className="w-full bg-[#180E17] border border-white/20 rounded-lg p-2.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[#C5B49C] block mb-1">رقم الواتساب للاستفسارات</label>
                      <input
                        type="text"
                        value={draftDb.siteConfig.contact.whatsapp}
                        onChange={(e) =>
                          setDraftDb({
                            ...draftDb,
                            siteConfig: {
                              ...draftDb.siteConfig,
                              contact: { ...draftDb.siteConfig.contact, whatsapp: e.target.value }
                            }
                          })
                        }
                        className="w-full bg-[#180E17] border border-white/20 rounded-lg p-2.5 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#C5B49C] block mb-1">عنوان القصر المعتمد</label>
                    <input
                      type="text"
                      value={draftDb.siteConfig.contact.addressAr}
                      onChange={(e) =>
                        setDraftDb({
                          ...draftDb,
                          siteConfig: {
                            ...draftDb.siteConfig,
                            contact: { ...draftDb.siteConfig.contact, addressAr: e.target.value }
                          }
                        })
                      }
                      className="w-full bg-[#180E17] border border-white/20 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. HALLS MANAGER */}
            {activeTab === 'halls' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-royal text-2xl text-white font-bold">
                    إدارة قاعات القصر والمواصفات
                  </h3>
                </div>

                <div className="space-y-6">
                  {draftDb.halls.map((hall, idx) => (
                    <div key={hall.id} className="bg-[#120B11] p-6 rounded-2xl border border-white/10 space-y-4 text-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="font-royal text-lg font-bold text-[#C9A86A]">{hall.nameAr}</span>
                        <span className="text-[11px] text-[#A6957E] font-mono">{hall.id}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[#C5B49C] block mb-1">اسم القاعة</label>
                          <input
                            type="text"
                            value={hall.nameAr}
                            onChange={(e) => {
                              const updated = [...draftDb.halls];
                              updated[idx].nameAr = e.target.value;
                              setDraftDb({ ...draftDb, halls: updated });
                            }}
                            className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[#C5B49C] block mb-1">سعة الضيوف</label>
                          <input
                            type="text"
                            value={hall.capacity}
                            onChange={(e) => {
                              const updated = [...draftDb.halls];
                              updated[idx].capacity = e.target.value;
                              setDraftDb({ ...draftDb, halls: updated });
                            }}
                            className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[#C5B49C] block mb-1">وصف القاعة</label>
                        <textarea
                          rows={2}
                          value={hall.descriptionAr}
                          onChange={(e) => {
                            const updated = [...draftDb.halls];
                            updated[idx].descriptionAr = e.target.value;
                            setDraftDb({ ...draftDb, halls: updated });
                          }}
                          className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[#C5B49C] block mb-1">المساحة</label>
                          <input
                            type="text"
                            value={hall.specifications.area}
                            onChange={(e) => {
                              const updated = [...draftDb.halls];
                              updated[idx].specifications.area = e.target.value;
                              setDraftDb({ ...draftDb, halls: updated });
                            }}
                            className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[#C5B49C] block mb-1">أبعاد المسرح</label>
                          <input
                            type="text"
                            value={hall.specifications.stageDimensions}
                            onChange={(e) => {
                              const updated = [...draftDb.halls];
                              updated[idx].specifications.stageDimensions = e.target.value;
                              setDraftDb({ ...draftDb, halls: updated });
                            }}
                            className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. NIGHT DESIGNER & PRICING */}
            {activeTab === 'night_designer' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-royal text-2xl text-white font-bold">
                    إدارة أسعار مصمم ليلة الملكات والخدمات
                  </h3>
                </div>

                {/* Base pricing */}
                <div className="bg-[#120B11] p-6 rounded-2xl border border-white/10 space-y-4 text-xs">
                  <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold block">
                    الأسعار الأساسية للقاعات والضيافة
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[#C5B49C] block mb-1">قاعة الملكات (ريال)</label>
                      <input
                        type="number"
                        value={draftDb.siteConfig.pricingDefaults.queensHallBase}
                        onChange={(e) =>
                          setDraftDb({
                            ...draftDb,
                            siteConfig: {
                              ...draftDb.siteConfig,
                              pricingDefaults: {
                                ...draftDb.siteConfig.pricingDefaults,
                                queensHallBase: Number(e.target.value)
                              }
                            }
                          })
                        }
                        className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="text-[#C5B49C] block mb-1">قاعة الفرسان (ريال)</label>
                      <input
                        type="number"
                        value={draftDb.siteConfig.pricingDefaults.knightsHallBase}
                        onChange={(e) =>
                          setDraftDb({
                            ...draftDb,
                            siteConfig: {
                              ...draftDb.siteConfig,
                              pricingDefaults: {
                                ...draftDb.siteConfig.pricingDefaults,
                                knightsHallBase: Number(e.target.value)
                              }
                            }
                          })
                        }
                        className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="text-[#C5B49C] block mb-1">كلا القاعتين (ريال)</label>
                      <input
                        type="number"
                        value={draftDb.siteConfig.pricingDefaults.bothHallsBase}
                        onChange={(e) =>
                          setDraftDb({
                            ...draftDb,
                            siteConfig: {
                              ...draftDb.siteConfig,
                              pricingDefaults: {
                                ...draftDb.siteConfig.pricingDefaults,
                                bothHallsBase: Number(e.target.value)
                              }
                            }
                          })
                        }
                        className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="text-[#C5B49C] block mb-1">بوفيه الضيف (ريال/شخص)</label>
                      <input
                        type="number"
                        value={draftDb.siteConfig.pricingDefaults.cateringPerGuest}
                        onChange={(e) =>
                          setDraftDb({
                            ...draftDb,
                            siteConfig: {
                              ...draftDb.siteConfig,
                              pricingDefaults: {
                                ...draftDb.siteConfig.pricingDefaults,
                                cateringPerGuest: Number(e.target.value)
                              }
                            }
                          })
                        }
                        className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white font-mono tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional services list */}
                <div className="bg-[#120B11] p-6 rounded-2xl border border-white/10 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold">
                      الخدمات الإضافية المتاحة للعروس
                    </span>
                    <button
                      onClick={() => {
                        const newServ: NightService = {
                          id: `serv-${Date.now()}`,
                          labelAr: 'خدمة ملكية جديدة',
                          labelEn: 'New Royal Service',
                          price: 5000,
                          category: 'decor'
                        };
                        setDraftDb({
                          ...draftDb,
                          nightServices: [...draftDb.nightServices, newServ]
                        });
                      }}
                      className="px-3 py-1 bg-[#C9A86A] text-[#120B11] font-bold rounded flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة خدمة</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {draftDb.nightServices.map((serv, idx) => (
                      <div key={serv.id} className="flex items-center gap-3 p-3 bg-[#180E17] rounded-xl border border-white/10">
                        <input
                          type="text"
                          value={serv.labelAr}
                          onChange={(e) => {
                            const updated = [...draftDb.nightServices];
                            updated[idx].labelAr = e.target.value;
                            setDraftDb({ ...draftDb, nightServices: updated });
                          }}
                          className="flex-1 bg-[#120B11] border border-white/20 rounded p-1.5 text-white"
                        />
                        <div className="w-32 flex items-center gap-1">
                          <input
                            type="number"
                            value={serv.price}
                            onChange={(e) => {
                              const updated = [...draftDb.nightServices];
                              updated[idx].price = Number(e.target.value);
                              setDraftDb({ ...draftDb, nightServices: updated });
                            }}
                            className="w-full bg-[#120B11] border border-white/20 rounded p-1.5 text-white font-mono tabular-nums"
                          />
                          <span className="text-[10px] text-[#A6957E]">ريال</span>
                        </div>
                        <button
                          onClick={() => {
                            const updated = draftDb.nightServices.filter((s) => s.id !== serv.id);
                            setDraftDb({ ...draftDb, nightServices: updated });
                          }}
                          className="text-red-400 p-1.5 hover:bg-white/5 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. CALENDAR & AVAILABILITY */}
            {activeTab === 'calendar' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-royal text-2xl text-white font-bold">
                    إدارة تقويم وتوافر المواعيد
                  </h3>
                  <button
                    onClick={() => {
                      const newDate: AvailabilityDate = {
                        date: new Date().toISOString().split('T')[0],
                        status: 'available',
                        hall: 'both'
                      };
                      setDraftDb({
                        ...draftDb,
                        availabilitySchedule: [newDate, ...draftDb.availabilitySchedule]
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#C9A86A] text-[#120B11] font-bold text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة تاريخ للتقويم</span>
                  </button>
                </div>

                <div className="bg-[#120B11] p-6 rounded-2xl border border-white/10 space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-[#C9A86A]">
                          <th className="pb-2">التاريخ (YYYY-MM-DD)</th>
                          <th className="pb-2">الحالة</th>
                          <th className="pb-2">القاعة</th>
                          <th className="pb-2">ملاحظة الحجز</th>
                          <th className="pb-2 text-center">حذف</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {draftDb.availabilitySchedule.map((item, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="py-2">
                              <input
                                type="date"
                                value={item.date}
                                onChange={(e) => {
                                  const updated = [...draftDb.availabilitySchedule];
                                  updated[idx].date = e.target.value;
                                  setDraftDb({ ...draftDb, availabilitySchedule: updated });
                                }}
                                className="bg-[#180E17] border border-white/20 rounded p-1 text-white font-mono"
                              />
                            </td>
                            <td className="py-2">
                              <select
                                value={item.status}
                                onChange={(e) => {
                                  const updated = [...draftDb.availabilitySchedule];
                                  updated[idx].status = e.target.value as any;
                                  setDraftDb({ ...draftDb, availabilitySchedule: updated });
                                }}
                                className="bg-[#180E17] border border-white/20 rounded p-1 text-white"
                              >
                                <option value="available">متاح (Available)</option>
                                <option value="booked">محجوز (Booked)</option>
                                <option value="limited">محدود / قيد الانتظار (Limited)</option>
                              </select>
                            </td>
                            <td className="py-2">
                              <select
                                value={item.hall}
                                onChange={(e) => {
                                  const updated = [...draftDb.availabilitySchedule];
                                  updated[idx].hall = e.target.value as any;
                                  setDraftDb({ ...draftDb, availabilitySchedule: updated });
                                }}
                                className="bg-[#180E17] border border-white/20 rounded p-1 text-white"
                              >
                                <option value="both">كلا القاعتين</option>
                                <option value="queens">قاعة الملكات</option>
                                <option value="knights">قاعة الفرسان</option>
                              </select>
                            </td>
                            <td className="py-2">
                              <input
                                type="text"
                                placeholder="مثلاً: زفاف آل فلان..."
                                value={item.noteAr || ''}
                                onChange={(e) => {
                                  const updated = [...draftDb.availabilitySchedule];
                                  updated[idx].noteAr = e.target.value;
                                  setDraftDb({ ...draftDb, availabilitySchedule: updated });
                                }}
                                className="w-full bg-[#180E17] border border-white/20 rounded p-1 text-white"
                              />
                            </td>
                            <td className="py-2 text-center">
                              <button
                                onClick={() => {
                                  const updated = draftDb.availabilitySchedule.filter((_, i) => i !== idx);
                                  setDraftDb({ ...draftDb, availabilitySchedule: updated });
                                }}
                                className="text-red-400 p-1 hover:bg-white/5 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 6. VIRTUAL TOUR */}
            {activeTab === 'virtual_tour' && (
              <div className="space-y-6">
                <h3 className="font-royal text-2xl text-white font-bold">
                  إدارة نقاط الجولة الافتراضية 360° (Hotspots)
                </h3>
                <div className="space-y-4">
                  {draftDb.tourNodes.map((node, nodeIdx) => (
                    <div key={node.id} className="bg-[#120B11] p-6 rounded-2xl border border-white/10 space-y-4 text-xs">
                      <span className="font-royal text-lg font-bold text-[#C9A86A] block">
                        الجناح: {node.nameAr}
                      </span>
                      <div className="space-y-3">
                        {node.hotspots.map((spot, spotIdx) => (
                          <div key={spotIdx} className="p-3 bg-[#180E17] rounded-xl border border-white/10 space-y-2">
                            <input
                              type="text"
                              value={spot.titleAr}
                              onChange={(e) => {
                                const updated = [...draftDb.tourNodes];
                                updated[nodeIdx].hotspots[spotIdx].titleAr = e.target.value;
                                setDraftDb({ ...draftDb, tourNodes: updated });
                              }}
                              className="w-full bg-[#120B11] border border-white/20 rounded p-1.5 font-bold text-white"
                            />
                            <textarea
                              rows={2}
                              value={spot.descriptionAr}
                              onChange={(e) => {
                                const updated = [...draftDb.tourNodes];
                                updated[nodeIdx].hotspots[spotIdx].descriptionAr = e.target.value;
                                setDraftDb({ ...draftDb, tourNodes: updated });
                              }}
                              className="w-full bg-[#120B11] border border-white/20 rounded p-1.5 text-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. ENTRANCES */}
            {activeTab === 'entrances' && (
              <div className="space-y-6">
                <h3 className="font-royal text-2xl text-white font-bold">
                  إدارة سيناريوهات وموسيقى زفّات العروس
                </h3>
                <div className="space-y-4">
                  {draftDb.entranceStyles.map((style, idx) => (
                    <div key={style.id} className="bg-[#120B11] p-6 rounded-2xl border border-white/10 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[#C5B49C] block mb-1">اسم سيناريو الزفة</label>
                          <input
                            type="text"
                            value={style.nameAr}
                            onChange={(e) => {
                              const updated = [...draftDb.entranceStyles];
                              updated[idx].nameAr = e.target.value;
                              setDraftDb({ ...draftDb, entranceStyles: updated });
                            }}
                            className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[#C5B49C] block mb-1">نوع المعزوفة الموسيقية</label>
                          <input
                            type="text"
                            value={style.audioTempo}
                            onChange={(e) => {
                              const updated = [...draftDb.entranceStyles];
                              updated[idx].audioTempo = e.target.value;
                              setDraftDb({ ...draftDb, entranceStyles: updated });
                            }}
                            className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[#C5B49C] block mb-1">وصف الزفة</label>
                        <textarea
                          rows={2}
                          value={style.descriptionAr}
                          onChange={(e) => {
                            const updated = [...draftDb.entranceStyles];
                            updated[idx].descriptionAr = e.target.value;
                            setDraftDb({ ...draftDb, entranceStyles: updated });
                          }}
                          className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. HOSPITALITY */}
            {activeTab === 'hospitality' && (
              <div className="space-y-6">
                <h3 className="font-royal text-2xl text-white font-bold">
                  إدارة محتوى وتفاصيل الضيافة والبوفيه
                </h3>
                <div className="space-y-4">
                  {draftDb.hospitality.map((hosp, idx) => (
                    <div key={hosp.id} className="bg-[#120B11] p-6 rounded-2xl border border-white/10 space-y-3 text-xs">
                      <div>
                        <label className="text-[#C5B49C] block mb-1">عنوان التجربة</label>
                        <input
                          type="text"
                          value={hosp.titleAr}
                          onChange={(e) => {
                            const updated = [...draftDb.hospitality];
                            updated[idx].titleAr = e.target.value;
                            setDraftDb({ ...draftDb, hospitality: updated });
                          }}
                          className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[#C5B49C] block mb-1">الوصف</label>
                        <textarea
                          rows={2}
                          value={hosp.descAr}
                          onChange={(e) => {
                            const updated = [...draftDb.hospitality];
                            updated[idx].descAr = e.target.value;
                            setDraftDb({ ...draftDb, hospitality: updated });
                          }}
                          className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. INSTAGRAM FEED */}
            {activeTab === 'instagram' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-royal text-2xl text-white font-bold">
                    إدارة منشورات معرض الإنستقرام
                  </h3>
                  <button
                    onClick={() => {
                      const newPost: InstagramPost = {
                        id: `post-${Date.now()}`,
                        imageUrl: draftDb.halls[0]?.image || '',
                        likes: 1250,
                        captionAr: 'منشور جديد من أفراح قصر الملكات ✨',
                        captionEn: 'New royal wedding highlight',
                        tag: '#قصر_الملكات',
                        date: 'الآن'
                      };
                      setDraftDb({
                        ...draftDb,
                        instagramPosts: [newPost, ...draftDb.instagramPosts]
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#C9A86A] text-[#120B11] font-bold text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة منشور جديد</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {draftDb.instagramPosts.map((post, idx) => (
                    <div key={post.id} className="bg-[#120B11] p-4 rounded-2xl border border-white/10 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">منشور {idx + 1}</span>
                        <button
                          onClick={() => {
                            const updated = draftDb.instagramPosts.filter((p) => p.id !== post.id);
                            setDraftDb({ ...draftDb, instagramPosts: updated });
                          }}
                          className="text-red-400 p-1 hover:bg-white/5 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={post.captionAr}
                        onChange={(e) => {
                          const updated = [...draftDb.instagramPosts];
                          updated[idx].captionAr = e.target.value;
                          setDraftDb({ ...draftDb, instagramPosts: updated });
                        }}
                        className="w-full bg-[#180E17] border border-white/20 rounded p-2 text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={post.tag}
                          onChange={(e) => {
                            const updated = [...draftDb.instagramPosts];
                            updated[idx].tag = e.target.value;
                            setDraftDb({ ...draftDb, instagramPosts: updated });
                          }}
                          className="bg-[#180E17] border border-white/20 rounded p-1.5 text-white"
                        />
                        <input
                          type="number"
                          value={post.likes}
                          onChange={(e) => {
                            const updated = [...draftDb.instagramPosts];
                            updated[idx].likes = Number(e.target.value);
                            setDraftDb({ ...draftDb, instagramPosts: updated });
                          }}
                          className="bg-[#180E17] border border-white/20 rounded p-1.5 text-white font-mono tabular-nums"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. CRM LEADS */}
            {activeTab === 'crm' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-royal text-2xl text-white font-bold">
                    إدارة العملاء وطلبات الحجز (CRM)
                  </h3>
                  <button
                    onClick={() => {
                      const newLead: LeadCRM = {
                        id: `lead-${Date.now()}`,
                        name: 'عميل جديد',
                        phone: '+966500000000',
                        occasion: 'زفاف',
                        date: '2026-11-20',
                        guests: 350,
                        hall: 'قاعة الملكات',
                        theme: 'Royal Imperial',
                        estimatedBudget: 60000,
                        status: 'new',
                        notes: 'تمت الإضافة يدوياً من لوحة التحكم',
                        createdAt: new Date().toISOString().split('T')[0]
                      };
                      setDraftDb({ ...draftDb, leads: [newLead, ...draftDb.leads] });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#C9A86A] text-[#120B11] font-bold text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة عميل جديد</span>
                  </button>
                </div>

                <div className="bg-[#120B11] rounded-2xl border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-[#C9A86A] p-4 bg-[#180E17]">
                          <th className="p-3">العميل / الجوال</th>
                          <th className="p-3">المناسبة والقاعة</th>
                          <th className="p-3">التاريخ</th>
                          <th className="p-3">الميزانية</th>
                          <th className="p-3">حالة الحجز</th>
                          <th className="p-3 text-center">إجراء السداد</th>
                          <th className="p-3 text-center">حذف</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {draftDb.leads.map((lead, idx) => (
                          <tr key={lead.id} className="hover:bg-white/5">
                            <td className="p-3">
                              <input
                                type="text"
                                value={lead.name}
                                onChange={(e) => {
                                  const updated = [...draftDb.leads];
                                  updated[idx].name = e.target.value;
                                  setDraftDb({ ...draftDb, leads: updated });
                                }}
                                className="bg-transparent border-b border-transparent hover:border-white/30 focus:border-[#C9A86A] text-white font-bold outline-none"
                              />
                              <div className="text-[11px] text-[#A6957E] font-mono">{lead.phone}</div>
                            </td>
                            <td className="p-3">
                              <div className="text-white">{lead.occasion}</div>
                              <div className="text-[11px] text-[#C9A86A]">{lead.hall}</div>
                            </td>
                            <td className="p-3 tabular-nums font-mono">{lead.date}</td>
                            <td className="p-3 font-bold text-[#C9A86A] tabular-nums">
                              {lead.estimatedBudget.toLocaleString()} ريال
                            </td>
                            <td className="p-3">
                              <select
                                value={lead.status}
                                onChange={(e) => {
                                  const updated = [...draftDb.leads];
                                  updated[idx].status = e.target.value as any;
                                  setDraftDb({ ...draftDb, leads: updated });
                                }}
                                className="bg-[#180E17] border border-white/20 rounded p-1 text-white text-[11px]"
                              >
                                <option value="new">جديد (New)</option>
                                <option value="contacted">تم التواصل (Contacted)</option>
                                <option value="visit_scheduled">موعد زيارة (Visit)</option>
                                <option value="quote_sent">تم إرسال العرض (Quote)</option>
                                <option value="confirmed">مؤكد ومدفوع (Confirmed)</option>
                                <option value="archived">مؤرشف (Archived)</option>
                              </select>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => {
                                  setSelectedLeadForPayment(lead);
                                  setPaymentModalOpen(true);
                                }}
                                className="px-2.5 py-1 rounded bg-[#C9A86A]/20 hover:bg-[#C9A86A] text-[#C9A86A] hover:text-[#120B11] text-[11px] font-semibold transition-colors"
                              >
                                {lead.status === 'confirmed' ? 'سداد إضافي' : 'تحصيل العربون'}
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => {
                                  const updated = draftDb.leads.filter((l) => l.id !== lead.id);
                                  setDraftDb({ ...draftDb, leads: updated });
                                }}
                                className="text-red-400 p-1 hover:bg-white/5 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 11. PAYMENTS GATEWAY */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-royal text-2xl text-white font-bold">
                      بوابة الدفع وسجل العمليات المالية (Payment Ledger)
                    </h3>
                    <p className="text-xs text-[#C5B49C]">
                      سجل لكافة المعاملات وعمليات سداد العرابين المحصلة إلكترونياً عبر مدى وApple Pay.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLeadForPayment(null);
                      setPaymentModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A86A] to-[#E8CF99] text-[#120B11] font-bold text-xs flex items-center gap-2 shadow"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>سداد تجريبي جديد (Launch Demo Gateway)</span>
                  </button>
                </div>

                <div className="bg-[#120B11] rounded-2xl border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-[#C9A86A] p-4 bg-[#180E17]">
                          <th className="p-3">رقم العملية</th>
                          <th className="p-3">العميل</th>
                          <th className="p-3">المبلغ المسدد</th>
                          <th className="p-3">الوسيلة</th>
                          <th className="p-3">رمز التفويض</th>
                          <th className="p-3">التاريخ والوقت</th>
                          <th className="p-3">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {draftDb.payments.map((tx) => (
                          <tr key={tx.id} className="hover:bg-white/5">
                            <td className="p-3 font-mono font-bold text-[#C9A86A]">{tx.transactionRef}</td>
                            <td className="p-3 font-semibold text-white">{tx.clientName}</td>
                            <td className="p-3 font-royal text-base text-white tabular-nums font-bold">
                              {tx.amount.toLocaleString()} ريال
                            </td>
                            <td className="p-3 uppercase text-white/80">
                              {tx.paymentMethod.replace('_', ' ')} (•••• {tx.cardLast4})
                            </td>
                            <td className="p-3 font-mono text-emerald-400">{tx.authCode}</td>
                            <td className="p-3 font-mono text-white/60">{tx.date} {tx.timestamp}</td>
                            <td className="p-3">
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-semibold">
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 12. DATABASE & BACKUP */}
            {activeTab === 'database' && (
              <div className="space-y-6">
                <h3 className="font-royal text-2xl text-white font-bold">
                  إدارة قاعدة البيانات والنسخ الاحتياطي
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#120B11] p-6 rounded-2xl border border-white/10 space-y-3">
                    <span className="font-royal text-lg text-white font-bold block">تصدير قاعدة البيانات</span>
                    <p className="text-xs text-[#C5B49C]">
                      تحميل نسخة كاملة من بيانات القصر والحجوزات والأسعار كملف JSON مستقل.
                    </p>
                    <button
                      onClick={handleExportJson}
                      className="w-full py-2.5 rounded-xl bg-[#C9A86A] hover:bg-[#E8CF99] text-[#120B11] font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>تصدير JSON</span>
                    </button>
                  </div>

                  <div className="bg-[#120B11] p-6 rounded-2xl border border-white/10 space-y-3">
                    <span className="font-royal text-lg text-white font-bold block">استيراد قاعدة البيانات</span>
                    <p className="text-xs text-[#C5B49C]">
                      رفع ملف JSON لاستعادة أو مزامنة كافة إعدادات الموقع والحجوزات.
                    </p>
                    <label className="w-full py-2.5 rounded-xl border border-[#C9A86A]/40 hover:bg-[#C9A86A]/10 text-[#C9A86A] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>استيراد ملف JSON</span>
                      <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                    </label>
                  </div>

                  <div className="bg-[#120B11] p-6 rounded-2xl border border-white/10 space-y-3">
                    <span className="font-royal text-lg text-white font-bold block">استعادة البيانات الملكية</span>
                    <p className="text-xs text-[#C5B49C]">
                      إعادة ضبط المصنع واسترجاع كافة القاعات والأسعار والخدمات الافتراضية.
                    </p>
                    <button
                      onClick={handleReset}
                      className="w-full py-2.5 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-500/10 font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>استعادة الضبط الافتراضي</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal Launch */}
      {paymentModalOpen && (
        <PaymentGatewayModal
          lang={lang}
          defaultAmount={selectedLeadForPayment?.estimatedBudget ? Math.min(15000, selectedLeadForPayment.estimatedBudget * 0.2) : 10000}
          clientName={selectedLeadForPayment?.name || 'سارة المنصور'}
          clientPhone={selectedLeadForPayment?.phone || '+966501234567'}
          purpose={selectedLeadForPayment ? `عربون حجز ${selectedLeadForPayment.hall} (${selectedLeadForPayment.date})` : 'عربون حجز ليلة ملكية'}
          leadId={selectedLeadForPayment?.id}
          onSuccess={handlePaymentSuccess}
          onClose={() => setPaymentModalOpen(false)}
        />
      )}
    </div>
  );
};
