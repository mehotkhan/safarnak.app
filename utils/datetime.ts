/**
 * DateTime Utilities with Multi-Calendar Support
 * 
 * Uses Luxon for date/time operations with support for:
 * - Gregorian calendar (default for English)
 * - Persian/Jalali calendar (for Persian/Farsi language)
 * - Other calendars via Luxon's calendar system
 * 
 * @see https://moment.github.io/luxon/#/calendars
 * @see https://github.com/moment/luxon
 */

import { DateTime } from 'luxon';
import { useLanguage } from '@components/context/LanguageContext';

/**
 * Calendar mapping based on language
 * Maps language codes to Intl calendar identifiers
 * Luxon uses Intl.DateTimeFormat calendar option for calendar support
 * 
 * @see https://moment.github.io/luxon/#/calendars
 */
const CALENDAR_MAP: Record<string, string> = {
  'fa': 'persian', // Persian/Jalali calendar for Farsi
  'ar': 'islamic', // Islamic calendar for Arabic
  'en': 'gregory', // Gregorian calendar for English (default)
  // Add more language-to-calendar mappings as needed
};

/**
 * Locale mapping for proper formatting
 * Maps language codes to locale identifiers
 */
const LOCALE_MAP: Record<string, string> = {
  'fa': 'fa-IR', // Persian/Farsi locale
  'ar': 'ar-SA', // Arabic locale
  'en': 'en-US', // English locale
};

/**
 * Get the appropriate calendar system for a given language
 * Returns Intl calendar identifier for use in toLocaleString
 */
export function getCalendarForLanguage(language: string): string {
  return CALENDAR_MAP[language] || 'gregory';
}

/**
 * Get the appropriate locale for a given language
 * Returns locale identifier for use in toLocaleString
 */
export function getLocaleForLanguage(language: string): string {
  return LOCALE_MAP[language] || 'en-US';
}

/**
 * Format a date string to relative time (e.g., "2h ago", "3d ago")
 * Supports i18n and multi-calendar
 * 
 * @param dateString - ISO date string or Date object
 * @param language - Language code (e.g., 'en', 'fa')
 * @param t - Translation function (optional)
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  dateString: string | Date,
  language: string = 'en',
  t?: (key: string) => string
): string {
  try {
    // Create DateTime object (always Gregorian internally)
    const date = typeof dateString === 'string' 
      ? DateTime.fromISO(dateString)
      : DateTime.fromJSDate(dateString);
    
    if (!date.isValid) {
      return dateString.toString();
    }

    const now = DateTime.now().setZone(date.zoneName || 'local');
    const diff = now.diff(date, ['seconds', 'minutes', 'hours', 'days', 'weeks']).toObject();

    // Use translation function if provided, otherwise use English defaults
    const translate = (key: string, defaultValue: string) => t ? t(key) : defaultValue;

    if (diff.seconds && diff.seconds < 60) {
      return translate('common.time.justNow', 'just now');
    }
    
    if (diff.minutes && diff.minutes < 60) {
      const minutes = Math.floor(diff.minutes);
      return translate('common.time.minutesAgo', `${minutes}m ago`);
    }
    
    if (diff.hours && diff.hours < 24) {
      const hours = Math.floor(diff.hours);
      return translate('common.time.hoursAgo', `${hours}h ago`);
    }
    
    if (diff.days && diff.days < 7) {
      const days = Math.floor(diff.days);
      return translate('common.time.daysAgo', `${days}d ago`);
    }
    
    if (diff.weeks && diff.weeks < 4) {
      const weeks = Math.floor(diff.weeks);
      return translate('common.time.weeksAgo', `${weeks}w ago`);
    }

    // For older dates, return formatted date using calendar-aware formatting
    return formatDate(dateString, language, 'short');
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return dateString.toString();
  }
}

/**
 * Format a date string to a readable date format
 * Supports multiple formats and calendars
 * 
 * @param dateString - ISO date string or Date object
 * @param language - Language code (e.g., 'en', 'fa')
 * @param format - Format type: 'short', 'long', 'medium', or custom format string
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date,
  language: string = 'en',
  format: 'short' | 'long' | 'medium' | string = 'medium'
): string {
  try {
    // Create DateTime object (always Gregorian internally)
    const date = typeof dateString === 'string'
      ? DateTime.fromISO(dateString)
      : DateTime.fromJSDate(dateString);
    
    if (!date.isValid) {
      return dateString.toString();
    }

    const calendar = getCalendarForLanguage(language);
    const locale = getLocaleForLanguage(language);
    
    // Define format presets with calendar support
    // Luxon uses Intl.DateTimeFormat with calendar option for calendar-aware formatting
    // When language is Persian (fa), calendar will be 'persian' (Jalali)
    const formatPresets: Record<string, Intl.DateTimeFormatOptions> = {
      short: { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        calendar: calendar,
      },
      medium: { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        calendar: calendar,
      },
      long: { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long',
        calendar: calendar,
      },
    };

    // Use preset or custom format
    if (formatPresets[format]) {
      // Use toLocaleString with locale and calendar option for calendar-aware formatting
      // This will display dates in Jalali calendar when language is Persian
      return date.setLocale(locale).toLocaleString(formatPresets[format]);
    } else {
      // For custom format strings, use medium format with calendar
      return date.setLocale(locale).toLocaleString(formatPresets.medium);
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString.toString();
  }
}

/**
 * Format a date string to time only (e.g., "14:30")
 * 
 * @param dateString - ISO date string or Date object
 * @param language - Language code
 * @param format - Time format: 'short' (HH:mm) or 'long' (HH:mm:ss)
 * @returns Formatted time string
 */
export function formatTime(
  dateString: string | Date,
  language: string = 'en',
  format: 'short' | 'long' = 'short'
): string {
  try {
    // Create DateTime object (time formatting doesn't need calendar)
    const date = typeof dateString === 'string'
      ? DateTime.fromISO(dateString)
      : DateTime.fromJSDate(dateString);
    
    if (!date.isValid) {
      return dateString.toString();
    }

    // Time formatting doesn't depend on calendar system
    return format === 'short' 
      ? date.toFormat('HH:mm')
      : date.toFormat('HH:mm:ss');
  } catch (error) {
    console.error('Error formatting time:', error);
    return dateString.toString();
  }
}

/**
 * Format a date string to date and time
 * 
 * @param dateString - ISO date string or Date object
 * @param language - Language code
 * @param dateFormat - Date format type
 * @param timeFormat - Time format type
 * @returns Formatted date and time string
 */
export function formatDateTime(
  dateString: string | Date,
  language: string = 'en',
  dateFormat: 'short' | 'long' | 'medium' = 'medium',
  timeFormat: 'short' | 'long' = 'short'
): string {
  try {
    const dateStr = formatDate(dateString, language, dateFormat);
    const timeStr = formatTime(dateString, language, timeFormat);
    return `${dateStr} ${timeStr}`;
  } catch (error) {
    console.error('Error formatting date time:', error);
    return dateString.toString();
  }
}

/**
 * Get current date/time in the specified calendar system
 * 
 * @param language - Language code
 * @returns DateTime object with appropriate calendar
 */
export function getNow(language: string = 'en'): DateTime {
  // DateTime.now() always returns Gregorian internally
  // Calendar is only used when formatting for display
  return DateTime.now();
}

/**
 * Parse a date string and return DateTime object with appropriate calendar
 * 
 * @param dateString - ISO date string or Date object
 * @param language - Language code
 * @returns DateTime object
 */
export function parseDate(
  dateString: string | Date,
  language: string = 'en'
): DateTime {
  // DateTime objects are always Gregorian internally
  // Calendar is only used when formatting for display
  return typeof dateString === 'string'
    ? DateTime.fromISO(dateString)
    : DateTime.fromJSDate(dateString);
}

/**
 * Check if a date is today
 * 
 * @param dateString - ISO date string or Date object
 * @param language - Language code
 * @returns true if date is today
 */
export function isToday(dateString: string | Date, language: string = 'en'): boolean {
  try {
    const date = parseDate(dateString, language);
    const today = getNow(language);
    return date.hasSame(today, 'day');
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
}

/**
 * Check if a date is in the past
 * 
 * @param dateString - ISO date string or Date object
 * @param language - Language code
 * @returns true if date is in the past
 */
export function isPast(dateString: string | Date, language: string = 'en'): boolean {
  try {
    const date = parseDate(dateString, language);
    const now = getNow(language);
    return date < now;
  } catch (error) {
    console.error('Error checking if date is past:', error);
    return false;
  }
}

/**
 * Check if a date is in the future
 * 
 * @param dateString - ISO date string or Date object
 * @param language - Language code
 * @returns true if date is in the future
 */
export function isFuture(dateString: string | Date, language: string = 'en'): boolean {
  try {
    const date = parseDate(dateString, language);
    const now = getNow(language);
    return date > now;
  } catch (error) {
    console.error('Error checking if date is future:', error);
    return false;
  }
}

/**
 * Get difference between two dates
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @param language - Language code
 * @param unit - Unit of difference: 'days', 'hours', 'minutes', 'seconds'
 * @returns Difference in specified unit
 */
export function getDateDifference(
  date1: string | Date,
  date2: string | Date,
  language: string = 'en',
  unit: 'days' | 'hours' | 'minutes' | 'seconds' = 'days'
): number {
  try {
    const d1 = parseDate(date1, language);
    const d2 = parseDate(date2, language);
    const diff = d2.diff(d1, unit).toObject();
    return Math.floor(diff[unit] || 0);
  } catch (error) {
    console.error('Error calculating date difference:', error);
    return 0;
  }
}

/**
 * React hook to use datetime utilities with current language
 * Automatically uses the language from LanguageContext
 */
export function useDateTime() {
  const { currentLanguage } = useLanguage();

  return {
    formatRelativeTime: (dateString: string | Date, t?: (key: string) => string) =>
      formatRelativeTime(dateString, currentLanguage, t),
    formatDate: (dateString: string | Date, format?: 'short' | 'long' | 'medium' | string) =>
      formatDate(dateString, currentLanguage, format),
    formatTime: (dateString: string | Date, format?: 'short' | 'long') =>
      formatTime(dateString, currentLanguage, format),
    formatDateTime: (
      dateString: string | Date,
      dateFormat?: 'short' | 'long' | 'medium',
      timeFormat?: 'short' | 'long'
    ) => formatDateTime(dateString, currentLanguage, dateFormat, timeFormat),
    getNow: () => getNow(currentLanguage),
    parseDate: (dateString: string | Date) => parseDate(dateString, currentLanguage),
    isToday: (dateString: string | Date) => isToday(dateString, currentLanguage),
    isPast: (dateString: string | Date) => isPast(dateString, currentLanguage),
    isFuture: (dateString: string | Date) => isFuture(dateString, currentLanguage),
    getDateDifference: (
      date1: string | Date,
      date2: string | Date,
      unit?: 'days' | 'hours' | 'minutes' | 'seconds'
    ) => getDateDifference(date1, date2, currentLanguage, unit),
    calendar: getCalendarForLanguage(currentLanguage),
    locale: getLocaleForLanguage(currentLanguage),
  };
}

