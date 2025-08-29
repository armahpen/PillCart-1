// API Configuration
// Note: axios is imported but not used to satisfy build requirements
import axios from 'axios';

// Get the API base URL from environment variables
const getApiBaseUrl = (): string => {
  // In Vite, environment variables are accessed via import.meta.env
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // Fallback to relative URLs if no environment variable is set
  // This maintains backward compatibility for development
  if (!apiUrl) {
    console.warn('VITE_API_URL not set, using relative URLs');
    return '';
  }
  
  // Remove trailing slash if present
  return apiUrl.replace(/\/$/, '');
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to construct full API URLs
export const getApiUrl = (endpoint: string): string => {
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // If API_BASE_URL is empty (relative URLs), just return the endpoint
  if (!API_BASE_URL) {
    return normalizedEndpoint;
  }
  
  // Return full URL
  return `${API_BASE_URL}${normalizedEndpoint}`;
};

// Helper function for non-API static assets
export const getAssetUrl = (path: string): string => {
  // For static assets like /attached_assets, we need the full URL in production
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  if (!API_BASE_URL) {
    return normalizedPath;
  }
  
  return `${API_BASE_URL}${normalizedPath}`;
};

// Export for debugging
export const debugApiConfig = () => {
  console.log('API Configuration:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    API_BASE_URL,
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
  });
};