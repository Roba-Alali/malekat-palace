import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Initializes global GSAP ScrollTrigger animations across the entire application.
 * Automatically detects section entry and triggers staggered entrance animations for:
 * - PalaceHalls (Tabs, Ballroom showcase panel, architectural specs, features, and CTAs)
 * - HospitalitySection (Editorial header, banquet visual, and staggered butler service cards)
 * - WelcomeSection (Pillars & metric counters)
 * - VirtualRoyalTour (360 Canvas entrance)
 * - GrandEntrance (Bridal entrance style cards)
 * Safe and resilient against DOM mutation and invalid CSS selectors.
 */
export const initGlobalScrollTriggers = (isRTL: boolean = true): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  try {
    const ctx = gsap.context(() => {
      // 1. Universal Section Header Detection & Staggered Reveal
      const headerElements = document.querySelectorAll('.gsap-header');
      headerElements.forEach((header) => {
        const children = header.querySelectorAll('span, h2, p, .gold-shimmer');
        if (children.length > 0) {
          gsap.fromTo(
            Array.from(children),
            {
              opacity: 0,
              y: 35
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      });

      // 2. PalaceHalls Component: Deep Staggered Architectural Entrance
      const palaceHalls = document.querySelector('#palace-halls');
      if (palaceHalls) {
        // Hall selector tabs stagger
        const tabs = palaceHalls.querySelectorAll('.gsap-reveal button');
        if (tabs.length > 0) {
          gsap.fromTo(
            Array.from(tabs),
            {
              opacity: 0,
              y: 20,
              scale: 0.92
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: 'back.out(1.4)',
              scrollTrigger: {
                trigger: palaceHalls.querySelector('.gsap-reveal') || palaceHalls,
                start: 'top 82%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        // Main hall showcase panel entrance
        const showcaseCard = palaceHalls.querySelector('.gsap-hall-showcase');
        if (showcaseCard) {
          gsap.fromTo(
            showcaseCard,
            {
              opacity: 0,
              y: 50,
              scale: 0.98
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: showcaseCard,
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          );

          // Specs Grid items staggered entrance
          const specsItems = showcaseCard.querySelectorAll('.gsap-hall-specs > div');
          if (specsItems.length > 0) {
            gsap.fromTo(
              Array.from(specsItems),
              {
                opacity: 0,
                y: 25,
                scale: 0.96
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: specsItems[0],
                  start: 'top 85%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }

          // Amenities features checklist items stagger
          const featureItems = showcaseCard.querySelectorAll('.gsap-hall-features .gsap-stagger-item');
          if (featureItems.length > 0) {
            gsap.fromTo(
              Array.from(featureItems),
              {
                opacity: 0,
                x: isRTL ? 25 : -25
              },
              {
                opacity: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.06,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: featureItems[0],
                  start: 'top 86%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }

          // Action Buttons pop
          const actionRow = showcaseCard.querySelector('.gsap-hall-actions');
          if (actionRow) {
            const btns = actionRow.querySelectorAll('button');
            if (btns.length > 0) {
              gsap.fromTo(
                Array.from(btns),
                {
                  opacity: 0,
                  y: 18
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  stagger: 0.1,
                  ease: 'power3.out',
                  scrollTrigger: {
                    trigger: actionRow,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                  }
                }
              );
            }
          }
        }
      }

      // 3. HospitalitySection Component: Fine Dining & Butler Staggered Entrance
      const hospitalitySection = document.querySelector('#hospitality-section');
      if (hospitalitySection) {
        // Main visual buffet image with soft glide
        const visualContainer = hospitalitySection.querySelector('.gsap-reveal');
        if (visualContainer) {
          gsap.fromTo(
            visualContainer,
            {
              opacity: 0,
              x: isRTL ? 40 : -40,
              scale: 0.96
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 1.0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: visualContainer,
                start: 'top 78%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        // Feature hospitality experience cards staggered cascade
        const cards = hospitalitySection.querySelectorAll('.gsap-stagger-parent .gsap-stagger-item');
        if (cards.length > 0) {
          gsap.fromTo(
            Array.from(cards),
            {
              opacity: 0,
              x: isRTL ? -35 : 35,
              y: 20
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cards[0],
                start: 'top 82%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }

      // 4. WelcomeSection Showcase & Stats Stagger
      const welcome = document.querySelector('#editorial-welcome');
      if (welcome) {
        const stats = welcome.querySelectorAll('.gsap-stagger-parent .gsap-stagger-item');
        if (stats.length > 0) {
          gsap.fromTo(
            Array.from(stats),
            {
              opacity: 0,
              y: 30,
              scale: 0.94
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: 0.09,
              ease: 'back.out(1.2)',
              scrollTrigger: {
                trigger: stats[0],
                start: 'top 84%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }

      // 5. VirtualRoyalTour Canvas Entrance
      const tour = document.querySelector('#virtual-tour');
      if (tour) {
        const canvas = tour.querySelector('.rounded-3xl');
        if (canvas) {
          gsap.fromTo(
            canvas,
            {
              opacity: 0,
              y: 40,
              scale: 0.96
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: canvas,
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }

      // 6. GrandEntrance Styles Stagger
      const grandEntrance = document.querySelector('#grand-entrance');
      if (grandEntrance) {
        const entranceCards = grandEntrance.querySelectorAll('.grid-cols-1 > div, .lg\\:grid-cols-3 > div');
        if (entranceCards.length > 0) {
          gsap.fromTo(
            Array.from(entranceCards),
            {
              opacity: 0,
              y: 40
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: entranceCards[0],
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }

      // 7. General Utility Classes (.gsap-reveal)
      document.querySelectorAll<HTMLElement>('.gsap-reveal').forEach((el) => {
        // Skip if already triggered by specific parent
        if (el.closest('#palace-halls') || el.closest('#hospitality-section')) return;

        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 35,
            scale: 0.98
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    });

    // Refresh ScrollTrigger after DOM settle
    const refreshTimer = setTimeout(() => {
      try {
        ScrollTrigger.refresh();
      } catch (e) {
        // Safe catch
      }
    }, 120);

    return () => {
      clearTimeout(refreshTimer);
      try {
        ctx.revert();
      } catch (e) {
        // Safe catch
      }
    };
  } catch (err) {
    console.warn('ScrollTrigger init deferred:', err);
    return () => {};
  }
};

export { gsap, ScrollTrigger };
