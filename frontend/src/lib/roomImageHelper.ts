import { BACKEND_URL } from './api';

import roomPhoto1 from '../assets/hotel/rooms/ChatGPT Image May 16, 2026, 07_23_42 PM (8).png';
import roomPhoto2 from '../assets/hotel/rooms/ChatGPT Image May 16, 2026, 07_23_38 PM (3).png';
import roomPhoto3 from '../assets/hotel/rooms/ChatGPT Image May 16, 2026, 07_23_42 PM (6).png';
import roomPhoto4 from '../assets/hotel/rooms/ChatGPT Image May 16, 2026, 07_23_43 PM (9).png';
import roomPhoto5 from '../assets/hotel/rooms/ChatGPT Image May 16, 2026, 07_25_12 PM.png';
import roomPhoto6 from '../assets/hotel/rooms/ChatGPT Image May 16, 2026, 07_32_13 PM (2).png';

export const LUXURY_FALLBACK_IMAGES = [
  roomPhoto1,
  roomPhoto2,
  roomPhoto3,
  roomPhoto4,
  roomPhoto5,
  roomPhoto6,
];

/**
 * Returns a stable high-res fallback image based on a key (name or ID).
 */
export const getRoomFallbackImage = (key?: string | number): string => {
  if (!key) return LUXURY_FALLBACK_IMAGES[0];
  const str = String(key);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % LUXURY_FALLBACK_IMAGES.length;
  return LUXURY_FALLBACK_IMAGES[index];
};

/**
 * Resolves a room image URL:
 * - Fixes duplicate /backend/backend/
 * - Prefixes relative paths (/uploads/...) with BACKEND_URL
 * - Falls back to a luxury fallback photo if empty
 */
export const resolveRoomImageUrl = (url?: string | null, fallbackKey?: string | number): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return getRoomFallbackImage(fallbackKey);
  }

  let clean = url.trim();

  // Fix accidental duplicate backend paths
  if (clean.includes('/backend/backend/')) {
    clean = clean.replace('/backend/backend/', '/backend/');
  }

  // If already absolute URL
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  // Prepend BACKEND_URL for relative paths
  const base = (BACKEND_URL || '').replace(/\/+$/, '');
  const path = clean.startsWith('/') ? clean : `/${clean}`;
  return `${base}${path}`;
};

/**
 * Image onError handler to replace broken images with a high-res luxury fallback.
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackKey?: string | number
) => {
  const target = e.currentTarget;
  const fallback = getRoomFallbackImage(fallbackKey);
  if (target.src !== fallback) {
    target.src = fallback;
  }
};

/**
 * Cleanly extracts numeric nightly rate from API responses (handles '₹1,999', '1999.00', numbers, etc.)
 */
export const extractRoomPrice = (cat: any): number => {
  if (!cat) return 0;
  if (cat.price_24h !== undefined && cat.price_24h !== null && cat.price_24h !== '') {
    const num = Number(cat.price_24h);
    if (!isNaN(num) && num > 0) return num;
  }
  if (cat.base_price_24h !== undefined && cat.base_price_24h !== null && cat.base_price_24h !== '') {
    const num = Number(cat.base_price_24h);
    if (!isNaN(num) && num > 0) return num;
  }
  if (cat.base_price !== undefined && cat.base_price !== null && cat.base_price !== '') {
    const num = Number(cat.base_price);
    if (!isNaN(num) && num > 0) return num;
  }
  if (cat.price !== undefined && cat.price !== null) {
    if (typeof cat.price === 'number' && !isNaN(cat.price)) return cat.price;
    if (typeof cat.price === 'string') {
      const sanitized = cat.price.replace(/[^0-9.]/g, '');
      const num = Number(sanitized);
      if (!isNaN(num) && num > 0) return num;
    }
  }
  return 0;
};
