/**
 * Utility functions for generating worker contact links (WhatsApp, phone)
 * with prefilled messages and sanitized phone numbers.
 */

export interface ContactContext {
  category?: string;
  subcategory?: string;
  area?: string;
  workType?: string;
}

/**
 * Sanitize phone number to digits only
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Resolve the best available work type from context
 * Priority: explicit workType > subcategory > category
 */
export function resolveWorkType(context: ContactContext): string {
  if (context.workType && context.workType.trim()) {
    return context.workType.trim();
  }
  if (context.subcategory && context.subcategory.trim()) {
    return context.subcategory.trim();
  }
  if (context.category && context.category.trim()) {
    return context.category.trim();
  }
  return 'work';
}

/**
 * Resolve the best available area from context
 */
export function resolveArea(context: ContactContext): string {
  if (context.area && context.area.trim()) {
    return context.area.trim();
  }
  return 'your area';
}

/**
 * Build WhatsApp message with prefilled text
 */
export function buildWhatsAppMessage(context: ContactContext): string {
  const workType = resolveWorkType(context);
  const area = resolveArea(context);
  
  return `Hello, I found you on AREA WORKARS. I need work for ${workType} in ${area}. Please contact me.`;
}

/**
 * Build WhatsApp wa.me URL with prefilled message
 */
export function buildWhatsAppURL(phone: string, context: ContactContext): string {
  const cleanPhone = sanitizePhoneNumber(phone);
  const message = buildWhatsAppMessage(context);
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Build phone call URL
 */
export function buildPhoneURL(phone: string): string {
  return `tel:${phone}`;
}

/**
 * Build job request prefill params for navigation
 */
export function buildJobRequestPrefill(context: ContactContext): {
  workType: string;
  area: string;
} {
  return {
    workType: resolveWorkType(context),
    area: resolveArea(context),
  };
}
