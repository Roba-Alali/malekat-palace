import React, { useState } from 'react';
import { HallInfo } from '../data/palaceData';
import { Crown, Sparkles, CheckCircle2, ZoomIn, X, Maximize2 } from 'lucide-react';
import { playRoyalChime } from '../utils/royalAudio';

interface PalaceHallsProps {
  lang: 'ar' | 'en';
  halls?: HallInfo[];
  onBookHall: (hallName: string) => void;
}

export const PalaceHalls: React.FC<PalaceHallsProps> = ({ lang, halls, onBookHall }) => {
  const activeHallsList = halls && halls.length > 0 ? halls : [];
  const [selectedHallId, setSelectedHallId] = useState<string>(activeHallsList[0]?.id || 'queens-hall');
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [modalZoomScale, setModalZoomScale] = useState(1.2);

  const activeHall: HallInfo = activeHallsList.find((h) => h.id === selectedHallId) || activeHallsList[0];

  if (!activeHall) return null;

  return (
    <section id="palace-halls" className="relative py-28 bg-[#120B11] text-[#F8F5EE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 gsap-header">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A86A] mb-3 font-semibold font-cinzel">
            <Crown className="w-4 h-4 text-[#C9A86A]" />
            <span>{lang === 'ar' ? 'صروح الفخامة المعمارية' : 'THE PALACE BALLROOMS'}</span>
          </div>
          <h2 className="font-royal text-3xl sm:text-5xl md:text-6xl text-white font-bold leading-tight">
            {lang === 'ar' ? 'قاعات ملكية تليق بأبهى الليالي' : 'Grand Ballrooms of Unrivaled Opulence'}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#D0C2A8] font-light">
            {lang === 'ar'
              ? 'صممت قاعات قصر الملكات بأعلى المعايير الهندسية والجمالية لتوفر تجربة احتفالية استثنائية مع خصوصية مطلقة واستقلالية تامة لكل قاعة.'
              : 'Architecturally curated to the highest standards of European palatial aesthetics, ensuring supreme privacy and bespoke royal grandeur.'}
          </p>
        </div>

        {/* Hall Switcher Tabs */}
        <div className="flex justify-center mb-12 gsap-reveal">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#1C101B] border border-[#C9A86A]/30">
            {activeHallsList.map((hall) => {
              const isSelected = selectedHallId === hall.id;
              return (
                <button
                  key={hall.id}
                  onClick={() => {
                    playRoyalChime(3, 1);
                    setSelectedHallId(hall.id);
                  }}
                  className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#C9A86A] text-[#120B11] shadow-[0_0_20px_rgba(201,168,106,0.35)] scale-105'
                      : 'text-[#E5DEC9] hover:text-[#C9A86A]'
                  }`}
                >
                  {lang === 'ar' ? hall.nameAr : hall.nameEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Hall Detailed Showcase */}
        <div className="bg-[#170E16] border border-[#C9A86A]/30 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gsap-panel-reveal gsap-hall-showcase">
          {/* Hall Visual Carrier with Zoom Button and Hover Zoom In */}
          <div className="lg:col-span-7 relative min-h-[420px] lg:min-h-full overflow-hidden bg-black group cursor-pointer"
            onClick={() => {
              playRoyalChime(3, 1);
              setIsZoomModalOpen(true);
            }}
          >
            <img
              src={activeHall.image}
              alt={activeHall.nameEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-7000 ease-out scale-110 group-hover:scale-118"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#170E16] via-transparent to-black/30" />

            {/* Badges without hints */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
              <span className="bg-[#120B11]/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#C9A86A]/40 text-xs font-semibold text-[#C9A86A]">
                {activeHall.capacity}
              </span>
              <span className="bg-[#120B11]/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs text-[#F8F5EE]">
                {lang === 'ar' ? activeHall.subtitleAr : activeHall.subtitleEn}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="font-royal text-3xl sm:text-4xl text-white font-bold mb-2">
                {lang === 'ar' ? activeHall.nameAr : activeHall.nameEn}
              </h3>
              <p className="text-xs sm:text-sm text-[#E5DEC9] line-clamp-2">
                {lang === 'ar' ? activeHall.descriptionAr : activeHall.descriptionEn}
              </p>
            </div>
          </div>

          {/* Hall Specifications & Features */}
          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold block mb-3 font-cinzel">
                {lang === 'ar' ? 'المواصفات الفنية والمعمارية' : 'ARCHITECTURAL SPECIFICATIONS'}
              </span>

              {/* Grid of specs */}
              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10 gsap-hall-specs">
                <div className="bg-[#130A12] p-3.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-[#C4B49C] block mb-1">
                    {lang === 'ar' ? 'المساحة الإجمالية' : 'Total Area'}
                  </span>
                  <span className="font-royal text-xl font-bold text-white tabular-nums">
                    {activeHall.specifications.area}
                  </span>
                </div>

                <div className="bg-[#130A12] p-3.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-[#C4B49C] block mb-1">
                    {lang === 'ar' ? 'أبعاد المسرح والكوشة' : 'Stage Dimensions'}
                  </span>
                  <span className="font-royal text-xl font-bold text-white tabular-nums">
                    {activeHall.specifications.stageDimensions}
                  </span>
                </div>

                <div className="bg-[#130A12] p-3.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-[#C4B49C] block mb-1">
                    {lang === 'ar' ? 'نوع الدرج والمدخل' : 'Staircase Architecture'}
                  </span>
                  <span className="text-xs font-semibold text-[#C9A86A]">
                    {activeHall.specifications.staircase}
                  </span>
                </div>

                <div className="bg-[#130A12] p-3.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-[#C4B49C] block mb-1">
                    {lang === 'ar' ? 'الأجنحة الخاصة' : 'Private VIP Suites'}
                  </span>
                  <span className="text-xs font-semibold text-[#C9A86A]">
                    {activeHall.specifications.suites}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-6 space-y-3 gsap-hall-features">
                <span className="text-xs font-semibold text-white block">
                  {lang === 'ar' ? 'مزايا القاعة الحصرية:' : 'Exclusive Hall Amenities:'}
                </span>
                {(lang === 'ar' ? activeHall.featuresAr : activeHall.featuresEn).map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#D8C9B3] gsap-stagger-item">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A86A] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA & Zoom trigger */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3 gsap-hall-actions">
              <button
                onClick={() => {
                  playRoyalChime(4, 1.5);
                  onBookHall(lang === 'ar' ? activeHall.nameAr : activeHall.nameEn);
                }}
                className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-[#C9A86A] via-[#E8CF99] to-[#C9A86A] text-[#120B11] font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-lg transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#120B11]" />
                <span>{lang === 'ar' ? 'حجز موعد لمعاينة هذه القاعة' : 'Book Tour for This Hall'}</span>
              </button>

              <button
                onClick={() => {
                  playRoyalChime(2, 0.8);
                  setIsZoomModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-[#C9A86A]/40 text-[#C9A86A] hover:bg-[#C9A86A]/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تكبير كامل' : 'Full Zoom'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Fullscreen Zoom-In Inspection Modal */}
        {isZoomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-5xl bg-[#160D15] border border-[#C9A86A]/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-4 sm:px-6 bg-[#120B11] border-b border-[#C9A86A]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[#C9A86A] font-cinzel font-bold text-xs">
                    ARCHITECTURAL ZOOM-IN INSPECTION
                  </span>
                  <span className="text-white font-royal text-lg font-bold">{activeHall.nameAr}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalZoomScale((prev) => Math.min(2.5, prev + 0.3))}
                    className="p-2 rounded-lg border border-white/20 text-[#C9A86A] hover:bg-[#C9A86A]/10"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setModalZoomScale((prev) => Math.max(1.0, prev - 0.3))}
                    className="p-2 rounded-lg border border-white/20 text-[#C9A86A] hover:bg-[#C9A86A]/10"
                    title="Zoom Out"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setModalZoomScale(1.0)}
                    className="px-2 py-1 text-xs border border-white/20 text-white/70 hover:text-white rounded"
                  >
                    1x
                  </button>
                  <button
                    onClick={() => setIsZoomModalOpen(false)}
                    className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Zoomable Image Container */}
              <div className="flex-1 overflow-auto bg-black flex items-center justify-center p-4">
                <img
                  src={activeHall.image}
                  alt={activeHall.nameEn}
                  className="max-w-none transition-transform duration-500 ease-out rounded-xl shadow-2xl"
                  style={{
                    transform: `scale(${modalZoomScale})`,
                    transformOrigin: 'center center'
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
