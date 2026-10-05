import React, { useState } from 'react';
import { Sparkles, Heart, Music, Sun } from 'lucide-react';
import { EntranceStyle } from '../data/palaceData';
import { playRoyalChime, playEntranceFanfare } from '../utils/royalAudio';

interface GrandEntranceProps {
  lang: 'ar' | 'en';
  styles?: EntranceStyle[];
}

export const GrandEntrance: React.FC<GrandEntranceProps> = ({ lang, styles = [] }) => {
  const [activeEntranceIndex, setActiveEntranceIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(['royal-staircase']);
  const [lightingPreset, setLightingPreset] = useState<'warm' | 'romantic' | 'crystal'>('warm');

  const activeEntrance: EntranceStyle = styles[activeEntranceIndex] || styles[0];

  if (!activeEntrance) return null;

  const toggleFavorite = (id: string) => {
    playRoyalChime(4, 1.2);
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSimulateChime = () => {
    playEntranceFanfare();
  };

  return (
    <section id="grand-entrance" className="relative py-28 bg-[#150D14] text-[#F8F5EE] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A86A]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A86A] mb-3 font-semibold font-serif-en">
            <Sparkles className="w-4 h-4 text-[#C9A86A]" />
            <span>{lang === 'ar' ? 'زفّات ومداخل العروس' : 'THE GRAND BRIDAL ENTRANCE'}</span>
          </div>
          <h2 className="font-royal text-3xl sm:text-5xl md:text-6xl text-white font-bold leading-tight">
            {lang === 'ar' ? (
              <>
                تخيّلي لحظة دخولكِ... <br />
                <span className="gold-shimmer font-bold">بين ذهب القصور وهيبة الثريات.</span>
              </>
            ) : (
              <>
                Envision Your Grand Entrance... <br />
                <span className="gold-shimmer font-bold">Beneath Crystal Chandeliers & Palace Gold.</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#D0C2A8] font-light">
            {lang === 'ar'
              ? 'اللحظة التي تتوقف فيها الأنفاس وتتجه إليها كل العيون. صممنا سيناريوهات زفة ملكية فريدة تمتزج فيها الموسيقى مع إضاءة المسارح والضباب البارد.'
              : 'The breathtaking moment every heart waits for. Curated royal bridal entrance scenarios harmonized with orchestral score, cold low-fog, and dynamic spotlights.'}
          </p>
        </div>

        {/* 3 Entrance Cards Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {styles.map((style, idx) => {
            const isSelected = activeEntranceIndex === idx;
            const isFav = favorites.includes(style.id);
            return (
              <div
                key={style.id}
                onClick={() => {
                  playRoyalChime(idx + 2, 1.2);
                  setActiveEntranceIndex(idx);
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#C9A86A] bg-[#221320] shadow-[0_0_25px_rgba(201,168,106,0.25)]'
                    : 'border-white/10 bg-[#170E16]/80 hover:border-[#C9A86A]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold">
                    0{idx + 1}. {style.theme}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(style.id);
                    }}
                    className={`p-1.5 rounded-full transition-colors ${
                      isFav ? 'text-rose-400 bg-rose-500/20' : 'text-white/40 hover:text-white'
                    }`}
                    title="Add to Bridal Favorites"
                    aria-label="Add to bridal favorites"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400' : ''}`} />
                  </button>
                </div>
                <h3 className="font-royal text-xl text-white font-bold mb-1">
                  {lang === 'ar' ? style.nameAr : style.nameEn}
                </h3>
                <p className="text-xs text-[#C5B49C] line-clamp-2 font-light">
                  {lang === 'ar' ? style.descriptionAr : style.descriptionEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Cinema Showcase Card */}
        <div className="relative rounded-3xl overflow-hidden border border-[#C9A86A]/40 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.9)]">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <img
              src={activeEntrance.image}
              alt={activeEntrance.nameEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out scale-105"
            />

            <div
              className={`absolute inset-0 transition-all duration-700 pointer-events-none ${
                lightingPreset === 'warm'
                  ? 'bg-gradient-to-t from-[#120B11] via-[#C9A86A]/10 to-transparent'
                  : lightingPreset === 'romantic'
                  ? 'bg-gradient-to-t from-[#120B11] via-[#E8C7CE]/15 to-[#6E4A70]/20'
                  : 'bg-gradient-to-t from-[#120B11] via-cyan-100/10 to-transparent'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120B11] via-transparent to-black/30" />

            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-2 bg-[#120B11]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#C9A86A]/30 text-xs text-[#C9A86A]">
                <Sun className="w-3.5 h-3.5" />
                <span className="font-semibold">{lang === 'ar' ? 'إضاءة المشهد:' : 'Lighting Tone:'}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setLightingPreset('warm')}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                      lightingPreset === 'warm' ? 'bg-[#C9A86A] text-[#120B11] font-bold' : 'text-[#E5DEC9]'
                    }`}
                  >
                    {lang === 'ar' ? 'ذهبي دافئ' : 'Warm Gold'}
                  </button>
                  <button
                    onClick={() => setLightingPreset('romantic')}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                      lightingPreset === 'romantic' ? 'bg-[#E8C7CE] text-[#120B11] font-bold' : 'text-[#E5DEC9]'
                    }`}
                  >
                    {lang === 'ar' ? 'وردي رومانسي' : 'Blush'}
                  </button>
                  <button
                    onClick={() => setLightingPreset('crystal')}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                      lightingPreset === 'crystal' ? 'bg-white text-[#120B11] font-bold' : 'text-[#E5DEC9]'
                    }`}
                  >
                    {lang === 'ar' ? 'كريستال أبيض' : 'Crystal'}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSimulateChime}
                className="pointer-events-auto flex items-center gap-2 bg-[#C9A86A] hover:bg-[#E8CF99] text-[#120B11] font-bold text-xs px-4 py-2 rounded-full shadow-[0_0_20px_rgba(201,168,106,0.5)] transition-all"
              >
                <Music className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'محاكاة نغمات الزفة الملكية' : 'Play Entrance Cue'}</span>
              </button>
            </div>

            <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 z-20">
              <div className="max-w-3xl">
                <span className="text-xs uppercase tracking-widest text-[#C9A86A] font-semibold block mb-2">
                  {lang === 'ar' ? 'سيناريو الزفة' : 'ENTRANCE SCENARIO'}
                </span>
                <h3 className="font-royal text-2xl sm:text-4xl text-white font-bold mb-3">
                  {lang === 'ar' ? activeEntrance.nameAr : activeEntrance.nameEn}
                </h3>
                <p className="text-xs sm:text-sm text-[#E5DEC9] leading-relaxed mb-4">
                  {lang === 'ar' ? activeEntrance.descriptionAr : activeEntrance.descriptionEn}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#C5B49C]">
                  <div className="bg-[#140C13]/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <Music className="w-3.5 h-3.5 text-[#C9A86A]" />
                    <span>{activeEntrance.audioTempo}</span>
                  </div>
                  <div className="bg-[#140C13]/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-[#C9A86A]" />
                    <span>{lang === 'ar' ? activeEntrance.lightingCueAr : activeEntrance.lightingCueEn}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#170E16] px-6 py-4 border-t border-[#C9A86A]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#C5B49C]">
              {lang === 'ar'
                ? 'يمكن تعديل وتخصيص تفاصيل الدخول والإضاءة بالتعاون مع المخرجة الفنية الخاصة بالقصر.'
                : 'All entrance choreography can be fully customized with our palace artistic director.'}
            </span>

            <button
              onClick={() => toggleFavorite(activeEntrance.id)}
              className={`px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                favorites.includes(activeEntrance.id)
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-[#C9A86A]/20 text-[#C9A86A] border border-[#C9A86A]/40 hover:bg-[#C9A86A]/30'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorites.includes(activeEntrance.id) ? 'fill-rose-400' : ''}`} />
              <span>
                {favorites.includes(activeEntrance.id)
                  ? (lang === 'ar' ? 'مضافة إلى مفضلة زفتكِ ♡' : 'Saved to Favorites ♡')
                  : (lang === 'ar' ? 'أضيفي إلى المفضلة' : 'Save to Favorites')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
