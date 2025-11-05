/**
 * Waypoints generator for trip routes
 * Generates realistic multi-step routes based on destination
 * Uses real coordinates for popular tourist destinations in Iran
 */

export interface Waypoint {
  latitude: number;
  longitude: number;
  label?: string;
}

/**
 * Generate realistic waypoints for a trip in Tehran, Iran
 * Real coordinates for popular attractions
 */
function generateTehranWaypoints(): Waypoint[] {
  return [
    {
      latitude: 35.6892,
      longitude: 51.3890,
      label: 'Tehran City Center',
    },
    {
      latitude: 35.6961,
      longitude: 51.4231,
      label: 'Golestan Palace',
    },
    {
      latitude: 35.6819,
      longitude: 51.4201,
      label: 'Grand Bazaar',
    },
    {
      latitude: 35.7030,
      longitude: 51.4080,
      label: 'National Museum',
    },
    {
      latitude: 35.7153,
      longitude: 51.4043,
      label: 'Milad Tower',
    },
    {
      latitude: 35.7245,
      longitude: 51.4186,
      label: 'Tabiat Bridge',
    },
    {
      latitude: 35.7448,
      longitude: 51.3750,
      label: 'Darband Mountain',
    },
  ];
}

/**
 * Generate realistic waypoints for a trip in Isfahan, Iran
 * Historical and cultural sites route
 */
function generateIsfahanWaypoints(): Waypoint[] {
  return [
    {
      latitude: 32.6546,
      longitude: 51.6680,
      label: 'Isfahan City Center',
    },
    {
      latitude: 32.6574,
      longitude: 51.6776,
      label: 'Naqsh-e Jahan Square',
    },
    {
      latitude: 32.6614,
      longitude: 51.6714,
      label: 'Imam Mosque',
    },
    {
      latitude: 32.6550,
      longitude: 51.6694,
      label: 'Ali Qapu Palace',
    },
    {
      latitude: 32.6580,
      longitude: 51.6730,
      label: 'Sheikh Lotfollah Mosque',
    },
    {
      latitude: 32.6500,
      longitude: 51.6700,
      label: 'Si-o-se-pol Bridge',
    },
    {
      latitude: 32.6400,
      longitude: 51.6750,
      label: 'Khaju Bridge',
    },
    {
      latitude: 32.6300,
      longitude: 51.6800,
      label: 'Vank Cathedral',
    },
  ];
}

/**
 * Generate realistic waypoints for a trip in Shiraz, Iran
 * Ancient Persian sites and gardens
 */
function generateShirazWaypoints(): Waypoint[] {
  return [
    {
      latitude: 29.5918,
      longitude: 52.5837,
      label: 'Shiraz City Center',
    },
    {
      latitude: 29.6060,
      longitude: 52.5470,
      label: 'Nasir al-Mulk Mosque',
    },
    {
      latitude: 29.6150,
      longitude: 52.5450,
      label: 'Vakil Bazaar',
    },
    {
      latitude: 29.6200,
      longitude: 52.5400,
      label: 'Persepolis',
    },
    {
      latitude: 29.6133,
      longitude: 52.5700,
      label: 'Naqsh-e Rustam',
    },
    {
      latitude: 29.6089,
      longitude: 52.5544,
      label: 'Pasargadae (Tomb of Cyrus)',
    },
    {
      latitude: 29.5918,
      longitude: 52.5837,
      label: 'Eram Garden',
    },
  ];
}

/**
 * Generate realistic waypoints for Mashhad, Iran
 * Religious and cultural sites
 */
function generateMashhadWaypoints(): Waypoint[] {
  return [
    {
      latitude: 36.2605,
      longitude: 59.6168,
      label: 'Mashhad City Center',
    },
    {
      latitude: 36.2880,
      longitude: 59.6158,
      label: 'Imam Reza Shrine',
    },
    {
      latitude: 36.2900,
      longitude: 59.6200,
      label: 'Goharshad Mosque',
    },
    {
      latitude: 36.2950,
      longitude: 59.6100,
      label: 'Nader Shah Museum',
    },
    {
      latitude: 36.2700,
      longitude: 59.6000,
      label: 'Kuh Sangi Park',
    },
  ];
}

/**
 * Generate realistic waypoints for Yazd, Iran
 * Desert city with ancient architecture
 */
function generateYazdWaypoints(): Waypoint[] {
  return [
    {
      latitude: 31.8974,
      longitude: 54.3569,
      label: 'Yazd City Center',
    },
    {
      latitude: 31.9040,
      longitude: 54.3670,
      label: 'Jameh Mosque',
    },
    {
      latitude: 31.9000,
      longitude: 54.3600,
      label: 'Amir Chakhmaq Complex',
    },
    {
      latitude: 31.8950,
      longitude: 54.3500,
      label: 'Zoroastrian Fire Temple',
    },
    {
      latitude: 31.8900,
      longitude: 54.3400,
      label: 'Dowlat Abad Garden',
    },
    {
      latitude: 31.8850,
      longitude: 54.3300,
      label: 'Towers of Silence',
    },
  ];
}

/**
 * Generate realistic waypoints for Tabriz, Iran
 * Historical bazaar and Blue Mosque
 */
function generateTabrizWaypoints(): Waypoint[] {
  return [
    {
      latitude: 38.0815,
      longitude: 46.2945,
      label: 'Tabriz City Center',
    },
    {
      latitude: 38.0830,
      longitude: 46.2960,
      label: 'Tabriz Historic Bazaar',
    },
    {
      latitude: 38.0800,
      longitude: 46.3000,
      label: 'Blue Mosque',
    },
    {
      latitude: 38.0750,
      longitude: 46.3050,
      label: 'Arg of Tabriz',
    },
    {
      latitude: 38.0700,
      longitude: 46.3100,
      label: 'El Goli Park',
    },
  ];
}

/**
 * Generate realistic waypoints based on destination name
 * Uses real coordinates for popular tourist destinations
 */
export function generateWaypointsForDestination(destination?: string | null): Waypoint[] {
  if (!destination) {
    // Default to Tehran if no destination
    return generateTehranWaypoints();
  }

  const dest = destination.toLowerCase().trim();

  // Check for various spellings and Persian names
  if (dest.includes('isfahan') || dest.includes('اصفهان') || dest.includes('esfahan')) {
    return generateIsfahanWaypoints();
  } else if (dest.includes('shiraz') || dest.includes('شیراز')) {
    return generateShirazWaypoints();
  } else if (dest.includes('mashhad') || dest.includes('مشهد')) {
    return generateMashhadWaypoints();
  } else if (dest.includes('yazd') || dest.includes('یزد')) {
    return generateYazdWaypoints();
  } else if (dest.includes('tabriz') || dest.includes('تبریز')) {
    return generateTabrizWaypoints();
  } else if (dest.includes('tehran') || dest.includes('تهران')) {
    return generateTehranWaypoints();
  }

  // Default to Tehran for unknown destinations
  return generateTehranWaypoints();
}
