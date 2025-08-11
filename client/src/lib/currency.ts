/**
 * Currency utility functions for Ghana Cedis (GHS)
 */

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numPrice);
}

export function formatPriceCompact(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // For prices over 1000, show with K notation
  if (numPrice >= 1000) {
    return `₵${(numPrice / 1000).toFixed(1)}K`;
  }
  
  return `₵${numPrice.toFixed(2)}`;
}

export function getCurrencySymbol(): string {
  return '₵';
}

export function getCurrencyCode(): string {
  return 'GHS';
}