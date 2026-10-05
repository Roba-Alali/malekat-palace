import React, { useState, useEffect } from 'react';
import { TourNode } from '../data/palaceData';
import { Compass, ChevronLeft, ChevronRight, Sparkles, X, Maximize2 } from 'lucide-react';
import { playRoyalChime } from '../utils/royalAudio';

interface VirtualRoyalTourProps {
  lang: 'ar' | 'en';
  nodes?: TourNode[];
}

export const VirtualRoyalTour: React.FC<VirtualRoyalTourProps> = ({ lang, nodes = [] }) => {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<any | null>(null);
  const [panOffset, setPanOffset] = useState(0);
  const [autoZoomActive, setAutoZoomActive] = useState(false);
  const [zoomFocus, setZoomFocus] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const currentNode = nodes[selectedNodeIndex] || nodes[0];

  // Automatic zoom-in effect on load and when switching wings
  useEffect(() => {
    setAutoZoomActive(false);
    setZoomFocus({ x: 50, y: 50 });
    const timer = setTimeout(() => {
      setAutoZoomActive(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [selectedNodeIndex]);

  if (!currentNode) return null;

  const handleSelectWing = (idx: number) => {
    playRoyalChime(idx + 1, 1.2);
    setSelectedNodeIndex(idx);
    setActiveHotspot(null);
    setPanOffset(0);
  };

  const handlePan = (direction: 'left' | 'right') => {
    playRoyalChime(1, 0.8);
    setPanOffset((prev) => {
      const next = direction === 'left' ? prev - 8 : prev + 8;
      return Math.max(-18, Math.min(18, next));
    });
  };

  const handleHotspotClick = (spot: any) => {
    playRoyalChime(4, 1.5);
    setZoomFocus({ x: spot.x, y: spot.y });
    setActiveHotspot(spot);
  };

  return (
    <section id="virtual-tour" className="relative py-28 bg-[#120B11] text-[#F8F5EE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Clean without hints) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-[#C9A86A]/20 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A86A] mb-2 font-medium font-cinzel">
              <Compass className="w-4 h-4 text-[#C9A86A]" />
              <span>{lang === 'ar' ? 'الجولة الافتراضية 360°' : 'VIRTUAL ROYAL 360° TOUR'}</span>
            </div>
            <h2 className="font-royal text-3xl sm:text-5xl text-white font-bold">
              {lang === 'ar' ? 'أجنحة القصر وصروحه الملكية' : 'The Palace Architectural Wings'}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#C9B99E] max-w-xl font-light">
              {lang === 'ar'
                ? 'رحلة بصرية داخل أرجاء قصر الملكات، حيث تتكامل ثريات الكريستال التشيكية مع فخامة الرخام الإمبراطوري.'
                : 'A visual sanctuary through Malekat Palace wings, where crystal chandeliers harmonize with imperial marble balustrades.'}
            </p>
          </div>

          {/* Hall Switcher Tabs (Wings) */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#1C101B] border border-[#C9A86A]/25 rounded-2xl">
            {nodes.map((node, idx) => (
              <button
                key={node.id}
                onClick={() => handleSelectWing(idx)}
                className={`px-4 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedNodeIndex === idx
                    ? 'bg-[#C9A86A] text-[#120B11] shadow-[0_0_20px_rgba(201,168,106,0.4)] font-bold scale-105'
                    : 'text-[#E5DEC9] hover:text-[#C9A86A] hover:bg-white/5'
                }`}
              >
                {lang === 'ar' ? node.nameAr : node.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* 360 Virtual Viewer Canvas with Automatic Zoom-In Effect */}
        <div className="relative rounded-3xl overflow-hidden border border-[#C9A86A]/35 bg-black shadow-[0_25px_80px_rgba(0,0,0,0.85)] group">
          {/* Top Bar inside Viewer: Wing Title Badge & Clean Pan Arrows */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto bg-[#140C13]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#C9A86A]/40 text-xs text-[#F8F5EE] flex items-center gap-2 shadow-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9A86A] animate-ping" />
              <span className="font-royal text-sm sm:text-base text-[#C9A86A] font-bold">
                {lang === 'ar' ? currentNode.nameAr : currentNode.nameEn}
              </span>
            </div>

            {/* Navigation Pan Arrows */}
            <div className="pointer-events-auto flex items-center gap-1.5 bg-[#140C13]/90 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-[#C9A86A]/40 shadow-xl">
              <button
                onClick={() => handlePan('right')}
                className="w-8 h-8 rounded-full border border-white/10 hover:border-[#C9A86A] flex items-center justify-center text-[#C9A86A] hover:bg-[#C9A86A] hover:text-[#120B11] transition-all cursor-pointer"
                title="Pan Right"
                aria-label="Pan view right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePan('left')}
                className="w-8 h-8 rounded-full border border-white/10 hover:border-[#C9A86A] flex items-center justify-center text-[#C9A86A] hover:bg-[#C9A86A] hover:text-[#120B11] transition-all cursor-pointer"
                title="Pan Left"
                aria-label="Pan view left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Panoramic Image Stage with Automatic Smooth Zoom-In */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden select-none">
            <img
              src={currentNode.image}
              alt={currentNode.nameEn}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover ${
                autoZoomActive ? 'scale-122 duration-7000' : 'scale-100 duration-500'
              } transition-transform ease-out`}
              style={{
                transform: `scale(${autoZoomActive ? (activeHotspot ? 1.45 : 1.22) : 1.0}) translateX(${panOffset}%)`,
                transformOrigin: `${zoomFocus.x}% ${zoomFocus.y}%`
              }}
            />

            {/* Subtle Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(18,11,17,0.75)_100%)] pointer-events-none" />

            {/* Hotspots Overlay without hints */}
            {currentNode.hotspots.map((spot, idx) => (
              <div
                key={idx}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${spot.x + panOffset * 0.35}%`,
                  top: `${spot.y}%`
                }}
                onClick={() => handleHotspotClick(spot)}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-10 h-10 rounded-full bg-[#C9A86A]/30 animate-ping" />
                  <span className="absolute w-8 h-8 rounded-full bg-[#C9A86A]/50 group-hover:scale-130 transition-transform" />
                  <div className="relative w-8 h-8 rounded-full bg-[#140C13] border-2 border-[#C9A86A] flex items-center justify-center text-[#C9A86A] shadow-[0_0_20px_rgba(201,168,106,0.8)] group-hover:bg-[#C9A86A] group-hover:text-[#120B11] transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </div>

                  {/* Clean Tooltip (Title only, no hints) */}
                  <div className="hidden sm:block absolute bottom-full mb-2.5 whitespace-nowrap bg-[#160E16]/95 border border-[#C9A86A]/50 text-[#F8F5EE] text-xs px-3.5 py-1.5 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform group-hover:-translate-y-1">
                    <p className="font-bold text-[#C9A86A]">
                      {lang === 'ar' ? spot.titleAr : spot.titleEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Bar without hints */}
          <div className="bg-[#160D15] px-6 py-4 border-t border-[#C9A86A]/20 flex items-center justify-between text-xs text-[#C5B49C]">
            <span className="text-[#C9A86A] font-cinzel font-semibold tracking-wider">
              MALEKAT PALACE · WING {selectedNodeIndex + 1} OF {nodes.length}
            </span>

            <button
              onClick={() => {
                const nextIdx = (selectedNodeIndex + 1) % nodes.length;
                handleSelectWing(nextIdx);
              }}
              className="px-4 py-1.5 rounded-xl border border-[#C9A86A]/40 bg-[#C9A86A]/10 hover:bg-[#C9A86A] text-[#C9A86A] hover:text-[#120B11] font-semibold transition-all cursor-pointer"
            >
              {lang === 'ar' ? 'الجناح التالي ←' : 'Next Wing →'}
            </button>
          </div>
        </div>

        {/* Hotspot Detail Modal */}
        {activeHotspot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-[#180F18] border border-[#C9A86A]/60 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)]">
              <button
                onClick={() => {
                  setActiveHotspot(null);
                  setZoomFocus({ x: 50, y: 50 });
                }}
                className="absolute top-5 right-5 p-2 rounded-full text-[#C9A86A]/70 hover:text-[#C9A86A] hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C9A86A]/10 border border-[#C9A86A]/40 flex items-center justify-center text-[#C9A86A] shrink-0">
                  <Maximize2 className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#C9A86A] font-semibold font-cinzel">
                    {lang === 'ar' ? 'تفاصيل المرفق المعماري' : 'ARCHITECTURAL DETAILS'}
                  </span>
                  <h3 className="font-royal text-xl sm:text-2xl text-white font-bold">
                    {lang === 'ar' ? activeHotspot.titleAr : activeHotspot.titleEn}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[#D7C7B0] leading-relaxed mb-6 font-light">
                {lang === 'ar' ? activeHotspot.descriptionAr : activeHotspot.descriptionEn}
              </p>

              <div className="pt-4 border-t border-[#C9A86A]/20 flex items-center justify-between">
                <span className="text-xs text-[#C9A86A]/80 font-cinzel">
                  MALEKAT PALACE · ROYAL LUXURY
                </span>
                <button
                  onClick={() => {
                    setActiveHotspot(null);
                    setZoomFocus({ x: 50, y: 50 });
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#120B11] bg-[#C9A86A] hover:bg-[#E8CF99] transition-all cursor-pointer shadow"
                >
                  {lang === 'ar' ? 'إغلاق ومتابعة الجولة' : 'Continue Tour'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
