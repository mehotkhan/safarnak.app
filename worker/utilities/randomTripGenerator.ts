/**
 * Random Trip Data Generator
 * Generates complete random trip data with Persian content
 */

import {
  generatePersianLorem,
  generateRandomPersianActivity,
  generateRandomPersianDestination,
  generatePersianAIReasoning,
} from './persianTextGenerator';

// Destination coordinates (Iranian cities)
const destinationCoordinates: Record<string, { latitude: number; longitude: number }> = {
  'تهران': { latitude: 35.6892, longitude: 51.3890 },
  'اصفهان': { latitude: 32.6546, longitude: 51.6680 },
  'شیراز': { latitude: 29.5918, longitude: 52.5837 },
  'مشهد': { latitude: 36.2605, longitude: 59.6168 },
  'یزد': { latitude: 31.8974, longitude: 54.3670 },
  'کاشان': { latitude: 33.9850, longitude: 51.4099 },
  'تبریز': { latitude: 38.0962, longitude: 46.2738 },
  'رشت': { latitude: 37.2808, longitude: 49.5832 },
  'بندر عباس': { latitude: 27.1865, longitude: 56.2808 },
  'کرمان': { latitude: 30.2839, longitude: 57.0834 },
  'همدان': { latitude: 34.7983, longitude: 48.5146 },
  'قم': { latitude: 34.6399, longitude: 50.8759 },
  'زنجان': { latitude: 36.6769, longitude: 48.4963 },
  'ساری': { latitude: 36.5633, longitude: 53.0601 },
  'گرگان': { latitude: 36.8386, longitude: 54.4347 },
};

/**
 * Generate random date within the next 30-90 days
 */
function generateRandomDate(): string {
  const today = new Date();
  const daysToAdd = Math.floor(Math.random() * 60) + 30; // 30-90 days from now
  const date = new Date(today);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
}

/**
 * Generate random end date (3-7 days after start date)
 */
function generateEndDate(startDate: string): string {
  const start = new Date(startDate);
  const daysToAdd = Math.floor(Math.random() * 5) + 3; // 3-7 days
  const end = new Date(start);
  end.setDate(end.getDate() + daysToAdd);
  return end.toISOString().split('T')[0];
}

/**
 * Generate random itinerary with Persian activities
 */
function generateRandomItinerary(days: number): Array<{ day: number; title: string; activities: string[] }> {
  const itineraryTitles = [
    'روز اول: ورود و استقرار',
    'روز دوم: گشت‌زنی و بازدید',
    'روز سوم: تجربه فرهنگ محلی',
    'روز چهارم: طبیعت و تفریح',
    'روز پنجم: بازدید از مکان‌های تاریخی',
    'روز ششم: غذا و خرید',
    'روز هفتم: خداحافظی'
  ];

  const itinerary: Array<{ day: number; title: string; activities: string[] }> = [];
  
  for (let i = 1; i <= days; i++) {
    const activitiesCount = Math.floor(Math.random() * 4) + 3; // 3-6 activities per day
    const activities: string[] = [];
    
    for (let j = 0; j < activitiesCount; j++) {
      activities.push(generateRandomPersianActivity());
    }
    
    itinerary.push({
      day: i,
      title: itineraryTitles[i - 1] || `روز ${i}: برنامه روزانه`,
      activities,
    });
  }
  
  return itinerary;
}

/**
 * Generate complete random trip data
 */
export function generateRandomTripData(userPreferences?: string) {
  const destination = generateRandomPersianDestination();
  const startDate = generateRandomDate();
  const endDate = generateEndDate(startDate);
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  const budget = Math.floor(Math.random() * 5000) + 500; // $500-$5500
  const travelers = Math.floor(Math.random() * 4) + 1; // 1-4 travelers
  
  const accommodations = ['هتل', 'ویلا', 'اپارتمان', 'مهمانسرا', 'خانه محلی'];
  const accommodation = accommodations[Math.floor(Math.random() * accommodations.length)];
  
  const coordinates = destinationCoordinates[destination] || { latitude: 35.6892, longitude: 51.3890 };
  
  const itinerary = generateRandomItinerary(days);
  const aiReasoning = generatePersianAIReasoning(destination);
  
  const preferences = userPreferences || generatePersianLorem(10, 20);
  
  return {
    destination,
    title: `سفر به ${destination}`,
    startDate,
    endDate,
    budget,
    travelers,
    accommodation,
    preferences,
    aiReasoning,
    itinerary,
    coordinates,
    status: 'completed' as const,
  };
}

