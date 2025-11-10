/**
 * useDateTime Hook - Luxon-powered date/time utilities
 * 
 * A React hook that provides date/time formatting using Luxon's core features.
 * Automatically adapts to the user's language and calendar system.
 * 
 * Features:
 * - Automatic locale and calendar selection (Persian, Gregorian, etc.)
 * - Relative time formatting ("2 hours ago")
 * - Date and time formatting with i18n support
 * - Calendar-aware date operations
 * 
 * @example
 * const { formatRelativeTime, formatDate, formatTime } = useDateTime();
 * 
 * // Relative time
 * formatRelativeTime(post.createdAt) // "2 hours ago" or "۲ ساعت پیش"
 * 
 * // Date formatting
 * formatDate(trip.startDate) // "Jan 15, 2024" or "۱۵ دی ۱۴۰۲"
 * formatDate(trip.startDate, 'long') // "Monday, January 15, 2024"
 * 
 * // Time formatting
 * formatTime(event.time) // "14:30"
 * formatTime(event.time, 'long') // "14:30:00"
 */

import { useCallback, useMemo } from 'react';
import { DateTime } from 'luxon';
import { useLanguage } from '@components/context/LanguageContext';

// Calendar mapping for each language
const CALENDARS: Record<string, string> = {
  fa: 'persian',  // Persian/Jalali calendar
  ar: 'islamic',  // Islamic calendar
  en: 'gregory',  // Gregorian calendar (default)
};

// Locale mapping for proper formatting
const LOCALES: Record<string, string> = {
  fa: 'fa-IR',
  ar: 'ar-SA',
  en: 'en-US',
};

/**
 * Parse date input into Luxon DateTime
 * Exported as standalone function for use outside React components
 * Handles various date formats including ISO, space-separated, and timestamps
 */
export function parseDate(input: string | Date | DateTime): DateTime {
  if (input instanceof DateTime) return input;
  if (input instanceof Date) return DateTime.fromJSDate(input);
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return DateTime.invalid('empty string');
    
    // Handle space-separated datetime format (2025-11-08 19:56:01)
    // This is common from SQL databases and some APIs
    // Match: YYYY-MM-DD HH:MM:SS or YYYY-MM-DD HH:MM:SS.microseconds
    const spaceSeparatedMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})(\.\d+)?(?:\s*(?:Z|[+-]\d{2}:?\d{2}))?$/);
    if (spaceSeparatedMatch) {
      // Convert to ISO format: 2025-11-08 19:56:01 -> 2025-11-08T19:56:01
      const datePart = spaceSeparatedMatch[1];
      const timePart = spaceSeparatedMatch[2];
      const microseconds = spaceSeparatedMatch[3] || '';
      const isoString = `${datePart}T${timePart}${microseconds}`;
      const iso = DateTime.fromISO(isoString);
      if (iso.isValid) return iso;
    }
    
    // Try SQL datetime format using fromSQL (handles YYYY-MM-DD HH:MM:SS)
    // This is Luxon's built-in parser for SQL datetime format
    const sqlDateTime = DateTime.fromSQL(trimmed);
    if (sqlDateTime.isValid) return sqlDateTime;
    
    // Try ISO format directly (2025-11-08T19:56:01 or 2025-11-08T19:56:01Z)
    const iso = DateTime.fromISO(trimmed);
    if (iso.isValid) return iso;
    
    // Try as timestamp (seconds or milliseconds)
    if (/^\d+$/.test(trimmed)) {
      const num = parseInt(trimmed, 10);
      // Check if it's milliseconds (13+ digits) or seconds (10 digits)
      if (num > 9999999999) {
        const fromMs = DateTime.fromMillis(num);
        if (fromMs.isValid) return fromMs;
      } else {
        const fromSec = DateTime.fromSeconds(num);
        if (fromSec.isValid) return fromSec;
      }
    }
    
    // Try RFC2822 format as last resort
    const rfc2822 = DateTime.fromRFC2822(trimmed);
    if (rfc2822.isValid) return rfc2822;
  }
  
  return DateTime.invalid('unparseable');
}

/**
 * Standalone formatRelativeTime for use outside React components
 * @param input - Date to format
 * @param language - Language code ('en', 'fa', etc.)
 * @param options - Optional Luxon toRelative options
 */
export function formatRelativeTime(
  input: string | Date | DateTime,
  language: string = 'en',
  options?: Parameters<DateTime['toRelative']>[0]
): string {
  try {
    if (!input) {
      console.warn('formatRelativeTime (standalone): empty input');
      return '';
    }

    const dt = parseDate(input);
    if (!dt.isValid) {
      console.warn('Invalid date in formatRelativeTime (standalone):', input, dt.invalidReason);
      try {
        return typeof input === 'string' ? input : input.toString();
      } catch {
        return '';
      }
    }
    
    const locale = LOCALES[language] || 'en-US';
    const calendar = CALENDARS[language] || 'gregory';
    const now = DateTime.now().setLocale(locale);
    
    let localized;
    try {
      localized = dt
        .setLocale(locale)
        .reconfigure({ outputCalendar: calendar as any });
    } catch (calendarError) {
      console.warn('Calendar conversion failed in formatRelativeTime (standalone), using Gregorian:', calendarError);
      localized = dt.setLocale(locale);
    }
    
    const relative = localized.toRelative({ 
      base: now,
      ...options 
    });
    
    if (!relative) {
      // Fallback to absolute date with calendar conversion
      try {
        const fallback = localized.toLocaleString({
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          calendar: calendar as any
        });
        return fallback || '';
      } catch {
        // Last resort: use DATE_SHORT without calendar
        const fallback = localized.toLocaleString(DateTime.DATE_SHORT);
        return fallback || '';
      }
    }
    
    return relative;
  } catch (error) {
    console.error('Error formatting relative time:', error, input);
    try {
      return typeof input === 'string' ? input : input.toString();
    } catch {
      return '';
    }
  }
}

/**
 * Standalone formatDate for use outside React components
 * @param input - Date to format
 * @param language - Language code ('en', 'fa', etc.)
 * @param format - Preset or custom Intl options
 */
export function formatDate(
  input: string | Date | DateTime,
  language: string = 'en',
  format: 'short' | 'medium' | 'long' | Intl.DateTimeFormatOptions = 'medium'
): string {
  try {
    if (!input) {
      console.warn('formatDate (standalone): empty input');
      return '';
    }

    const dt = parseDate(input);
    if (!dt.isValid) {
      console.warn('Invalid date in formatDate (standalone):', input, dt.invalidReason);
      if (typeof input === 'string') return input;
      return '';
    }
    
    const locale = LOCALES[language] || 'en-US';
    const calendar = CALENDARS[language] || 'gregory';
    
    let localized;
    try {
      localized = dt.setLocale(locale).reconfigure({ outputCalendar: calendar as any });
    } catch (calendarError) {
      console.warn('Calendar conversion failed (standalone), using Gregorian:', calendarError);
      localized = dt.setLocale(locale);
    }
    
    const presets: Record<string, Intl.DateTimeFormatOptions> = {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      medium: { year: 'numeric', month: 'long', day: 'numeric' },
      long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    };
    
    const opts = typeof format === 'string' ? presets[format] : format;
    const formatted = localized.toLocaleString(opts || presets.medium);
    
    if (!formatted) {
      console.warn('toLocaleString returned empty (standalone):', input);
      return dt.toISODate() || dt.toString();
    }
    
    return formatted;
  } catch (error) {
    console.error('Error formatting date (standalone):', error, input);
    try {
      if (typeof input === 'string') return input;
      if (input instanceof Date) return input.toISOString().split('T')[0];
      return input.toString();
    } catch {
      return '';
    }
  }
}

/**
 * useDateTime Hook
 * 
 * Provides date/time formatting functions that automatically use
 * the current language's locale and calendar system.
 */
export function useDateTime() {
  const { currentLanguage } = useLanguage();
  
  // Get locale and calendar for current language
  const locale = useMemo(() => LOCALES[currentLanguage] || 'en-US', [currentLanguage]);
  const calendar = useMemo(() => CALENDARS[currentLanguage] || 'gregory', [currentLanguage]);

  /**
   * Format date as relative time (e.g., "2 hours ago", "in 3 days")
   * Uses Luxon's toRelative() with automatic locale support
   */
  const formatRelativeTime = useCallback(
    (input: string | Date | DateTime, options?: Parameters<DateTime['toRelative']>[0]): string => {
      try {
        if (!input) {
          console.warn('formatRelativeTime: empty input');
          return '';
        }

        const dt = parseDate(input);
        if (!dt.isValid) {
          console.warn('Invalid date in formatRelativeTime:', input, dt.invalidReason);
          // Try to return a basic date format as fallback
          try {
            const fallback = typeof input === 'string' ? input : input.toString();
            return fallback;
          } catch {
            return '';
          }
        }
        
        // Apply locale and calendar, then get relative time with explicit base time
        const now = DateTime.now().setLocale(locale);
        let localized;
        try {
          localized = dt
            .setLocale(locale)
            .reconfigure({ outputCalendar: calendar as any });
        } catch (calendarError) {
          console.warn('Calendar conversion failed in formatRelativeTime, using Gregorian:', calendarError);
          localized = dt.setLocale(locale);
        }
        
        const relative = localized.toRelative({ 
          base: now,
          ...options 
        });
        
        if (!relative) {
          // Fallback to absolute date with calendar conversion
          try {
            const fallback = localized.toLocaleString({
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              calendar: calendar as any
            });
            return fallback || '';
          } catch {
            // Last resort: use DATE_SHORT without calendar
            const fallback = localized.toLocaleString(DateTime.DATE_SHORT);
            return fallback || '';
          }
        }
        
        return relative;
      } catch (error) {
        console.error('Error formatting relative time:', error, input);
        // Last resort fallback
        try {
          return typeof input === 'string' ? input : input.toString();
        } catch {
          return '';
        }
      }
    },
    [locale, calendar]
  );

  /**
   * Format date to readable format
   * Uses Luxon's toLocaleString() with calendar support
   * 
   * @param input - Date to format
   * @param format - Preset ('short', 'medium', 'long') or custom Intl options
   */
  const formatDate = useCallback(
    (
      input: string | Date | DateTime,
      format: 'short' | 'medium' | 'long' | Intl.DateTimeFormatOptions = 'medium'
    ): string => {
      try {
        if (!input) {
          console.warn('formatDate: empty input');
          return '';
        }

        const dt = parseDate(input);
        if (!dt.isValid) {
          console.warn('Invalid date in formatDate:', input, dt.invalidReason);
          // Try to return input as string if it's a valid date string
          if (typeof input === 'string') {
            return input;
          }
          return '';
        }
        
        // Apply locale and calendar
        let localized;
        try {
          localized = dt
            .setLocale(locale)
            .reconfigure({ outputCalendar: calendar as any });
        } catch (calendarError) {
          console.warn('Calendar conversion failed, using Gregorian:', calendarError);
          // Fallback to Gregorian if calendar conversion fails
          localized = dt.setLocale(locale);
        }
        
        // Format presets
        const presets: Record<string, Intl.DateTimeFormatOptions> = {
          short: { year: 'numeric', month: 'short', day: 'numeric' },
          medium: { year: 'numeric', month: 'long', day: 'numeric' },
          long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
        };
        
        const opts = typeof format === 'string' ? presets[format] : format;
        const formatted = localized.toLocaleString(opts || presets.medium);
        
        if (!formatted) {
          console.warn('toLocaleString returned empty for:', input);
          // Fallback to ISO string
          return dt.toISODate() || dt.toString();
        }
        
        return formatted;
      } catch (error) {
        console.error('Error formatting date:', error, input);
        // Last resort fallback
        try {
          if (typeof input === 'string') return input;
          if (input instanceof Date) return input.toISOString().split('T')[0];
          return input.toString();
        } catch {
          return '';
        }
      }
    },
    [locale, calendar]
  );

  /**
   * Format time only (e.g., "14:30" or "14:30:00")
   * Uses Luxon's toLocaleString() with time options
   */
  const formatTime = useCallback(
    (input: string | Date | DateTime, format: 'short' | 'long' = 'short'): string => {
      try {
        const dt = parseDate(input);
        if (!dt.isValid) return '';
        
        const localized = dt.setLocale(locale);
        const opts: Intl.DateTimeFormatOptions =
          format === 'short'
            ? { hour: '2-digit', minute: '2-digit' }
            : { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        
        return localized.toLocaleString(opts);
      } catch (error) {
        console.error('Error formatting time:', error);
        return '';
      }
    },
    [locale]
  );

  /**
   * Format date and time together
   */
  const formatDateTime = useCallback(
    (
      input: string | Date | DateTime,
      dateFormat: 'short' | 'medium' | 'long' | Intl.DateTimeFormatOptions = 'medium',
      timeFormat: 'short' | 'long' = 'short'
    ): string => {
      try {
        const date = formatDate(input, dateFormat);
        const time = formatTime(input, timeFormat);
        return `${date} ${time}`;
      } catch (error) {
        console.error('Error formatting date time:', error);
        return '';
      }
    },
    [formatDate, formatTime]
  );

  /**
   * Check if date is today
   */
  const isToday = useCallback((input: string | Date | DateTime): boolean => {
    try {
      const dt = parseDate(input);
      return dt.isValid && dt.hasSame(DateTime.now(), 'day');
    } catch {
      return false;
    }
  }, []);

  /**
   * Check if date is in the past
   */
  const isPast = useCallback((input: string | Date | DateTime): boolean => {
    try {
      const dt = parseDate(input);
      return dt.isValid && dt < DateTime.now();
    } catch {
      return false;
    }
  }, []);

  /**
   * Check if date is in the future
   */
  const isFuture = useCallback((input: string | Date | DateTime): boolean => {
    try {
      const dt = parseDate(input);
      return dt.isValid && dt > DateTime.now();
    } catch {
      return false;
    }
  }, []);

  /**
   * Get difference between two dates
   */
  const getDateDifference = useCallback(
    (
      date1: string | Date | DateTime,
      date2: string | Date | DateTime,
      unit: 'days' | 'hours' | 'minutes' | 'seconds' = 'days'
    ): number => {
      try {
        const dt1 = parseDate(date1);
        const dt2 = parseDate(date2);
        if (!dt1.isValid || !dt2.isValid) return 0;
        
        const diff = dt2.diff(dt1, unit).toObject();
        return Math.floor(diff[unit] || 0);
      } catch {
        return 0;
      }
    },
    []
  );

  /**
   * Get current DateTime
   */
  const getNow = useCallback((): DateTime => {
    return DateTime.now();
  }, []);

  /**
   * Parse date string to DateTime
   */
  const parse = useCallback((input: string | Date): DateTime => {
    return parseDate(input);
  }, []);

  return {
    // Formatting functions
    formatRelativeTime,
    formatDate,
    formatTime,
    formatDateTime,
    
    // Date checks
    isToday,
    isPast,
    isFuture,
    getDateDifference,
    
    // Utilities
    getNow,
    parse,
    parseDate: parse, // alias for convenience
    
    // Current locale/calendar info
    locale,
    calendar,
  };
}

