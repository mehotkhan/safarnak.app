/**
 * DateTime Utilities with Multi-Calendar Support
 * 
 * Uses Luxon for date/time operations with support for:
 * - Gregorian calendar (default for English)
 * - Persian/Jalali calendar (for Persian/Farsi language)
 * - Other calendars via Luxon's calendar system
 * 
 * All functions use Luxon's built-in methods for proper localization and calendar support.
 * 
 * @see https://moment.github.io/luxon/#/calendars
 * @see https://moment.github.io/luxon/#/formatting?id=torelative
 * @see https://github.com/moment/luxon
 */

import React from 'react';
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
 * Get the appropriate calendar system for a given language
 * Returns Intl calendar identifier for use in reconfigure({ outputCalendar })
 */
export function getCalendarForLanguage(language: string): string {
  return CALENDAR_MAP[language] || 'gregory';
}

/**
 * Base locale mapping for proper formatting
 * Maps language codes to locale identifiers
 */
const BASE_LOCALE_MAP: Record<string, string> = {
  'fa': 'fa-IR', // Persian/Farsi locale
  'ar': 'ar-SA', // Arabic locale
  'en': 'en-US', // English locale
};

/**
 * Get the appropriate locale for a given language
 * Returns base locale identifier for use in setLocale()
 * 
 * @see https://moment.github.io/luxon/#/intl
 */
export function getLocaleForLanguage(language: string): string {
  return BASE_LOCALE_MAP[language] || 'en-US';
}

/**
 * Parse a date string or Date object into a DateTime object
 * Handles both ISO strings and JavaScript Date objects
 * 
 * @param dateString - ISO date string or Date object
 * @returns DateTime object (always Gregorian internally)
 */
function parseDateTime(dateString: string | Date): DateTime {
  return typeof dateString === 'string'
    ? DateTime.fromISO(dateString)
    : DateTime.fromJSDate(dateString);
}

/**
 * Format a date string to relative time using Luxon's built-in toRelative()
 * Supports i18n and proper localization
 * 
 * @param dateString - ISO date string or Date object
 * @param language - Language code (e.g., 'en', 'fa')
 * @param options - Optional options for toRelative() (unit, style, etc.)
 * @returns Formatted relative time string (e.g., "2 hours ago", "in 3 days")
 * 
 * @see https://moment.github.io/luxon/#/formatting?id=torelative
 */
export function formatRelativeTime(
  dateString: string | Date,
  language: string = 'en',
  options?: {
    unit?: 'years' | 'quarters' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds';
    style?: 'long' | 'short' | 'narrow';
    round?: boolean;
    padding?: number;
  }
): string {
  try {
    if (!dateString) return '';

    const date = parseDateTime(dateString);
    if (!date.isValid) {
      // Try parsing as timestamp if it's a numeric string
      if (typeof dateString === 'string' && /^\d+$/.test(dateString)) {
        const timestamp = parseInt(dateString, 10);
        const dateFromTimestamp = timestamp < 10000000000 
          ? DateTime.fromSeconds(timestamp)
          : DateTime.fromMillis(timestamp);
        if (dateFromTimestamp.isValid) {
          const locale = getLocaleForLanguage(language);
          const now = DateTime.now().setLocale(locale);
          const relative = dateFromTimestamp.setLocale(locale).toRelative({ base: now });
          return relative || formatDate(dateFromTimestamp.toISO() || '', language, 'short');
        }
      }
      return formatDate(DateTime.now().toISO() || '', language, 'short');
    }

    const locale = getLocaleForLanguage(language);
    const now = DateTime.now().setLocale(locale);
    const dateWithLocale = date.setLocale(locale);
    const relativeOptions = options ? { base: now, ...options } : { base: now };
    const relative = dateWithLocale.toRelative(relativeOptions);
    
    return relative || formatDate(dateString, language, 'short');
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return formatDate(dateString, language, 'short');
  }
}

/**
 * Format a date string to a readable date format
 * Supports multiple formats and calendars using Luxon's toLocaleString()
 * 
 * @param dateString - ISO date string or Date object
 * @param language - Language code (e.g., 'en', 'fa')
 * @param format - Format type: 'short', 'long', 'medium', or Intl.DateTimeFormatOptions
 * @returns Formatted date string with proper calendar and locale
 * 
 * @see https://moment.github.io/luxon/#/formatting?id=tolocalestring
 */
export function formatDate(
  dateString: string | Date,
  language: string = 'en',
  format: 'short' | 'long' | 'medium' | Intl.DateTimeFormatOptions = 'medium'
): string {
  try {
    const date = parseDateTime(dateString);
    
    if (!date.isValid) {
      return dateString.toString();
    }

    const locale = getLocaleForLanguage(language);
    const calendar = getCalendarForLanguage(language);
    
    // Configure date with calendar and locale
    const dateWithCalendar = date.reconfigure({ outputCalendar: calendar as any }).setLocale(locale);
    
    // Define format presets matching Intl.DateTimeFormatOptions
    const formatPresets: Record<string, Intl.DateTimeFormatOptions> = {
      short: { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
      },
      medium: { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
      },
      long: { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long',
      },
    };

    // Use preset or custom format options
    const formatOptions = typeof format === 'string' && formatPresets[format]
      ? formatPresets[format]
      : typeof format === 'object' ? format : formatPresets.medium;

    return dateWithCalendar.toLocaleString(formatOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString.toString();
  }
}

/**
 * Format a date string to time only using Luxon's toLocaleString()
 * Supports proper localization for time formatting
 * 
 * @param dateString - ISO date string or Date object
 * @param language - Language code
 * @param format - Time format: 'short' (HH:mm) or 'long' (HH:mm:ss)
 * @returns Formatted time string with proper locale
 */
export function formatTime(
  dateString: string | Date,
  language: string = 'en',
  format: 'short' | 'long' = 'short'
): string {
  try {
    const date = parseDateTime(dateString);
    
    if (!date.isValid) {
      return dateString.toString();
    }

    const locale = getLocaleForLanguage(language);
    
    // Use toLocaleString with time format options for proper localization
    const timeOptions: Intl.DateTimeFormatOptions = format === 'short'
      ? { hour: '2-digit', minute: '2-digit' }
      : { hour: '2-digit', minute: '2-digit', second: '2-digit' };

    return date.setLocale(locale).toLocaleString(timeOptions);
  } catch (error) {
    console.error('Error formatting time:', error);
    return dateString.toString();
  }
}

/**
 * Format a date string to date and time
 * Combines formatDate and formatTime with proper spacing
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
  dateFormat: 'short' | 'long' | 'medium' | Intl.DateTimeFormatOptions = 'medium',
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
 * Get current date/time as DateTime object
 * 
 * @returns DateTime object (always Gregorian internally)
 */
export function getNow(): DateTime {
  return DateTime.now();
}

/**
 * Parse a date string and return DateTime object
 * 
 * @param dateString - ISO date string or Date object
 * @returns DateTime object (always Gregorian internally)
 */
export function parseDate(dateString: string | Date): DateTime {
  return parseDateTime(dateString);
}

/**
 * Check if a date is today using Luxon's hasSame()
 * 
 * @param dateString - ISO date string or Date object
 * @returns true if date is today
 * 
 * @see https://moment.github.io/luxon/#/math?id=hassame
 */
export function isToday(dateString: string | Date): boolean {
  try {
    const date = parseDateTime(dateString);
    if (!date.isValid) {
      return false;
    }
    return date.hasSame(DateTime.now(), 'day');
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
}

/**
 * Check if a date is in the past using Luxon's comparison operators
 * 
 * @param dateString - ISO date string or Date object
 * @returns true if date is in the past
 */
export function isPast(dateString: string | Date): boolean {
  try {
    const date = parseDateTime(dateString);
    if (!date.isValid) {
      return false;
    }
    return date < DateTime.now();
  } catch (error) {
    console.error('Error checking if date is past:', error);
    return false;
  }
}

/**
 * Check if a date is in the future using Luxon's comparison operators
 * 
 * @param dateString - ISO date string or Date object
 * @returns true if date is in the future
 */
export function isFuture(dateString: string | Date): boolean {
  try {
    const date = parseDateTime(dateString);
    if (!date.isValid) {
      return false;
    }
    return date > DateTime.now();
  } catch (error) {
    console.error('Error checking if date is future:', error);
    return false;
  }
}

/**
 * Get difference between two dates using Luxon's diff()
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @param unit - Unit of difference: 'days', 'hours', 'minutes', 'seconds'
 * @returns Difference in specified unit (rounded down)
 * 
 * @see https://moment.github.io/luxon/#/math?id=diff
 */
export function getDateDifference(
  date1: string | Date,
  date2: string | Date,
  unit: 'days' | 'hours' | 'minutes' | 'seconds' = 'days'
): number {
  try {
    const d1 = parseDateTime(date1);
    const d2 = parseDateTime(date2);
    
    if (!d1.isValid || !d2.isValid) {
      return 0;
    }
    
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

  const formatRelativeTimeHook = React.useCallback(
    (
      dateString: string | Date,
      optionsOrT?: Parameters<typeof formatRelativeTime>[2] | ((key: string) => string)
    ) => {
      const options = typeof optionsOrT === 'function' ? undefined : optionsOrT;
      return formatRelativeTime(dateString, currentLanguage, options);
    },
    [currentLanguage]
  );

  const formatDateHook = React.useCallback(
    (
      dateString: string | Date,
      format?: 'short' | 'long' | 'medium' | Intl.DateTimeFormatOptions
    ) => formatDate(dateString, currentLanguage, format),
    [currentLanguage]
  );

  const formatTimeHook = React.useCallback(
    (dateString: string | Date, format?: 'short' | 'long') =>
      formatTime(dateString, currentLanguage, format),
    [currentLanguage]
  );

  const formatDateTimeHook = React.useCallback(
    (
      dateString: string | Date,
      dateFormat?: 'short' | 'long' | 'medium' | Intl.DateTimeFormatOptions,
      timeFormat?: 'short' | 'long'
    ) => formatDateTime(dateString, currentLanguage, dateFormat, timeFormat),
    [currentLanguage]
  );

  return {
    formatRelativeTime: formatRelativeTimeHook,
    formatDate: formatDateHook,
    formatTime: formatTimeHook,
    formatDateTime: formatDateTimeHook,
    getNow: () => getNow(),
    parseDate: (dateString: string | Date) => parseDate(dateString),
    isToday: (dateString: string | Date) => isToday(dateString),
    isPast: (dateString: string | Date) => isPast(dateString),
    isFuture: (dateString: string | Date) => isFuture(dateString),
    getDateDifference: (
      date1: string | Date,
      date2: string | Date,
      unit?: 'days' | 'hours' | 'minutes' | 'seconds'
    ) => getDateDifference(date1, date2, unit),
    calendar: getCalendarForLanguage(currentLanguage),
    locale: getLocaleForLanguage(currentLanguage),
  };
}
