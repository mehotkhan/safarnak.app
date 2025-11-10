import { z } from 'zod';
import { parseDate } from './datetime';

/**
 * Common validation schemas and utilities
 * 
 * Reusable Zod schemas for form validation across the app
 */

/**
 * Email validation schema
 */
export const emailSchema = z.string().email({ message: 'emailInvalid' });

/**
 * Username validation schema
 * - Minimum 2 characters
 * - Alphanumeric, dots, underscores, hyphens allowed
 */
export const usernameSchema = z
  .string()
  .min(2, { message: 'usernameMin' })
  .regex(/^[a-zA-Z0-9._-]+$/, { message: 'usernameInvalid' });

/**
 * Password validation schema
 * - Minimum 8 characters
 * - At least one letter and one number
 */
export const passwordSchema = z
  .string()
  .min(8, { message: 'passwordMin' })
  .regex(/^(?=.*[A-Za-z])(?=.*\d)/, { message: 'passwordInvalid' });

/**
 * Date string validation (YYYY-MM-DD format)
 */
export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'dateFormatInvalid' });

/**
 * Optional date string validation
 * Accepts empty string or valid date format
 */
export const optionalDateStringSchema = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
  dateStringSchema.optional()
);

/**
 * Positive integer validation
 */
export const positiveIntegerSchema = z
  .string()
  .refine(
    (v) => {
      const n = parseInt(v, 10);
      return Number.isFinite(n) && n >= 1;
    },
    { message: 'positiveIntegerInvalid' }
  );

/**
 * Date range validation
 * Validates that endDate is after or equal to startDate
 */
export function createDateRangeSchema() {
  return z
    .object({
      startDate: optionalDateStringSchema,
      endDate: optionalDateStringSchema,
    })
    .refine(
      (values) => {
        // Only validate if both dates are provided
        if (values.startDate && values.endDate) {
          const start = parseDate(values.startDate);
          const end = parseDate(values.endDate);
          if (!start.isValid || !end.isValid) return false;
          return end >= start;
        }
        return true;
      },
      { message: 'datesInvalid', path: ['endDate'] }
    );
}

/**
 * Optional string that becomes undefined if empty
 */
export const optionalStringSchema = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
  z.string().optional()
);

/**
 * Accommodation type enum
 */
export const accommodationTypeSchema = z.enum(['hotel', 'hostel', 'apartment', 'camping']);

/**
 * Trip form validation schema
 * Combines common validations for trip creation/editing
 */
export const tripFormSchema = z
  .object({
    destination: optionalStringSchema,
    startDate: optionalDateStringSchema,
    endDate: optionalDateStringSchema,
    description: z.string().min(10, { message: 'descriptionMin' }),
    preferences: optionalStringSchema,
    travelers: z.preprocess(
      (v) => (typeof v === 'string' && v.trim() === '' ? '1' : v),
      positiveIntegerSchema
    ),
    accommodation: accommodationTypeSchema,
  })
  .refine(
    (values) => {
      // Only validate dates if both are provided
      if (values.startDate && values.endDate) {
        const start = parseDate(values.startDate);
        const end = parseDate(values.endDate);
        if (!start.isValid || !end.isValid) return false;
        return end >= start;
      }
      return true;
    },
    { message: 'datesInvalid' }
  );

/**
 * Map validation error code to translation key
 * 
 * @param errorCode - Error code from Zod validation
 * @param t - Translation function
 * @returns Translated error message
 */
export function mapValidationError(
  errorCode: string,
  t: (key: string) => string
): string {
  const errorMap: Record<string, string> = {
    emailInvalid: t('validation.emailInvalid') || 'Invalid email address',
    usernameMin: t('validation.usernameMin') || 'Username must be at least 2 characters',
    usernameInvalid: t('validation.usernameInvalid') || 'Username contains invalid characters',
    passwordMin: t('validation.passwordMin') || 'Password must be at least 8 characters',
    passwordInvalid: t('validation.passwordInvalid') || 'Password must contain letters and numbers',
    dateFormatInvalid: t('validation.dateFormatInvalid') || 'Invalid date format',
    datesInvalid: t('validation.datesInvalid') || 'End date must be after start date',
    descriptionMin: t('validation.descriptionMin') || 'Description must be at least 10 characters',
    positiveIntegerInvalid: t('validation.positiveIntegerInvalid') || 'Must be a positive number',
    travelersInvalid: t('validation.travelersInvalid') || 'Number of travelers must be at least 1',
  };

  return errorMap[errorCode] || errorCode;
}

/**
 * Extract first validation error from Zod error
 * 
 * @param error - Zod error object
 * @param t - Translation function
 * @returns First error message or generic error
 */
export function getValidationError(
  error: any,
  t: (key: string) => string
): string {
  if (error?.issues?.length) {
    const firstIssue = error.issues[0];
    return mapValidationError(firstIssue.message, t);
  }
  return t('validation.generic') || 'Validation error';
}

