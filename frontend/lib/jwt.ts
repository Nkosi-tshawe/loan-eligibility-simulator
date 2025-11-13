/**
 * JWT utility functions for parsing and validating tokens
 */

export interface JwtPayload {
  exp: number;
  userId?: string;
  unique_name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
}

/**
 * Parses a JWT token and returns its payload
 * @param token - The JWT token string
 * @returns The parsed JWT payload or null if parsing fails
 */
export function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token string
 * @returns true if token is expired or invalid, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) {
    return true;
  }
  return payload.exp * 1000 <= Date.now();
}

/**
 * Gets the expiration time of a JWT token in milliseconds
 * @param token - The JWT token string
 * @returns Expiration time in milliseconds, or null if token is invalid
 */
export function getTokenExpiration(token: string): number | null {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) {
    return null;
  }
  return payload.exp * 1000;
}

