import React, { useState } from 'react';
import { LeadCRM } from '../data/palaceData';
import { X, Search, Plus, Filter, Phone, MessageSquare, Calendar, Users, DollarSign, CheckCircle2, ChevronDown } from 'lucide-react';
import { playRoyalChime } from '../utils/royalAudio';

interface AdminCRMProps {
  lang: 'ar' | 'en';
  leads: LeadCRM[];
  onUpdateLeadStatus: (id: string, status: LeadCRM['status']) => void;
  onAddLead: (lead: LeadCRM) => void;
  onClose: () => void;
}

export const AdminCRM: React.FC<AdminCRMProps> = ({
  lang,
  leads,
  onUpdateLeadStatus,
  onAddLead,
  onClose
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newLead, setNewLead] = useState<Partial<LeadCRM>>({
    name: '',
    phone: '',
    occasion: 'زفاف',
    date: '2026-11-20',
    guests: 400,
    hall: 'قاعة الملكات',
    theme: 'Imperial Gold',
    estimatedBudget: 80000,
    status: 'new',
    notes: ''
  });

  const statuses: { id: LeadCRM['status']; labelAr: string; labelEn: string; color: string }[] = [
    { id: 'new', labelAr: 'جديد (New)', labelEn: 'New Lead', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    { id: 'contacted', labelAr: 'تم التواصل', labelEn: 'Contacted', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    { id: 'visit_scheduled', labelAr: 'موعد زيارة محدد', labelEn: 'Visit Scheduled', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    { id: 'quote_sent', labelAr: 'تم إرسال العرض', labelEn: 'Quote Sent', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    { id: 'confirmed', labelAr: 'مؤكد ومدفوع', labelEn: 'Confirmed', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    { id: 'archived', labelAr: 'مؤرشف', labelEn: 'Archived', color: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40' }
  ];

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.hall.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalValue = leads.reduce((acc, curr) => acc + (curr.estimatedBudget || 0), 0);
  const scheduledVisits = leads.filter((l) => l.status === 'visit_scheduled').length;
  const confirmedCount = leads.filter((l) => l.status === 'confirmed').length;

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.phone) return;

    playRoyalChime(5, 2);
    onAddLead({
      id: `lead-${Date.now()}`,
      name: newLead.name!,
      phone: newLead.phone!,
      occasion: newLead.occasion || 'زفاف',
      date: newLead.date || '2026-11-20',
      guests: Number(newLead.guests) || 300,
      hall: newLead.hall || 'قاعة الملكات',
      theme: newLead.theme || 'Royal Classic',
      estimatedBudget: Number(newLead.estimatedBudget) || 50000,
      status: (newLead.status as any) || 'new',
      notes: newLead.notes || '',
      createdAt: new Date().toISOString().split('T')[0]
    });
    setIsAddOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#170E16] border border-[#C9A86A]/50 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col h-[90vh]">
        {/* CRM Header Bar */}
        <div className="bg-[#120B11] p-5 sm:p-6 border-b border-[#C9A86A]/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A86A]/20 border border-[#C9A86A] flex items-center justify-center text-[#C9A86A] text-lg font-serif">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-royal text-xl sm:text-2xl text-white font-bold">
                  {lang === 'ar' ? 'لوحة إدارة ومبيعات قصر الملكات' : 'Malekat Palace Sales & CRM Portal'}
                </h2>
                <span className="text-[10px] bg-[#C9A86A]/20 text-[#C9A86A] border border-[#C9A86A]/40 px-2 py-0.5 rounded">
                  Internal Staff Portal
                </span>
              </div>
              <p className="text-xs text-[#C5B49C]">
                {lang === 'ar'
                  ? 'إدارة استفسارات العرائس ومواعيد الزيارات الميدانية وعروض الأسعار'
                  : 'Manage wedding inquiries, venue walkthrough schedules & custom quotations'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2 rounded-lg bg-[#C9A86A] hover:bg-[#E8CF99] text-[#120B11] font-bold text-xs flex items-center gap-1.5 transition-all shadow"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إضافة حجز جديد' : 'New Lead / Booking'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-white/20 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close CRM modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 bg-[#150D14] border-b border-white/10">
          <div className="bg-[#1A0E18] p-4 rounded-xl border border-white/10">
            <span className="text-xs text-[#C5B49C] block mb-1">
              {lang === 'ar' ? 'إجمالي الاستفسارات' : 'Total Inquiries'}
            </span>
            <span className="font-royal text-2xl font-bold text-white tabular-nums">
              {leads.length}
            </span>
          </div>

          <div className="bg-[#1A0E18] p-4 rounded-xl border border-white/10">
            <span className="text-xs text-[#C5B49C] block mb-1">
              {lang === 'ar' ? 'مواعيد زيارات قادمة' : 'Scheduled Visits'}
            </span>
            <span className="font-royal text-2xl font-bold text-amber-400 tabular-nums">
              {scheduledVisits}
            </span>
          </div>

          <div className="bg-[#1A0E18] p-4 rounded-xl border border-white/10">
            <span className="text-xs text-[#C5B49C] block mb-1">
              {lang === 'ar' ? 'حجوزات مؤكدة' : 'Confirmed Bookings'}
            </span>
            <span className="font-royal text-2xl font-bold text-emerald-400 tabular-nums">
              {confirmedCount}
            </span>
          </div>

          <div className="bg-[#1A0E18] p-4 rounded-xl border border-white/10">
            <span className="text-xs text-[#C5B49C] block mb-1">
              {lang === 'ar' ? 'قيمة العروض النشطة' : 'Pipeline Volume'}
            </span>
            <span className="font-royal text-2xl font-bold text-[#C9A86A] tabular-nums">
              {totalValue.toLocaleString()} <span className="text-xs font-sans">ريال</span>
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:px-6 bg-[#170E16] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#C9A86A]" />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'بحث بالاسم، الجوال، أو القاعة...' : 'Search leads by name, phone, hall...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#120B11] border border-white/15 focus:border-[#C9A86A] rounded-lg px-3 py-1.5 text-xs text-white outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-[#C9A86A] shrink-0" />
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                filterStatus === 'all' ? 'bg-[#C9A86A] text-[#120B11] font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'الكل' : 'All'} ({leads.length})
            </button>
            {statuses.map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                  filterStatus === st.id ? 'bg-[#C9A86A] text-[#120B11] font-bold' : 'text-white/70 hover:text-white'
                }`}
              >
                {lang === 'ar' ? st.labelAr : st.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#140C13]">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#C9A86A] font-semibold">
                  <th className="pb-3 px-3">{lang === 'ar' ? 'العميلة / العميل' : 'Client'}</th>
                  <th className="pb-3 px-3">{lang === 'ar' ? 'المناسبة والقاعة' : 'Occasion & Hall'}</th>
                  <th className="pb-3 px-3">{lang === 'ar' ? 'تاريخ الحفل' : 'Target Date'}</th>
                  <th className="pb-3 px-3">{lang === 'ar' ? 'الضيوف' : 'Guests'}</th>
                  <th className="pb-3 px-3">{lang === 'ar' ? 'الميزانية التقديرية' : 'Estimated Budget'}</th>
                  <th className="pb-3 px-3">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="pb-3 px-3 text-center">{lang === 'ar' ? 'الإجراء السريع' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => {
                  const statusObj = statuses.find((s) => s.id === lead.status) || statuses[0];
                  return (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-medium text-white">
                        <div className="font-bold text-sm">{lead.name}</div>
                        <div className="text-[11px] text-[#A6957E] font-mono tabular-nums">{lead.phone}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-[#E5DEC9]">{lead.occasion}</div>
                        <div className="text-[11px] text-[#C9A86A]">{lead.hall}</div>
                      </td>
                      <td className="py-3 px-3 text-white tabular-nums font-mono">
                        {lead.date}
                      </td>
                      <td className="py-3 px-3 tabular-nums">
                        {lead.guests} {lang === 'ar' ? 'ضيف' : 'Guests'}
                      </td>
                      <td className="py-3 px-3 text-[#C9A86A] font-bold tabular-nums">
                        {lead.estimatedBudget.toLocaleString()} ريال
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={lead.status}
                          onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as any)}
                          className={`px-2 py-1 rounded text-[11px] border font-semibold outline-none bg-[#170E16] cursor-pointer ${statusObj.color}`}
                        >
                          {statuses.map((st) => (
                            <option key={st.id} value={st.id} className="bg-[#170E16] text-white">
                              {lang === 'ar' ? st.labelAr : st.labelEn}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً أ/ ${lead.name}، معك إدارة العلاقات العامة بقصر الملكات بخصوص مناسبتكم الكريمة المقررة في ${lead.date}...`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold shadow"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>واتساب</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Lead Modal Inside CRM */}
        {isAddOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
            <div className="w-full max-w-md bg-[#180E17] border border-[#C9A86A]/50 rounded-2xl p-6 shadow-2xl">
              <h3 className="font-royal text-xl text-white font-bold mb-4">
                {lang === 'ar' ? 'إضافة استفسار / حجز مباشر' : 'Create Direct Inquiry'}
              </h3>
              <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
                <div>
                  <label className="text-[#C5B49C] block mb-1">الاسم الكريم *</label>
                  <input
                    type="text"
                    required
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="w-full bg-[#120B11] border border-white/20 rounded p-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#C5B49C] block mb-1">رقم الجوال *</label>
                  <input
                    type="tel"
                    required
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full bg-[#120B11] border border-white/20 rounded p-2 text-white outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#C5B49C] block mb-1">تاريخ الحفل</label>
                    <input
                      type="date"
                      value={newLead.date}
                      onChange={(e) => setNewLead({ ...newLead, date: e.target.value })}
                      className="w-full bg-[#120B11] border border-white/20 rounded p-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[#C5B49C] block mb-1">عدد الضيوف</label>
                    <input
                      type="number"
                      value={newLead.guests}
                      onChange={(e) => setNewLead({ ...newLead, guests: Number(e.target.value) })}
                      className="w-full bg-[#120B11] border border-white/20 rounded p-2 text-white outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[#C5B49C] block mb-1">القاعة المختارة</label>
                  <select
                    value={newLead.hall}
                    onChange={(e) => setNewLead({ ...newLead, hall: e.target.value })}
                    className="w-full bg-[#120B11] border border-white/20 rounded p-2 text-white outline-none"
                  >
                    <option value="قاعة الملكات">قاعة الملكات (سيدات)</option>
                    <option value="قاعة الفرسان">قاعة الفرسان (رجال)</option>
                    <option value="قاعة الملكات + قاعة الفرسان">كلا القاعتين معاً</option>
                  </select>
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 text-white/60 hover:text-white"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded bg-[#C9A86A] text-[#120B11] font-bold"
                  >
                    حفظ الاستفسار
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
