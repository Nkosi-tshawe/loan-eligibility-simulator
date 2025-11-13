/**
 * Environment variable validation and access
 */

/**
 * Validates and returns the API URL from environment variables
 * @throws Error if NEXT_PUBLIC_API_URL is not set
 */
export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    throw new Error(
      'NEXT_PUBLIC_API_URL environment variable is not set. ' +
      'Please configure it in your .env.local file.'
    );
  }
  
  return apiUrl;
}

