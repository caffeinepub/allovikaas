/**
 * Taxonomy normalization utilities to deduplicate and standardize category/subcategory values
 */

/**
 * Normalizes a string for comparison (lowercase, trim, collapse whitespace)
 */
export function normalizeKey(value: string | undefined | null): string {
  if (!value || typeof value !== 'string') return '';
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Deduplicates an array of strings using case-insensitive comparison
 * Returns the first occurrence's original casing
 */
export function deduplicateStrings(items: string[]): string[] {
  const seen = new Map<string, string>();
  
  items.forEach(item => {
    if (item && typeof item === 'string') {
      const normalized = normalizeKey(item);
      if (normalized && !seen.has(normalized)) {
        seen.set(normalized, item.trim());
      }
    }
  });
  
  return Array.from(seen.values());
}

/**
 * Finds a canonical value from a list using normalized comparison
 */
export function findCanonicalValue(searchValue: string | undefined | null, availableValues: string[]): string | null {
  if (!searchValue) return null;
  
  const normalizedSearch = normalizeKey(searchValue);
  if (!normalizedSearch) return null;
  
  for (const value of availableValues) {
    if (normalizeKey(value) === normalizedSearch) {
      return value;
    }
  }
  
  return null;
}

/**
 * Normalizes a category mapping by deduplicating subcategories
 */
export function normalizeCategoryMapping(category: string, subcategories: string[]): { category: string; subcategories: string[] } {
  return {
    category: category.trim(),
    subcategories: deduplicateStrings(subcategories),
  };
}
