/**
 * Safely extracts a displayable error message from an unknown error value.
 * Guards against non-Error values to prevent secondary crashes in error UIs.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return 'An unexpected error occurred';
}

/**
 * Safely logs an error with context
 */
export function logError(context: string, error: unknown): void {
  console.error(`[${context}]`, error);
}
