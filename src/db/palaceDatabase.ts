/**
 * Palace Unified Database & State Layer
 * Manages all website sections, halls, services, calendar, CRM leads, and payment transactions.
 * Persists in localStorage and supports import/export.
 */

import {
  PALACE_HALLS,
  TOUR_NODES,
  ENTRANCE_STYLES,
  AVAILABILITY_SCHEDULE,
  INSTAGRAM_POSTS,
  INITIAL_LEADS,
  HallInfo,
  TourNode,
  EntranceStyle,
  AvailabilityDate,
  InstagramPost,
  LeadCRM
} from '../data/palaceData';

export interface SiteConfig {
  hero: {
    titleAr: string;
    titleEn: string;
    taglineAr: string;
    taglineEn: string;
    sloganAr: string;
    sloganEn: string;
    descriptionAr: string;
    descriptionEn: string;
  };
  welcome: {
    statementAr: string;
    statementEn: string;
    descriptionAr: string;
    descriptionEn: string;
    stats: {
      capacity: string;
      hallsCount: string;
      heritageYears: string;
      privacyRate: string;
    };
  };
  contact: {
    addressAr: string;
    addressEn: string;
    phone: string;
    whatsapp: string;
    email: string;
    visitingHoursAr: string;
    visitingHoursEn: string;
    instagramHandle: string;
  };
  pricingDefaults: {
    queensHallBase: number;
    knightsHallBase: number;
    bothHallsBase: number;
    cateringPerGuest: number;
  };
}

export interface NightService {
  id: string;
  labelAr: string;
  labelEn: string;
  price: number;
  category: string;
}

export interface HospitalityItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  iconType: 'coffee' | 'cake' | 'dining' | 'cocktail';
}

export interface PaymentTransaction {
  id: string;
  transactionRef: string;
  leadId?: string;
  clientName: string;
  clientPhone: string;
  amount: number;
  paymentMethod: 'mada' | 'apple_pay' | 'visa_mastercard' | 'stc_pay';
  paymentType: 'deposit' | 'partial' | 'full';
  status: 'paid' | 'refunded' | 'pending';
  date: string;
  timestamp: string;
  cardLast4?: string;
  authCode: string;
  purpose: string;
}

const DEFAULT_SITE_CONFIG: SiteConfig = {
  hero: {
    titleAr: 'قصر الملكات',
    titleEn: 'MALEKAT PALACE',
    taglineAr: 'MALEKAT PALACE · صرح الأفراح والمناسبات الفاخرة',
    taglineEn: 'MALEKAT PALACE · LUXURY WEDDING & EVENT PALACE',
    sloganAr: 'ليلتك لا تبدأ عند دخول القصر… بل تبدأ من هنا.',
    sloganEn: 'Your night does not begin at the palace gates… It begins right here.',
    descriptionAr: 'ليلة واحدة في العمر… ننسج تفاصيلها بذهب القصور وسحر الكريستال ورائحة العود الملكي لتخلد في الذاكرة.',
    descriptionEn: 'One single night in a lifetime… woven with palace gold, sparkling crystals, and royal hospitality.'
  },
  welcome: {
    statementAr: 'ليست مجرد قاعة احتفالات... إنها ليلة تُروى للأجيال.',
    statementEn: 'Not merely an event hall... It is a royal tale told for generations.',
    descriptionAr: 'صُمم قصر الملكات ليكون صرحاً يجمع بين الفخامة المعمارية الفيكتورية والفرنسية العريقة، وبين كرم الضيافة العربية الأصيلة. من لحظة وصول سيارة العروس وحتى وداع آخر الضيوف، كل ثانية محسوبة لتمنحك إحساس الملوكية.',
    descriptionEn: 'Malekat Palace was architecturally conceived to fuse European French Victorian grandeur with generous Arabian hospitality traditions. From the grand arrival to the final farewell, every fleeting moment is choreographed to royal perfection.',
    stats: {
      capacity: '750+',
      hallsCount: '2',
      heritageYears: '20+',
      privacyRate: '100%'
    }
  },
  contact: {
    addressAr: 'طريق الملك فهد، حي الصحافة، الرياض، المملكة العربية السعودية',
    addressEn: 'King Fahd Road, As Sahafah, Riyadh, Kingdom of Saudi Arabia',
    phone: '+966 11 400 9000',
    whatsapp: '+966 50 123 4567',
    email: 'events@malekatpalace.com',
    visitingHoursAr: 'يومياً من ٤:٠٠ م وحتى ١١:٠٠ م',
    visitingHoursEn: 'Daily 4:00 PM – 11:00 PM',
    instagramHandle: '@malekat_palace'
  },
  pricingDefaults: {
    queensHallBase: 45000,
    knightsHallBase: 28000,
    bothHallsBase: 65000,
    cateringPerGuest: 120
  }
};

const DEFAULT_NIGHT_SERVICES: NightService[] = [
  { id: 'staircase_flowers', labelAr: 'تنسيق زهور الدرج الرخامي الطبيعية', labelEn: 'Fresh Grand Staircase Floral Garland', price: 9500, category: 'decor' },
  { id: 'cold_pyro', labelAr: 'مؤثرات الضباب البارد والشرر للزفة', labelEn: 'Cold Heavy Low-Fog & Pyro Sparklers', price: 4500, category: 'fx' },
  { id: 'royal_trolley', labelAr: 'عربات الضيافة الملكية المتنقلة للمشروبات والحلويات', labelEn: 'Mobile Royal Hospitality Trolleys', price: 5000, category: 'hospitality' },
  { id: 'live_violin', labelAr: 'عازفة كمان أو فرقة استقبال زفة حية', labelEn: 'Live Violinist & Royal Zaffah Ensemble', price: 6000, category: 'entertainment' },
  { id: 'kosha_custom', labelAr: 'تصميم وتنفيذ كوشة حصرية مخصصة', labelEn: 'Exclusive Custom Bridal Kosha Design', price: 14000, category: 'decor' },
  { id: 'saudi_coffee_crew', labelAr: 'طاقم القهوة السعودية الفاخر والمباخر الملكية', labelEn: 'Traditional Saudi Coffee & Oud Ceremony Crew', price: 3500, category: 'hospitality' }
];

const DEFAULT_HOSPITALITY: HospitalityItem[] = [
  {
    id: 'hosp-1',
    iconType: 'coffee',
    titleAr: 'مراسم القهوة السعودية والمباخر الملكية',
    titleEn: 'Saudi Coffee & Royal Oud Ritual',
    descAr: 'استقبال فخم يبدأ من البوابة بدلال القهوة الذهبية المعطرة بالهيل والزعفران، وأجود أنواع العود الملكي المروكي الذي يملأ الأجواء هيبة وأصالة.',
    descEn: 'A magnificent welcome beginning at the palace gates with saffron-infused Saudi coffee served in gilded dallas and scented with aged royal agarwood.'
  },
  {
    id: 'hosp-2',
    iconType: 'cake',
    titleAr: 'عربات الباتيسري والحلويات الفرنسية',
    titleEn: 'French Patisserie & Artisan Dessert Carts',
    descAr: 'عربات مذهبة متنقلة تقدم الماكرون الباريسي، وحلويات الشوكولاتة البلجيكية، والتارت الفاخر المحضر يوم الحفل بأيدي أمهر الطهاة.',
    descEn: 'Mobile gilded trolleys serving authentic Parisian macarons, Belgian chocolate pralines, and delicate fruit tartlets prepared fresh on the event day.'
  },
  {
    id: 'hosp-3',
    iconType: 'dining',
    titleAr: 'البوفيه الملكي المفتوح الفاخر',
    titleEn: 'Grand Imperial Royal Buffet',
    descAr: 'أطباق عالمية وشرقية مُختارة بعناية فائقة، محطات طهي حي ومقبلات طازجة تلبّي أرقى الأذواق وترضي جميع الضيوف.',
    descEn: 'Handcrafted international and Middle Eastern gourmet selections, live cooking stations, and refined hot and cold mezze curated for royal palates.'
  },
  {
    id: 'hosp-4',
    iconType: 'cocktail',
    titleAr: 'ركن المشروبات والكوكتيلات الملكية',
    titleEn: 'Signature Royal Mocktail Bar',
    descAr: 'مشروبات ترحيبية منعشة مستخلصة من الورد الطائفي والتوت البري والزعفران تُقدّم في كؤوس كريستال فرنسية أنيقة.',
    descEn: 'Artisanal welcoming refreshments infused with Taif rose, wild forest berries, and fresh saffron presented in Bohemian crystal flutes.'
  }
];

const DEFAULT_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-1001',
    transactionRef: 'MLK-TX-98412',
    leadId: 'lead-101',
    clientName: 'سارة القحطاني',
    clientPhone: '+966501234567',
    amount: 15000,
    paymentMethod: 'mada',
    paymentType: 'deposit',
    status: 'paid',
    date: '2026-10-02',
    timestamp: '14:23:10',
    cardLast4: '4192',
    authCode: 'AUTH-882194',
    purpose: 'عربون تأكيد حجز قاعة الملكات (زفاف 15 نوفمبر 2026)'
  },
  {
    id: 'pay-1002',
    transactionRef: 'MLK-TX-98413',
    leadId: 'lead-102',
    clientName: 'عبدالله بن عبدالعزيز',
    clientPhone: '+966559876543',
    amount: 30000,
    paymentMethod: 'apple_pay',
    paymentType: 'deposit',
    status: 'paid',
    date: '2026-10-03',
    timestamp: '19:45:02',
    cardLast4: '8830',
    authCode: 'AUTH-941028',
    purpose: 'عربون حجز كلا القاعتين (زفاف 20 ديسمبر 2026)'
  }
];

export interface PalaceDatabaseState {
  siteConfig: SiteConfig;
  halls: HallInfo[];
  tourNodes: TourNode[];
  entranceStyles: EntranceStyle[];
  nightServices: NightService[];
  hospitality: HospitalityItem[];
  availabilitySchedule: AvailabilityDate[];
  instagramPosts: InstagramPost[];
  leads: LeadCRM[];
  payments: PaymentTransaction[];
}

const DB_KEY = 'malekat_palace_database_v2';

export const loadPalaceDatabase = (): PalaceDatabaseState => {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load database from localStorage:', err);
  }

  // Fallback initial state
  const initial: PalaceDatabaseState = {
    siteConfig: DEFAULT_SITE_CONFIG,
    halls: PALACE_HALLS,
    tourNodes: TOUR_NODES,
    entranceStyles: ENTRANCE_STYLES,
    nightServices: DEFAULT_NIGHT_SERVICES,
    hospitality: DEFAULT_HOSPITALITY,
    availabilitySchedule: AVAILABILITY_SCHEDULE,
    instagramPosts: INSTAGRAM_POSTS,
    leads: INITIAL_LEADS,
    payments: DEFAULT_PAYMENTS
  };

  try {
    localStorage.setItem(DB_KEY, JSON.stringify(initial));
  } catch {}

  return initial;
};

export const savePalaceDatabase = (state: PalaceDatabaseState): void => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save database to localStorage:', err);
  }
};

export const resetPalaceDatabase = (): PalaceDatabaseState => {
  const resetState: PalaceDatabaseState = {
    siteConfig: DEFAULT_SITE_CONFIG,
    halls: PALACE_HALLS,
    tourNodes: TOUR_NODES,
    entranceStyles: ENTRANCE_STYLES,
    nightServices: DEFAULT_NIGHT_SERVICES,
    hospitality: DEFAULT_HOSPITALITY,
    availabilitySchedule: AVAILABILITY_SCHEDULE,
    instagramPosts: INSTAGRAM_POSTS,
    leads: INITIAL_LEADS,
    payments: DEFAULT_PAYMENTS
  };
  savePalaceDatabase(resetState);
  return resetState;
};
