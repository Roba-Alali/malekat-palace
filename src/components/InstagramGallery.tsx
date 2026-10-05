import React, { useState } from 'react';
import { InstagramPost } from '../data/palaceData';
import { Instagram, Heart, ExternalLink, X } from 'lucide-react';
import { playRoyalChime } from '../utils/royalAudio';

interface InstagramGalleryProps {
  lang: 'ar' | 'en';
  posts?: InstagramPost[];
}

export const InstagramGallery: React.FC<InstagramGalleryProps> = ({ lang, posts = [] }) => {
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  return (
    <section id="instagram-gallery" className="relative py-28 bg-[#120B11] text-[#F8F5EE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-[#C9A86A]/20 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A86A] mb-3 font-semibold font-serif-en">
              <Instagram className="w-4 h-4 text-[#C9A86A]" />
              <span>@MALEKAT_PALACE</span>
            </div>
            <h2 className="font-royal text-3xl sm:text-5xl text-white font-bold">
              {lang === 'ar' ? 'من قصر الملكات إلى Instagram' : 'Live From Our Palace Gallery'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#C5B49C]">
              {lang === 'ar'
                ? 'لقطات حية ومستمرة من أفراح ومناسبات العرائس في قصر الملكات. تابعي حسابنا لمشاهدة أحدث التنسيقات.'
                : 'Real moments captured from unforgettable royal weddings and celebrations at Malekat Palace.'}
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C9A86A]/40 text-[#C9A86A] hover:bg-[#C9A86A] hover:text-[#120B11] text-xs font-semibold transition-all self-start md:self-auto"
          >
            <Instagram className="w-4 h-4" />
            <span>{lang === 'ar' ? 'متابعة حساب الإنستقرام' : 'Follow on Instagram'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Masonry / Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, idx) => (
            <div
              key={post.id}
              onClick={() => {
                playRoyalChime(idx + 1, 1);
                setSelectedPost(post);
              }}
              className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#C9A86A]/50 bg-[#160B14] cursor-pointer transition-all duration-500 shadow-xl"
            >
              <div className="aspect-square w-full overflow-hidden bg-black">
                <img
                  src={post.imageUrl}
                  alt={post.captionEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#120B11]/85 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-[#C9A86A]">
                  <span className="font-semibold">{post.tag}</span>
                  <span className="text-[11px] text-white/50">{post.date}</span>
                </div>

                <div>
                  <p className="text-xs text-[#F8F5EE] line-clamp-3 leading-relaxed">
                    {lang === 'ar' ? post.captionAr : post.captionEn}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-[#E5DEC9] pt-3 border-t border-white/10">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <Heart className="w-4 h-4 fill-rose-400" />
                    <span className="tabular-nums font-semibold">{post.likes.toLocaleString()}</span>
                  </span>
                  <span className="text-xs text-[#C9A86A] flex items-center gap-1">
                    <span>{lang === 'ar' ? 'عرض المنشور' : 'View Post'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Post Detail */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-[#180E17] border border-[#C9A86A]/50 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 sm:grid-cols-2">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white/80 hover:text-white"
                aria-label="Close post view"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-square bg-black">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.captionEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full border border-[#C9A86A] bg-[#140C13] flex items-center justify-center text-xs font-serif text-[#C9A86A]">
                      👑
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">malekat_palace</span>
                      <span className="text-[10px] text-[#C9A86A] block">
                        {lang === 'ar' ? 'قصر الملكات للاحتفالات' : 'Official Palace Account'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#E5DEC9] leading-relaxed mb-4">
                    {lang === 'ar' ? selectedPost.captionAr : selectedPost.captionEn}
                  </p>

                  <span className="text-xs text-[#C9A86A] font-semibold">{selectedPost.tag}</span>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-rose-400">
                      <Heart className="w-4 h-4 fill-rose-400" />
                      <span className="tabular-nums font-bold">{selectedPost.likes}</span>
                    </span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/50">{selectedPost.date}</span>
                  </div>

                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#C9A86A] hover:underline font-semibold"
                  >
                    Instagram →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
