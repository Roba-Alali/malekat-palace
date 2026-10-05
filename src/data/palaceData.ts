/**
 * Palace Data & Specifications for Malekat Palace
 */

import heroBallroomImg from '@/src/assets/images/hero_royal_ballroom_1791122453291.jpg';
import palaceEntranceImg from '@/src/assets/images/palace_grand_entrance_1791122470162.jpg';
import queensBallroomImg from '@/src/assets/images/queens_ballroom_interior_1791122482334.jpg';
import bridalSuiteImg from '@/src/assets/images/bridal_suite_luxury_1791122494670.jpg';
import royalBuffetImg from '@/src/assets/images/royal_hospitality_buffet_1791122510172.jpg';

export interface HallInfo {
  id: string;
  nameAr: string;
  nameEn: string;
  subtitleAr: string;
  subtitleEn: string;
  capacity: string;
  image: string;
  featuresAr: string[];
  featuresEn: string[];
  descriptionAr: string;
  descriptionEn: string;
  specifications: {
    area: string;
    stageDimensions: string;
    staircase: string;
    suites: string;
  };
}

export const PALACE_HALLS: HallInfo[] = [
  {
    id: 'queens-hall',
    nameAr: 'قاعة الملكات',
    nameEn: "The Queens Ballroom",
    subtitleAr: 'القاعة الكبرى للسيدات والعرائس',
    subtitleEn: "Grand Women's Royal Ballroom",
    capacity: '500 - 750 ضيفة',
    image: queensBallroomImg,
    descriptionAr: 'قاعة إمبراطورية مستوحاة من القصور الملكية الأوروبية مع لمسات فرنسية فاخرة، وتدرج رخامي ملكي مزدوج مصمم لزفة العروس، وثريات كريستال تشيكية متدلية من سقف بارتفاع 8 أمتار.',
    descriptionEn: 'An imperial ballroom inspired by grand European royal palaces with French baroque touches, a magnificent double marble staircase for the bridal descent, and Bohemian crystal chandeliers suspended from 8-meter ceilings.',
    featuresAr: [
      'درج رخامي مزدوج مخصص لزفة العروس مع إضاءة ديناميكية',
      'مسرح وكوشة ملكية بتصميمات قابلة للتخصيص الكامل',
      'جناح ملكي خاص للعروس مجهز بصالون تجميل ومصعد خاص مباشر',
      'نظام صوتي واكوستيك سينمائي متطور ونظام ضباب بارد',
      'طاولات ضيافة مجهزة بكريستال فاخر وشاشات عرض عملاقة'
    ],
    featuresEn: [
      'Double imperial marble staircase tailored for the bridal entrance',
      'Customizable royal Kosha stage with architectural lighting',
      'Exclusive private bridal suite with salon and direct private elevator',
      'Concert-grade acoustic system and cold pyro & heavy fog effects',
      'VIP guest banquet tables with Bohemian crystal and giant LED displays'
    ],
    specifications: {
      area: '1,450 م²',
      stageDimensions: '14م × 6م',
      staircase: 'درج ملكي مزدوج متقاطع 24 درجة',
      suites: 'جناحان ملكيان للعروس وأهلها'
    }
  },
  {
    id: 'knights-hall',
    nameAr: 'قاعة الفرسان والرجال',
    nameEn: "The Grand Knights Hall",
    subtitleAr: 'قاعة الاستقبال والضيافة الرجالية الفاخرة',
    subtitleEn: "Grand Men's Reception & Banquet Hall",
    capacity: '350 - 500 ضيف',
    image: palaceEntranceImg,
    descriptionAr: 'تصميم يجمع بين الأصالة العربية والترف المعماري المعاصر، بأعمدة مذهبة وأرائك مخملية فاخرة ومجلس كبار الشخصيات المخصص لاستقبال الضيوف وتقديم القهوة السعودية الفاخرة والبخور الملكي.',
    descriptionEn: 'A majestic hall combining Arabian hospitality with contemporary palatial luxury, gilded pillars, custom velvet sofas, and an exclusive VIP salon for reception with premium Saudi coffee and royal agarwood incense.',
    featuresAr: [
      'مجلس استقبال رئيسي لكبار الشخصيات VIP',
      'مباخر ملكية وطاقم مدرب لتقديم القهوة السعودية والتمور الفاخرة',
      'صالة طعام وبوفيه مفتوح مستقلة تتسع لكافة الحضور',
      'مواقف سيارات خاصة مع خدمة صف السيارات (Valet)',
      'مداخل ومخارج مستقلة بانسيابية تامة'
    ],
    featuresEn: [
      'VIP Grand Reception Majlis with royal armchairs',
      'Dedicated Saudi coffee hospitality team with royal agarwood',
      'Independent banquet dining room for full guest seating',
      'Private parking lot with dedicated valet service',
      'Exclusive separate entrances and exits with privacy guards'
    ],
    specifications: {
      area: '980 م²',
      stageDimensions: 'منصة شرف 10م × 4م',
      staircase: 'مدخل ملكي رخامي مباشر',
      suites: 'صالون تشريفات خاص لكبار الشخصيات'
    }
  }
];

export interface TourNode {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  image: string;
  hotspots: {
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    x: number; // percentage
    y: number; // percentage
  }[];
}

export const TOUR_NODES: TourNode[] = [
  {
    id: 'grand-staircase',
    nameAr: 'الدرج الرخامي والمدخل',
    nameEn: 'The Grand Staircase',
    category: 'المدخل الملكي',
    image: heroBallroomImg,
    hotspots: [
      {
        titleAr: 'درج الزفة الملكية',
        titleEn: 'Royal Bridal Staircase',
        descriptionAr: 'درج رخامي مزدوج بدرابزين مذهب وإضاءة مخفية في كل درجة لظهور سينمائي ساحر للعروس.',
        descriptionEn: 'Double marble grand staircase with gilded gold balustrades and concealed step lighting.',
        x: 48,
        y: 60
      },
      {
        titleAr: 'ثريات الكريستال التشيكية',
        titleEn: 'Czech Crystal Chandeliers',
        descriptionAr: 'ثريات ضخمة بارتفاع 4 أمتار مصنوعة من الكريستال النقي مع تحكم ديناميكي بشدة الإضاءة.',
        descriptionEn: 'Towering 4-meter chandeliers crafted with pure crystal and dynamic dimming control.',
        x: 52,
        y: 22
      },
      {
        titleAr: 'ممر الممشى الملكي',
        titleEn: 'Bridal Marble Aisle',
        descriptionAr: 'ممشى رخامي عاكس للإضاءة مزين بأقواس الورود الطبيعية والشموع العطرية الفاخرة.',
        descriptionEn: 'Illuminated reflective marble aisle lined with fresh floral arches and fragrant candelabras.',
        x: 50,
        y: 82
      }
    ]
  },
  {
    id: 'queens-ballroom',
    nameAr: 'صالة الملكات الكبرى',
    nameEn: 'The Queen’s Ballroom',
    category: 'قاعة الاحتفال',
    image: queensBallroomImg,
    hotspots: [
      {
        titleAr: 'مسرح الكوشة الملكية',
        titleEn: 'Royal Kosha Stage',
        descriptionAr: 'منصة عرض رئيسية مجهزة بخلفيات معمارية ملكية وإضاءة مسرحية بريطانية متقدمة.',
        descriptionEn: 'Main Kosha stage with architectural royal backdrops and automated theatrical lighting.',
        x: 48,
        y: 42
      },
      {
        titleAr: 'طاولات كبار الشخصيات',
        titleEn: 'VIP Banquet Tables',
        descriptionAr: 'طاولات مغطاة بالحرير مع سنتربيس كريستال فرنسي وتنسيق زهور هولندية طازجة.',
        descriptionEn: 'Silk-draped round tables with crystal candelabras and imported Dutch fresh florals.',
        x: 28,
        y: 68
      },
      {
        titleAr: 'أجهزة الضباب والمؤثرات الباردة',
        titleEn: 'Atmospheric Fog & Cold Sparklers',
        descriptionAr: 'نظام ضباب أرضي بارد ومؤثرات شرار آمنة لإبراز لحظة وصول العروس بأعلى معايير السلامة.',
        descriptionEn: 'Heavy low-lying cold fog and indoor sparkler effects designed for a breathtaking entrance.',
        x: 72,
        y: 75
      }
    ]
  },
  {
    id: 'bridal-suite',
    nameAr: 'جناح العروس الإمبراطوري',
    nameEn: 'Imperial Bridal Suite',
    category: 'الجناح الخاص',
    image: bridalSuiteImg,
    hotspots: [
      {
        titleAr: 'مرآة التجهيز المذهبة',
        titleEn: 'Gilded Dressing Vanity',
        descriptionAr: 'مرآة فرنسية عتيقة بإضاءة استوديو محترفة ومقعد مخملي فاخر لأجمل صور التجهيز.',
        descriptionEn: 'Antique French gilded full-length mirror with studio illumination for pre-wedding portraits.',
        x: 42,
        y: 45
      },
      {
        titleAr: 'صالون الاستراحة الملكي',
        titleEn: 'Private Bridal Lounge',
        descriptionAr: 'مكان هادئ للراحة والتقاط الأنفاس مع عائلة العروس وتقديم الضيافة الخاصة.',
        descriptionEn: 'Tranquil sanctuary for the bride and her family with private refreshment service.',
        x: 65,
        y: 65
      },
      {
        titleAr: 'المصعد الملكي المباشر',
        titleEn: 'Direct Private Elevator',
        descriptionAr: 'مصعد خاص ينقل العروس مباشرة من الجناح إلى أعلى الدرج الملكي بكل خصوصية وسلاسة.',
        descriptionEn: 'Private dedicated elevator whisking the bride discreetly to the top of the grand staircase.',
        x: 18,
        y: 50
      }
    ]
  },
  {
    id: 'hospitality-buffet',
    nameAr: 'البوفيه والضيافة الملكية',
    nameEn: 'Royal Dining & Hospitality',
    category: 'الضيافة الفاخرة',
    image: royalBuffetImg,
    hotspots: [
      {
        titleAr: 'أركان الباتيسري والحلويات',
        titleEn: 'French Patisserie & Desserts',
        descriptionAr: 'تشكيلة فاخرة من الماكرون الفرنسي وحلويات الشوكولاتة السويسرية والحلويات الشرقية.',
        descriptionEn: 'Artisanal French macarons, Swiss chocolate creations, and heritage oriental delicacies.',
        x: 35,
        y: 48
      },
      {
        titleAr: 'عربات الضيافة المتنقلة',
        titleEn: 'Royal Service Trolleys',
        descriptionAr: 'عربات مذهبة تجوب القاعة لتقديم المشروبات الباردة والقهوة السعودية والمقبلات الساخنة.',
        descriptionEn: 'Gilded mobile trolleys serving gourmet hot canapés, signature mocktails, and Arabic coffee.',
        x: 68,
        y: 55
      }
    ]
  }
];

export interface EntranceStyle {
  id: string;
  nameAr: string;
  nameEn: string;
  theme: string;
  descriptionAr: string;
  descriptionEn: string;
  audioTempo: string;
  lightingCueAr: string;
  lightingCueEn: string;
  image: string;
}

export const ENTRANCE_STYLES: EntranceStyle[] = [
  {
    id: 'royal-staircase',
    nameAr: 'نزول الدرج الإمبراطوري',
    nameEn: 'The Imperial Staircase Descent',
    theme: 'Royal Majesty',
    descriptionAr: 'تُفتح الأبواب العلوية ببطء، وتتسلل أنوار الكريستال مع ضباب كثيف يغطي درجات السلم، بينما تنزل العروس كملكة متوجة على إيقاع موسيقى ملكية مهيبة.',
    descriptionEn: 'Grand doors glide open, crystal lights dim to warm gold as heavy low-fog cascades down the stairs, welcoming the bride in majestic royal grace.',
    audioTempo: 'موسيقى كلاسيكية ملكية مهيبة (Royal Orchestral)',
    lightingCueAr: 'إضاءة ذهبية خافتة مع تسليط سبوت لايت متحرك يتبع خطوات العروس',
    lightingCueEn: 'Subdued champagne ambience with a tracking warm spotlight following each step',
    image: heroBallroomImg
  },
  {
    id: 'golden-arch',
    nameAr: 'ممر الأقواس الذهبية والورود',
    nameEn: 'The Golden Archway & Florals',
    theme: 'Romantic Fairytale',
    descriptionAr: 'ممر تحيط به 7 أقواس مذهبة مكسوة بالزهور الطبيعية البيضاء والوردية، تنبعث منها نسمات العود الفاخر والروائح الزكية مع عزف كمان حي.',
    descriptionEn: 'An enchanted walkway beneath seven gilded arches blooming with natural white and blush flora, enveloped in fragrant royal oud and live violin.',
    audioTempo: 'عزف كمان رومانسي عاطفي (Live Romantic Violin)',
    lightingCueAr: 'تدرجات الوردي والشمبانيا الدافئ مع شموع حية آمنة',
    lightingCueEn: 'Soft blush and warm champagne gradient with ambient candle illumination',
    image: queensBallroomImg
  },
  {
    id: 'crystal-reveal',
    nameAr: 'ظهور ستارة الكريستال الساحرة',
    nameEn: 'The Crystal Curtain Reveal',
    theme: 'Glamour & Brilliance',
    descriptionAr: 'تفتح ستارة الكريستال اللامعة على المسرح مباشرة وسط إطلاق الشرر البارد الآمن وأجهزة المؤثرات الضوئية المتناغمة مع تصفيق وانبهار الحضور.',
    descriptionEn: 'A shimmering crystal curtain parts at center stage amidst safe cold sparklers and orchestrated lighting cues, captivating every single guest.',
    audioTempo: 'زفة عصرية حماسية راقية (Modern Symphonic Zaffah)',
    lightingCueAr: 'إضاءة كريستالية متلألئة مع انفجار ضوئي مدروس عند وصول المسرح',
    lightingCueEn: 'Sparkling diamond-white beams transitioning into a celebratory warm wash',
    image: bridalSuiteImg
  }
];

export interface AvailabilityDate {
  date: string; // YYYY-MM-DD
  status: 'available' | 'booked' | 'limited';
  hall: 'both' | 'queens' | 'knights';
  noteAr?: string;
  noteEn?: string;
}

// Generate availability schedule for October 2026 and surrounding months
export const AVAILABILITY_SCHEDULE: AvailabilityDate[] = [
  { date: '2026-10-01', status: 'available', hall: 'both' },
  { date: '2026-10-02', status: 'booked', hall: 'queens', noteAr: 'محجوز - حفل زفاف', noteEn: 'Booked - Wedding' },
  { date: '2026-10-03', status: 'booked', hall: 'both', noteAr: 'محجوز بالكامل', noteEn: 'Fully Booked' },
  { date: '2026-10-04', status: 'available', hall: 'both' },
  { date: '2026-10-05', status: 'available', hall: 'knights' },
  { date: '2026-10-08', status: 'limited', hall: 'queens', noteAr: 'تأكيد مبدئي قيد المراجعة', noteEn: 'Preliminary Option Hold' },
  { date: '2026-10-09', status: 'booked', hall: 'both', noteAr: 'محجوز - زفاف ملكي', noteEn: 'Booked - Royal Wedding' },
  { date: '2026-10-10', status: 'booked', hall: 'both', noteAr: 'محجوز بالكامل', noteEn: 'Fully Booked' },
  { date: '2026-10-15', status: 'available', hall: 'both' },
  { date: '2026-10-16', status: 'booked', hall: 'queens', noteAr: 'محجوز', noteEn: 'Booked' },
  { date: '2026-10-17', status: 'available', hall: 'both' },
  { date: '2026-10-22', status: 'available', hall: 'both' },
  { date: '2026-10-23', status: 'booked', hall: 'both', noteAr: 'محجوز - زفاف', noteEn: 'Booked - Wedding' },
  { date: '2026-10-24', status: 'booked', hall: 'both', noteAr: 'محجوز بالكامل', noteEn: 'Fully Booked' },
  { date: '2026-10-29', status: 'available', hall: 'both' },
  { date: '2026-10-30', status: 'limited', hall: 'both', noteAr: 'متاح - طلب زيارة قائم', noteEn: 'Tour scheduled' },
  { date: '2026-10-31', status: 'available', hall: 'both' },
  // November 2026
  { date: '2026-11-05', status: 'available', hall: 'both' },
  { date: '2026-11-06', status: 'booked', hall: 'both' },
  { date: '2026-11-07', status: 'booked', hall: 'queens' },
  { date: '2026-11-12', status: 'available', hall: 'both' },
  { date: '2026-11-13', status: 'available', hall: 'both' },
  { date: '2026-11-20', status: 'booked', hall: 'both' },
  // December 2026
  { date: '2026-12-10', status: 'available', hall: 'both' },
  { date: '2026-12-15', status: 'available', hall: 'both' },
  { date: '2026-12-25', status: 'booked', hall: 'both' },
  { date: '2026-12-31', status: 'booked', hall: 'both' }
];

export interface InstagramPost {
  id: string;
  imageUrl: string;
  likes: number;
  captionAr: string;
  captionEn: string;
  tag: string;
  date: string;
}

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'post-1',
    imageUrl: heroBallroomImg,
    likes: 3420,
    captionAr: 'لحظة نزول العروس من الدرج الملكي في قصر الملكات... تفاصيل لا تُنسى ✨👑',
    captionEn: 'The magical moment the bride descends the grand staircase at Malekat Palace... unforgettable details ✨👑',
    tag: '#قصر_الملكات #زواج_ملكي',
    date: 'منذ يومين'
  },
  {
    id: 'post-2',
    imageUrl: queensBallroomImg,
    likes: 2890,
    captionAr: 'تناغم الكريستال التشيكي مع ألوان الشمبانيا والورود الطبيعية الهولندية 🌸🤍',
    captionEn: 'Bohemian crystals harmonizing with champagne florals and natural Dutch blooms 🌸🤍',
    tag: '#ديكور_أفراح #كوشة_ملكية',
    date: 'منذ ٤ أيام'
  },
  {
    id: 'post-3',
    imageUrl: bridalSuiteImg,
    likes: 4110,
    captionAr: 'جناح العروس الإمبراطوري... كل ركن صُمم ليمنحك هدوء الملوك وراحة البال قبل الزفة 🕊️💍',
    captionEn: 'The Imperial Bridal Suite... designed to grant peace of mind and royal serenity before the grand entrance 🕊️💍',
    tag: '#جناح_العروس #عروس_الملكات',
    date: 'منذ أسبوع'
  },
  {
    id: 'post-4',
    imageUrl: royalBuffetImg,
    likes: 1980,
    captionAr: 'ضيافة تليق بمقام ضيوفك الكرام. من بوفيه الشوكولاتة الفاخرة إلى القهوة السعودية الأصيلة ☕🍮',
    captionEn: 'Hospitality befitting your esteemed guests. From fine patisseries to authentic Saudi coffee traditions ☕🍮',
    tag: '#ضيافة_الملكات #بوفيه_ملكي',
    date: 'منذ أسبوعين'
  },
  {
    id: 'post-5',
    imageUrl: palaceEntranceImg,
    likes: 5200,
    captionAr: 'واجهة قصر الملكات عند الغسق... بداية الحلم والذكرى التي تدوم العمر ✨🏛️',
    captionEn: 'Malekat Palace facade at twilight... where dreams begin and memories last forever ✨🏛️',
    tag: '#قصر_الملكات #فخامة',
    date: 'منذ شهر'
  }
];

export interface LeadCRM {
  id: string;
  name: string;
  phone: string;
  occasion: string;
  date: string;
  guests: number;
  hall: string;
  theme: string;
  estimatedBudget: number;
  status: 'new' | 'contacted' | 'visit_scheduled' | 'quote_sent' | 'confirmed' | 'archived';
  notes: string;
  createdAt: string;
}

export const INITIAL_LEADS: LeadCRM[] = [
  {
    id: 'lead-101',
    name: 'سارة القحطاني',
    phone: '+966501234567',
    occasion: 'زفاف',
    date: '2026-11-15',
    guests: 450,
    hall: 'قاعة الملكات',
    theme: 'Imperial Gold & Ivory',
    estimatedBudget: 85000,
    status: 'visit_scheduled',
    notes: 'ترغب بمشاهدة زفة الدرج الرخامي وتنسيق كوشة الورود الطبيعية.',
    createdAt: '2026-10-02'
  },
  {
    id: 'lead-102',
    name: 'عبدالله بن عبدالعزيز',
    phone: '+966559876543',
    occasion: 'زفاف (كلا القاعتين)',
    date: '2026-12-20',
    guests: 650,
    hall: 'قاعة الملكات + قاعة الفرسان',
    theme: 'Royal Classic',
    estimatedBudget: 140000,
    status: 'quote_sent',
    notes: 'تم إرسال عرض الضيافة الملكية والقهوة السعودية مع مواقف السيارات المحجوزة.',
    createdAt: '2026-10-03'
  },
  {
    id: 'lead-103',
    name: 'نورة المنصور',
    phone: '+966543210987',
    occasion: 'خطوبة ملكية',
    date: '2026-10-31',
    guests: 250,
    hall: 'قاعة الملكات',
    theme: 'Romantic Blush & Orchid',
    estimatedBudget: 55000,
    status: 'new',
    notes: 'استفسار عبر مصمم ليلة الملكات للمدخل الرخامي مع عربات الباتيسري.',
    createdAt: '2026-10-04'
  }
];
