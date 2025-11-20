export interface ActivityObject {
  time?: string;
  title?: string;
  location?: string;
  coords?: { lat: number; lon: number } | { latitude: number; longitude: number };
  duration?: number;
  cost?: number;
  type?: string;
  description?: string;
}

export interface RichDay {
  day: number;
  title: string;
  activities: Array<string | ActivityObject>;
  estimatedCost?: number;
}

export interface DbDay {
  day: number;
  title: string;
  activities: string[];
}

export interface Waypoint {
  latitude: number;
  longitude: number;
  label?: string;
  order: number;
}

