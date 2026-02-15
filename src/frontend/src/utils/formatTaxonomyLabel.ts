/**
 * Centralized taxonomy label formatter
 * Converts raw taxonomy values (slug/camelCase/underscore/hyphen) into human-readable Title Case
 * for display-only usage. Never changes stored values or navigation params.
 * 
 * This module intelligently routes to the appropriate formatter:
 * - Categories → getCategoryLabel() from categoryLabels.ts (strict mapping)
 * - Subcategories/Skills → displayName() from displayName.ts (heuristic formatting)
 */

import { displayName } from './displayName';
import { getCategoryLabel, CATEGORY_LABELS } from './categoryLabels';

/**
 * Normalize input for category detection
 */
function normalizeForCategoryCheck(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .replace(/[_\-&\/]/g, '');
}

/**
 * Check if a value is a known category
 */
function isKnownCategory(value: string): boolean {
  const normalized = normalizeForCategoryCheck(value);
  
  // Check all keys in CATEGORY_LABELS with normalization
  for (const key of Object.keys(CATEGORY_LABELS)) {
    if (normalizeForCategoryCheck(key) === normalized) {
      return true;
    }
  }
  
  return false;
}

/**
 * Format a taxonomy value into human-readable Title Case
 * 
 * Intelligently routes to the appropriate formatter based on whether
 * the value is a known category or not.
 * 
 * @param value - Raw taxonomy value (slug/camelCase/underscore/hyphen)
 * @returns Human-readable Title Case string
 * 
 * @example
 * formatTaxonomyLabel('construction') // 'Construction' (via getCategoryLabel)
 * formatTaxonomyLabel('homeimprovement') // 'Home Improvement' (via getCategoryLabel)
 * formatTaxonomyLabel('blousestitching') // 'Blouse Stitching' (via displayName)
 * formatTaxonomyLabel('unknownslug') // 'Unknown Slug' (via fallback)
 */
export function formatTaxonomyLabel(value: string): string {
  if (!value || typeof value !== 'string') {
    return '';
  }
  
  // Check if this is a known category
  if (isKnownCategory(value)) {
    return getCategoryLabel(value);
  }
  
  // Otherwise, use the general displayName formatter for subcategories/skills
  return displayName(value);
}
