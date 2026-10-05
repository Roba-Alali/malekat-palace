import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import heroBallroomImg from '@/src/assets/images/hero_royal_ballroom_1791122453291.jpg';
import heroBrideImg from '@/src/assets/images/hero_bride_entrance_grand_1791124789640.jpg';
import palaceEntranceImg from '@/src/assets/images/palace_grand_entrance_1791122470162.jpg';
import queensBallroomImg from '@/src/assets/images/queens_ballroom_interior_1791122482334.jpg';
import bridalSuiteImg from '@/src/assets/images/bridal_suite_luxury_1791122494670.jpg';
import { playRoyalChime } from '../utils/royalAudio';
import { SiteConfig } from '../db/palaceDatabase';

interface HeroProps {
  lang: 'ar' | 'en';
  heroConfig?: SiteConfig['hero'];
  onExplore: () => void;
  onDesignNight: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onExplore,
  onDesignNight
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<any>(null);

  const heroSlides = [
    {
      image: heroBallroomImg,
      titleAr: 'القاعة الإمبراطورية الكبرى والدرج الرخامي المزدوج',
      titleEn: 'The Imperial Grand Ballroom & Royal Double Staircase',
      tagAr: 'صرح الملكات الرئيسي',
      tagEn: 'Imperial Ballroom'
    },
    {
      image: heroBrideImg,
      titleAr: 'نزول زفة العروس الإمبراطورية وسط الضباب البارد والإنارة المسرحية',
      titleEn: 'Royal Bridal Descent & Ambient Ethereal Lighting',
      tagAr: 'ممر العروس الملكي',
      tagEn: 'Bridal Runway'
    },
    {
      image: palaceEntranceImg,
      titleAr: 'الواجهة الخارجية الكلاسيكية وممر سيارات الفالي VIP',
      titleEn: 'Neoclassical Twilight Facade & VIP Valet Driveway',
      tagAr: 'المدخل الإمبراطوري',
      tagEn: 'Grand Facade'
    },
    {
      image: queensBallroomImg,
      titleAr: 'صالة الملكات الكبرى والكوشة المعمارية المصممة خصيصاً',
      titleEn: 'The Queens Hall & Bespoke Architectural Kosha Stage',
      tagAr: 'قاعة الملكات',
      tagEn: 'Queens Hall'
    },
    {
      image: bridalSuiteImg,
      titleAr: 'جناح العروس الإمبراطوري الفاخر وصالون التجهيز والمكياج',
      titleEn: 'Exclusive Luxury Bridal Suite & Private Preparation Salon',
      tagAr: 'جناح العروس VIP',
      tagEn: 'Bridal Suite'
    }
  ];

  // Automatic smooth slide rotation every 6 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [heroSlides.length]);

  const handleNextSlide = () => {
    playRoyalChime(currentSlide + 1, 0.8);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    playRoyalChime(currentSlide, 0.8);
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex items-end">
      {/* 
        Full-Screen Ultra-Clear Cinematic Image Slider (Like Villa Fayrouz)
        No obscuring center boxes or heavy dark tints - 100% natural, crisp, bright imagery
      */}
      {heroSlides.map((slide, idx) => {
        const isActive = currentSlide === idx;
        return (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1200 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* 
              Cinematic Ken Burns Slow Zoom Motion (Smooth & Majestic)
            */}
            <div
              className={`w-full h-full bg-cover bg-center transition-transform duration-[7000ms] ease-out will-change-transform ${
                isActive ? 'scale-105 translate-y-0' : 'scale-100 translate-y-1'
              }`}
              style={{
                backgroundImage: `url(${slide.image})`
              }}
            />

            {/* 
              Minimal, ultra-light top & bottom gradients purely for header readability & smooth section merge
              The entire middle area remains 100% crystal-clear and unobstructed!
            */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/60 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
          </div>
        );
      })}

      {/* Prominent Side Navigation Chevrons (Clean Glass Style) */}
      <button
        onClick={handlePrevSlide}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 hover:border-[#C9A86A] bg-black/40 hover:bg-[#C9A86A] text-white hover:text-[#120B11] backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6 rtl:rotate-180 ltr:rotate-0 transition-transform group-hover:scale-110" />
      </button>

      <button
        onClick={handleNextSlide}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 hover:border-[#C9A86A] bg-black/40 hover:bg-[#C9A86A] text-white hover:text-[#120B11] backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6 rtl:rotate-180 ltr:rotate-0 transition-transform group-hover:scale-110" />
      </button>

      {/* 
        Sleek, Minimalist Bottom Control Bar (Villa Fayrouz Inspired)
        Positioned neatly at bottom edge so the palace photography is fully visible
      */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 pb-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Current Scene Information Badge */}
        <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md py-2.5 px-5 rounded-full border border-white/15 shadow-xl">
          <span className="font-cinzel text-xs font-bold text-[#C9A86A] tracking-wider">
            0{currentSlide + 1} / 0{heroSlides.length}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#C9A86A]" />
          <span className="text-xs sm:text-sm font-medium text-white drop-shadow">
            {lang === 'ar' ? heroSlides[currentSlide].titleAr : heroSlides[currentSlide].titleEn}
          </span>
        </div>

        {/* Slide Progress Dots / Indicators */}
        <div className="flex items-center gap-2">
          {heroSlides.map((slide, i) => (
            <button
              key={i}
              onClick={() => {
                playRoyalChime(i + 1, 0.8);
                setCurrentSlide(i);
              }}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                currentSlide === i
                  ? 'w-10 bg-[#C9A86A] shadow-[0_0_12px_#C9A86A]'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              title={lang === 'ar' ? slide.tagAr : slide.tagEn}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll To Explore Indicator */}
        <a
          href="#editorial-welcome"
          onClick={() => playRoyalChime(3, 1)}
          className="hidden md:flex items-center gap-2 text-xs font-cinzel tracking-[0.2em] text-[#C9A86A] hover:text-white transition-colors cursor-pointer"
        >
          <span>{lang === 'ar' ? 'اكتشفي الصرح' : 'EXPLORE'}</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
