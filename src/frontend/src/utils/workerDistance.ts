/**
 * Haversine distance calculation utility for worker location display
 * Computes distance between two geographic coordinates in kilometers
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 First coordinate (user location)
 * @param coord2 Second coordinate (worker location)
 * @returns Distance in kilometers
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display with appropriate precision
 * @param distanceKm Distance in kilometers
 * @returns Formatted distance string (e.g., "2.5 km" or "850 m")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    // Show in meters for distances less than 1 km
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  } else if (distanceKm < 10) {
    // Show one decimal place for distances less than 10 km
    return `${distanceKm.toFixed(1)} km`;
  } else {
    // Show whole numbers for longer distances
    return `${Math.round(distanceKm)} km`;
  }
}
