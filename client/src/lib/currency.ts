/**
 * Currency utility functions for Ghana Cedis (GHS)
 */

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return '₵0.00';
  }
  
  // Simple formatting for Ghana Cedis
  return `₵${numPrice.toFixed(2)}`;
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