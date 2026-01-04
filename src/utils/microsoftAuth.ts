import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarEvent } from '../types';

WebBrowser.maybeCompleteAuthSession();

// Microsoft Entra ID configuration
const CLIENT_ID = 'e5563238-3884-4ceb-b3f5-f0fca3cd801f';
const TENANT_ID = 'common'; // Use 'common' for multi-tenant, or specific tenant ID

const discovery = {
  authorizationEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
  revocationEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/logout`,
};

const SCOPES = ['openid', 'profile', 'email', 'Calendars.Read', 'User.Read'];

const TOKEN_STORAGE_KEY = '@microsoft_tokens';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface StoredTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export const getRedirectUri = () => {
  return AuthSession.makeRedirectUri({
    scheme: 'com.microworkout.app',
    path: 'oauth',
  });
};

export const useOutlookAuth = () => {
  const redirectUri = getRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    discovery
  );

  return { request, response, promptAsync };
};

export const exchangeCodeForTokens = async (
  code: string,
  codeVerifier: string
): Promise<StoredTokens | null> => {
  try {
    const redirectUri = getRedirectUri();

    const tokenResponse = await fetch(discovery.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier,
        scope: SCOPES.join(' '),
      }).toString(),
    });

    const data: TokenResponse = await tokenResponse.json();

    if (data.access_token) {
      const tokens: StoredTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000,
      };

      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
      return tokens;
    }

    return null;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return null;
  }
};

export const getStoredTokens = async (): Promise<StoredTokens | null> => {
  try {
    const stored = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch {
    return null;
  }
};

export const refreshAccessToken = async (refreshToken: string): Promise<StoredTokens | null> => {
  try {
    const tokenResponse = await fetch(discovery.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        scope: SCOPES.join(' '),
      }).toString(),
    });

    const data: TokenResponse = await tokenResponse.json();

    if (data.access_token) {
      const tokens: StoredTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken,
        expiresAt: Date.now() + data.expires_in * 1000,
      };

      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
      return tokens;
    }

    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export const getValidAccessToken = async (): Promise<string | null> => {
  const tokens = await getStoredTokens();

  if (!tokens) {
    return null;
  }

  // Check if token is expired (with 5 minute buffer)
  if (tokens.expiresAt < Date.now() + 5 * 60 * 1000) {
    if (tokens.refreshToken) {
      const newTokens = await refreshAccessToken(tokens.refreshToken);
      return newTokens?.accessToken || null;
    }
    return null;
  }

  return tokens.accessToken;
};

export const clearTokens = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const fetchCalendarEvents = async (
  date: Date = new Date()
): Promise<CalendarEvent[]> => {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  // Get events for the specified day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const startDateTime = startOfDay.toISOString();
  const endDateTime = endOfDay.toISOString();

  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/calendarview?startDateTime=${startDateTime}&endDateTime=${endDateTime}&$select=id,subject,start,end&$orderby=start/dateTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }

    const data = await response.json();

    return data.value.map((event: any) => ({
      id: event.id,
      title: event.subject || 'Busy',
      start: new Date(event.start.dateTime + 'Z'),
      end: new Date(event.end.dateTime + 'Z'),
    }));
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getValidAccessToken();
  return token !== null;
};
