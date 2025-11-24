/**
 * Mock Data for Safarnak App
 * 
 * This file contains all mock data used throughout the app for UI/UX development.
 * These will be replaced with real data from GraphQL queries in future phases.
 */

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export type NotificationType = 'social' | 'trip' | 'tour' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  fullMessage?: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  actionData?: any;
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'social',
    title: 'Sarah Johnson used your trip',
    message: 'Your Tokyo Adventure trip was used for planning',
    fullMessage: 'Sarah Johnson has used your "Tokyo Adventure" trip as a template for their upcoming journey. Your detailed itinerary and recommendations have helped another traveler plan their perfect trip!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionable: true,
    actionData: {
      type: 'trip',
      id: '123',
      userName: 'Sarah Johnson',
    },
  },
  {
    id: '2',
    type: 'social',
    title: 'Mike Chen commented on your post',
    message: 'Great photos from your mountain trip!',
    fullMessage: 'Mike Chen commented: "These are absolutely stunning photos! The mountain landscapes look incredible. How was the weather during your trek? I\'m planning a similar trip next month and would love to know more about your experience."',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
    actionable: true,
    actionData: {
      type: 'post',
      id: '456',
    },
  },
  {
    id: '3',
    type: 'tour',
    title: 'New member joined your tour',
    message: 'Emma Wilson joined "Swiss Alps Adventure"',
    fullMessage: 'Good news! Emma Wilson has joined your "Swiss Alps Adventure" tour. You now have 8 members in the group. Emma is an experienced hiker and photographer based in Zurich.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
    actionable: true,
    actionData: {
      type: 'tour',
      id: '789',
      tourName: 'Swiss Alps Adventure',
    },
  },
  {
    id: '4',
    type: 'trip',
    title: 'AI has a suggestion for your trip',
    message: 'Better route found for your Paris trip',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'Weather alert',
    message: 'Rain expected during your Barcelona trip dates',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

// ============================================================================
// INSPIRATIONAL TRIPS (Feed)
// ============================================================================

export interface InspirationalTrip {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: string;
  budget: string;
  imageUrl: string;
  tags: string[];
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  usedCount: number;
  rating: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const mockInspirationalTrips: InspirationalTrip[] = [
  {
    id: '1',
    title: 'Hidden Gems of Northern Iran',
    description: 'Explore the lush forests and mountain villages of Gilan and Mazandaran provinces',
    destination: 'Northern Iran',
    duration: '7 days',
    budget: '$500-800',
    imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
    tags: ['Nature', 'Mountains', 'Culture'],
    author: {
      name: 'Reza Ahmadi',
      username: 'reza_explorer',
    },
    usedCount: 248,
    rating: 4.8,
    difficulty: 'medium',
  },
  {
    id: '2',
    title: 'Desert Adventure: Yazd to Kerman',
    description: 'Journey through ancient desert cities and stunning landscapes',
    destination: 'Central Iran',
    duration: '5 days',
    budget: '$400-600',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    tags: ['Desert', 'History', 'Architecture'],
    author: {
      name: 'Sara Mohammadi',
      username: 'sara_wanderer',
    },
    usedCount: 182,
    rating: 4.9,
    difficulty: 'easy',
  },
  {
    id: '3',
    title: 'Kurdish Highlands Trek',
    description: 'Trek through breathtaking mountain ranges and experience Kurdish hospitality',
    destination: 'Kurdistan Province',
    duration: '10 days',
    budget: '$600-1000',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    tags: ['Adventure', 'Trekking', 'Mountains'],
    author: {
      name: 'Ali Karimi',
      username: 'ali_hiker',
    },
    usedCount: 156,
    rating: 4.7,
    difficulty: 'hard',
  },
  {
    id: '4',
    title: 'Southern Islands: Persian Gulf Escape',
    description: 'Discover the tropical beauty of Qeshm, Kish, and Hormuz islands',
    destination: 'Persian Gulf',
    duration: '6 days',
    budget: '$700-1200',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    tags: ['Beach', 'Islands', 'Relaxation'],
    author: {
      name: 'Mina Hosseini',
      username: 'mina_travel',
    },
    usedCount: 321,
    rating: 4.9,
    difficulty: 'easy',
  },
  {
    id: '5',
    title: 'Silk Road Heritage',
    description: 'Follow ancient trade routes through Isfahan, Kashan, and Shiraz',
    destination: 'Central & Southern Iran',
    duration: '8 days',
    budget: '$800-1500',
    imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
    tags: ['History', 'Culture', 'Architecture'],
    author: {
      name: 'Hassan Rahmani',
      username: 'hassan_heritage',
    },
    usedCount: 412,
    rating: 5.0,
    difficulty: 'easy',
  },
];

// ============================================================================
// SHAREABLE TRIPS (Explore)
// ============================================================================

export interface ShareableTrip {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  imageUrl: string;
  route: string[];
  highlights: string[];
  season: string;
  difficulty: 'easy' | 'medium' | 'hard';
  style: string[];
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  usedCount: number;
  savedCount: number;
  rating: number;
  reviewsCount: number;
  isPublic: boolean;
  createdAt: Date;
}

export const mockShareableTrips: ShareableTrip[] = [
  {
    id: '1',
    title: 'Northern Paradise: Gilan & Mazandaran Adventure',
    description: 'A week-long journey through lush forests, mountain villages, and coastal beauty of Northern Iran',
    destination: 'Gilan & Mazandaran',
    duration: 7,
    budget: { min: 500, max: 800, currency: 'USD' },
    imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
    route: ['Tehran', 'Ramsar', 'Masuleh', 'Lahijan', 'Rasht', 'Anzali', 'Tehran'],
    highlights: ['Masuleh Village', 'Caspian Sea', 'Rice Fields', 'Forest Hiking'],
    season: 'Spring',
    difficulty: 'medium',
    style: ['Nature', 'Adventure', 'Culture'],
    author: {
      name: 'Reza Ahmadi',
      username: 'reza_explorer',
    },
    usedCount: 248,
    savedCount: 156,
    rating: 4.8,
    reviewsCount: 42,
    isPublic: true,
    createdAt: new Date(2024, 9, 15),
  },
  {
    id: '2',
    title: 'Desert Dreams: Yazd to Kerman Route',
    description: 'Explore ancient desert cities, stunning landscapes, and rich Persian heritage',
    destination: 'Central Iran',
    duration: 5,
    budget: { min: 400, max: 600, currency: 'USD' },
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    route: ['Yazd', 'Meybod', 'Kharanaq', 'Kerman', 'Mahan'],
    highlights: ['Windcatchers', 'Desert Castles', 'Fire Temple', 'Shazdeh Garden'],
    season: 'Autumn',
    difficulty: 'easy',
    style: ['History', 'Desert', 'Culture'],
    author: {
      name: 'Sara Mohammadi',
      username: 'sara_wanderer',
    },
    usedCount: 182,
    savedCount: 94,
    rating: 4.9,
    reviewsCount: 31,
    isPublic: true,
    createdAt: new Date(2024, 8, 20),
  },
  {
    id: '3',
    title: 'Kurdish Highlands: Nature & Culture',
    description: 'Trek through breathtaking mountains and experience Kurdish culture and hospitality',
    destination: 'Kurdistan Province',
    duration: 10,
    budget: { min: 600, max: 1000, currency: 'USD' },
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    route: ['Sanandaj', 'Palangan', 'Uraman Takht', 'Howraman', 'Marivan'],
    highlights: ['Palangan Village', 'Howraman Valley', 'Mountain Trekking', 'Local Culture'],
    season: 'Summer',
    difficulty: 'hard',
    style: ['Adventure', 'Trekking', 'Nature'],
    author: {
      name: 'Ali Karimi',
      username: 'ali_hiker',
    },
    usedCount: 156,
    savedCount: 127,
    rating: 4.7,
    reviewsCount: 28,
    isPublic: true,
    createdAt: new Date(2024, 7, 10),
  },
  {
    id: '4',
    title: 'Persian Gulf Islands Escape',
    description: 'Discover the tropical beauty of Qeshm, Kish, and Hormuz islands',
    destination: 'Persian Gulf',
    duration: 6,
    budget: { min: 700, max: 1200, currency: 'USD' },
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    route: ['Qeshm', 'Hengam Island', 'Hormuz Island', 'Kish'],
    highlights: ['Stars Valley', 'Rainbow Mountain', 'Beaches', 'Water Sports'],
    season: 'Winter',
    difficulty: 'easy',
    style: ['Beach', 'Relaxation', 'Nature'],
    author: {
      name: 'Mina Hosseini',
      username: 'mina_travel',
    },
    usedCount: 321,
    savedCount: 198,
    rating: 4.9,
    reviewsCount: 56,
    isPublic: true,
    createdAt: new Date(2024, 10, 5),
  },
  {
    id: '5',
    title: 'Silk Road Heritage Trail',
    description: 'Follow ancient trade routes through Isfahan, Kashan, and Shiraz',
    destination: 'Central & Southern Iran',
    duration: 8,
    budget: { min: 800, max: 1500, currency: 'USD' },
    imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
    route: ['Tehran', 'Kashan', 'Isfahan', 'Yazd', 'Shiraz'],
    highlights: ['Isfahan Bridges', 'Kashan Gardens', 'Persepolis', 'Nasir al-Mulk Mosque'],
    season: 'Spring',
    difficulty: 'easy',
    style: ['History', 'Culture', 'Architecture'],
    author: {
      name: 'Hassan Rahmani',
      username: 'hassan_heritage',
    },
    usedCount: 412,
    savedCount: 245,
    rating: 5.0,
    reviewsCount: 73,
    isPublic: true,
    createdAt: new Date(2024, 9, 1),
  },
];

// ============================================================================
// MY SHAREABLE TRIPS (Create Tab)
// ============================================================================

export interface MyShareableTrip {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  imageUrl: string;
  isPublic: boolean;
  usedCount: number;
  savedCount: number;
  viewsCount: number;
  createdAt: Date;
  lastUpdated: Date;
}

export const mockMyShareableTrips: MyShareableTrip[] = [
  {
    id: '1',
    title: 'Weekend Getaway to Caspian Coast',
    description: 'Perfect 3-day escape to northern beaches',
    destination: 'Mazandaran',
    duration: 3,
    imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
    isPublic: true,
    usedCount: 42,
    savedCount: 28,
    viewsCount: 156,
    createdAt: new Date(2024, 9, 1),
    lastUpdated: new Date(2024, 10, 15),
  },
  {
    id: '2',
    title: 'Cultural Heritage Tour: Isfahan',
    description: 'Explore the magnificent architecture and history',
    destination: 'Isfahan',
    duration: 4,
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    isPublic: true,
    usedCount: 67,
    savedCount: 45,
    viewsCount: 298,
    createdAt: new Date(2024, 8, 15),
    lastUpdated: new Date(2024, 10, 10),
  },
  {
    id: '3',
    title: 'Mountain Trekking Adventure',
    description: 'Challenging trek through Alborz mountains',
    destination: 'Alborz',
    duration: 5,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    isPublic: false,
    usedCount: 0,
    savedCount: 0,
    viewsCount: 12,
    createdAt: new Date(2024, 10, 20),
    lastUpdated: new Date(2024, 10, 20),
  },
];

// ============================================================================
// TOUR GROUP MEMBERS
// ============================================================================

export interface GroupMember {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  role: 'host' | 'member';
  joinedDate: Date;
  isOnline: boolean;
}

export const mockGroupMembers: GroupMember[] = [
  {
    id: '1',
    name: 'Reza Ahmadi',
    username: 'reza_explorer',
    role: 'host',
    joinedDate: new Date(2024, 8, 1),
    isOnline: true,
  },
  {
    id: '2',
    name: 'Sara Mohammadi',
    username: 'sara_wanderer',
    role: 'member',
    joinedDate: new Date(2024, 9, 15),
    isOnline: true,
  },
  {
    id: '3',
    name: 'Ali Karimi',
    username: 'ali_hiker',
    role: 'member',
    joinedDate: new Date(2024, 10, 1),
    isOnline: false,
  },
  {
    id: '4',
    name: 'Mina Hosseini',
    username: 'mina_travel',
    role: 'member',
    joinedDate: new Date(2024, 10, 10),
    isOnline: true,
  },
  {
    id: '5',
    name: 'Hassan Rahmani',
    username: 'hassan_heritage',
    role: 'member',
    joinedDate: new Date(2024, 10, 18),
    isOnline: false,
  },
];

// ============================================================================
// TOUR CHAT MESSAGES
// ============================================================================

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  name: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
}

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    userId: '1',
    username: 'reza_explorer',
    name: 'Reza Ahmadi',
    message: 'Welcome everyone to our Northern Iran tour group! 🎉',
    timestamp: new Date(2024, 10, 20, 10, 30),
    isOwn: false,
  },
  {
    id: '2',
    userId: '2',
    username: 'sara_wanderer',
    name: 'Sara Mohammadi',
    message: 'Thank you! Really excited for this trip!',
    timestamp: new Date(2024, 10, 20, 10, 35),
    isOwn: false,
  },
  {
    id: '3',
    userId: '1',
    username: 'reza_explorer',
    name: 'Reza Ahmadi',
    message: 'We will meet at Tehran Grand Hotel on Friday at 8 AM. Please be on time!',
    timestamp: new Date(2024, 10, 20, 10, 40),
    isOwn: false,
  },
  {
    id: '4',
    userId: '3',
    username: 'ali_hiker',
    name: 'Ali Karimi',
    message: 'Do we need to bring our own hiking boots?',
    timestamp: new Date(2024, 10, 20, 11, 15),
    isOwn: false,
  },
  {
    id: '5',
    userId: '1',
    username: 'reza_explorer',
    name: 'Reza Ahmadi',
    message: 'Yes, comfortable hiking shoes are recommended. We will be doing some forest trekking.',
    timestamp: new Date(2024, 10, 20, 11, 20),
    isOwn: false,
  },
  {
    id: '6',
    userId: '4',
    username: 'mina_travel',
    name: 'Mina Hosseini',
    message: 'What about the weather? Should we bring rain jackets?',
    timestamp: new Date(2024, 10, 20, 14, 30),
    isOwn: false,
  },
  {
    id: '7',
    userId: '1',
    username: 'reza_explorer',
    name: 'Reza Ahmadi',
    message: 'Good question! Yes, northern Iran can be rainy. Bring rain jackets and an extra layer for cool evenings.',
    timestamp: new Date(2024, 10, 20, 14, 45),
    isOwn: false,
  },
  {
    id: '8',
    userId: '5',
    username: 'hassan_heritage',
    name: 'Hassan Rahmani',
    message: 'Looking forward to meeting everyone! See you Friday! 👋',
    timestamp: new Date(2024, 10, 20, 16, 20),
    isOwn: false,
  },
];

// ============================================================================
// HISTORY (Profile)
// ============================================================================

export interface HistoryItem {
  id: string;
  type: 'trip' | 'tour' | 'post';
  title: string;
  description: string;
  imageUrl?: string;
  date: Date;
  location?: string;
  stats?: {
    likes?: number;
    comments?: number;
    members?: number;
  };
}

export const mockHistory: HistoryItem[] = [
  {
    id: '1',
    type: 'trip',
    title: 'Summer Vacation in Mazandaran',
    description: 'Amazing week at Caspian coast with family',
    imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
    date: new Date(2024, 7, 15),
    location: 'Mazandaran, Iran',
    stats: {
      likes: 42,
      comments: 12,
    },
  },
  {
    id: '2',
    type: 'tour',
    title: 'Northern Hiking Group',
    description: 'Successfully completed 5-day trek with great people',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    date: new Date(2024, 6, 20),
    location: 'Alborz Mountains',
    stats: {
      members: 8,
    },
  },
  {
    id: '3',
    type: 'post',
    title: 'Hidden Gem: Masuleh Village',
    description: 'Shared my experience visiting this beautiful stepped village',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    date: new Date(2024, 5, 10),
    location: 'Gilan, Iran',
    stats: {
      likes: 156,
      comments: 23,
    },
  },
  {
    id: '4',
    type: 'trip',
    title: 'Desert Adventure: Yazd & Kerman',
    description: 'Explored ancient desert cities and their rich history',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    date: new Date(2024, 4, 5),
    location: 'Central Iran',
    stats: {
      likes: 89,
      comments: 15,
    },
  },
  {
    id: '5',
    type: 'tour',
    title: 'Isfahan Cultural Tour',
    description: 'Led a successful cultural tour of Isfahan\'s landmarks',
    imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800',
    date: new Date(2024, 3, 12),
    location: 'Isfahan, Iran',
    stats: {
      members: 12,
    },
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) {
    return 'just now';
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else {
    return `${days}d ago`;
  }
};

export const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  switch (difficulty) {
    case 'easy':
      return '#10b981';
    case 'medium':
      return '#f59e0b';
    case 'hard':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

