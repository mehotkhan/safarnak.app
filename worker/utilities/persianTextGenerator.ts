/**
 * Persian Lorem Ipsum Text Generator
 * Generates random Persian (Farsi) text for trip descriptions and notifications
 */

// Persian words for trip-related content
const persianTripWords = [
  'سفر', 'ماجراجویی', 'کاوش', 'مکان', 'مقصد', 'تجربه', 'فرهنگ', 'تاریخ',
  'طبیعت', 'آرامش', 'لذت', 'خاطره', 'ماجرا', 'کشف', 'بازدید', 'گشت',
  'دیدن', 'تجربه کردن', 'کاوش کردن', 'لذت بردن', 'استراحت', 'تفریح',
  'مکان تاریخی', 'موزه', 'معبد', 'قصر', 'باغ', 'کوه', 'دریا', 'ساحل',
  'رستوران', 'غذا', 'محلی', 'سنتی', 'ویژه', 'معروف', 'زیبا', 'جذاب'
];

const persianActivities = [
  'بازدید از مکان‌های تاریخی',
  'گشت‌زنی در خیابان‌های قدیمی',
  'تجربه غذاهای محلی',
  'عکاسی از مناظر زیبا',
  'خرید سوغاتی',
  'استراحت در هتل',
  'تماشای غروب آفتاب',
  'پیاده‌روی در طبیعت',
  'بازدید از موزه',
  'شرکت در تورهای محلی',
  'تجربه فرهنگ محلی',
  'شنا در دریا',
  'کوهنوردی',
  'کشتی سواری',
  'تماشای نمایش محلی'
];

const persianDestinations = [
  'تهران', 'اصفهان', 'شیراز', 'مشهد', 'یزد', 'کاشان', 'تبریز', 'رشت',
  'بندر عباس', 'کرمان', 'همدان', 'قم', 'قم', 'زنجان', 'ساری', 'گرگان',
  'بندر انزلی', 'بوشهر', 'خرم‌آباد', 'ارومیه', 'کرج', 'سمنان', 'قزوین',
  'بجنورد', 'بیرجند', 'یزد', 'چابهار', 'کیش', 'قشم', 'بندر لنگه'
];

const persianTitles = [
  'شروع سفر',
  'ایجاد سفر',
  'پردازش اطلاعات',
  'تولید برنامه سفر',
  'بهینه‌سازی توصیه‌ها',
  'پیدا کردن بهترین گزینه‌ها',
  'تولید برنامه کامل',
  'آماده شدن سفر',
  'سفر آماده است!'
];

const persianMessages = [
  'سفر شما به مقصد انتخاب شده در حال پردازش است...',
  'در حال ایجاد برنامه سفر شخصی‌سازی شده برای شما...',
  'در حال بهینه‌سازی توصیه‌ها برای سفر شما...',
  'سفر شما آماده است! اکنون می‌توانید جزئیات کامل را مشاهده کنید.',
  'برنامه سفر شما با موفقیت تولید شد و آماده استفاده است.'
];

/**
 * Generate random Persian Lorem Ipsum text
 */
export function generatePersianLorem(minWords: number = 5, maxWords: number = 15): string {
  const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words: string[] = [];
  
  for (let i = 0; i < wordCount; i++) {
    words.push(persianTripWords[Math.floor(Math.random() * persianTripWords.length)]);
  }
  
  return words.join(' ');
}

/**
 * Generate random Persian activity
 */
export function generateRandomPersianActivity(): string {
  return persianActivities[Math.floor(Math.random() * persianActivities.length)];
}

/**
 * Generate random Persian destination
 */
export function generateRandomPersianDestination(): string {
  return persianDestinations[Math.floor(Math.random() * persianDestinations.length)];
}

/**
 * Generate random Persian title
 */
export function generateRandomPersianTitle(): string {
  return persianTitles[Math.floor(Math.random() * persianTitles.length)];
}

/**
 * Generate random Persian message
 */
export function generateRandomPersianMessage(): string {
  return persianMessages[Math.floor(Math.random() * persianMessages.length)];
}

/**
 * Generate Persian AI reasoning for trip
 */
export function generatePersianAIReasoning(destination: string): string {
  const reasons = [
    `بر اساس ترجیحات شما برای ${destination}، سفر کاملی طراحی شده که تعادل بین فرهنگ، فعالیت‌ها و آرامش را حفظ می‌کند.`,
    `سفر شما به ${destination} شامل بازدید از مکان‌های تاریخی، تجربه غذاهای محلی و لذت بردن از طبیعت زیبای این منطقه است.`,
    `برنامه سفر شما به ${destination} به گونه‌ای طراحی شده که تمام جنبه‌های سفر را پوشش دهد و تجربه‌ای به‌یادماندنی برای شما فراهم کند.`,
    `سفر طراحی شده به ${destination} شامل بهترین مکان‌های دیدنی، رستوران‌های محلی و فعالیت‌های تفریحی است که برای شما انتخاب شده‌اند.`
  ];
  
  return reasons[Math.floor(Math.random() * reasons.length)];
}

