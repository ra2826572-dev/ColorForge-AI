import { User } from '../types/colorforge';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  user?: User;
  error?: string;
  [key: string]: any;
}

// Local storage keys for resilient offline/static fallback
const LOCAL_USERS_KEY = 'cf_registered_users';

interface LocalUserRecord {
  user: User;
  passwordHash: string;
}

function getLocalUsers(): LocalUserRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUser(record: LocalUserRecord) {
  try {
    const users = getLocalUsers().filter(u => u.user.email.toLowerCase() !== record.user.email.toLowerCase());
    users.push(record);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save user locally', e);
  }
}

/**
 * Robust fetch wrapper that guarantees valid JSON responses.
 * Never throws "Unexpected token 'T', 'The page c'... is not valid JSON".
 */
export async function safeApiFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const res = await fetch(url, {
      ...options,
      headers,
    });

    const text = await res.text();
    let json: any = null;

    // Check if body is valid JSON
    if (text && (text.trim().startsWith('{') || text.trim().startsWith('['))) {
      try {
        json = JSON.parse(text);
      } catch (parseError) {
        console.warn('Failed to parse JSON response despite starting with { or [', text);
      }
    }

    // If server returned valid JSON
    if (json) {
      if (!res.ok || json.success === false) {
        return {
          success: false,
          error: json.error || `Server request failed with status ${res.status}`,
          ...json,
        };
      }
      return {
        success: true,
        ...json,
      };
    }

    // Server returned HTML (e.g. 404 "The page could not be found..." from Vercel/proxy) or plain text
    console.warn(`Server at ${url} returned non-JSON response (status: ${res.status}):`, text.slice(0, 100));

    return {
      success: false,
      error: res.status === 404
        ? 'Backend endpoint not found on this deployment.'
        : `Server returned an unexpected response format (${res.status}).`,
      isNonJson: true,
      statusCode: res.status,
    };
  } catch (networkErr: any) {
    console.error(`Network error calling ${url}:`, networkErr);
    return {
      success: false,
      error: networkErr.message || 'Network request failed. Please check your connection.',
      isNetworkError: true,
    };
  }
}

/**
 * Universal Register with server-first and resilient client-fallback
 */
export async function registerAccount(
  name: string,
  email: string,
  password: string
): Promise<ApiResponse<{ user: User }>> {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  // Validate inputs
  if (!cleanName) {
    return { success: false, error: 'Please enter your full name.' };
  }
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  // 1. Attempt server register
  const serverRes = await safeApiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: cleanName, email: cleanEmail, password }),
  });

  if (serverRes.success && serverRes.user) {
    // Also mirror to local cache for session persistence
    saveLocalUser({ user: serverRes.user, passwordHash: password });
    return {
      success: true,
      user: serverRes.user,
    };
  }

  // If server returned an explicit error (like duplicate email), return that error immediately
  if (!serverRes.isNonJson && !serverRes.isNetworkError && serverRes.error) {
    return {
      success: false,
      error: serverRes.error,
    };
  }

  // 2. If server was unreachable or returned HTML 404 (static hosting / Vercel without express server),
  // use robust local store so user can seamlessly sign up and use the app!
  console.info('Server unavailable or non-JSON returned. Proceeding with client authentication store.');
  const existingUsers = getLocalUsers();
  const isDuplicate = existingUsers.some(u => u.user.email.toLowerCase() === cleanEmail);
  if (isDuplicate) {
    return {
      success: false,
      error: 'An account with this email already exists.',
    };
  }

  const localUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: cleanName,
    email: cleanEmail,
    avatar: '/src/assets/images/avatar_founder_user_1791282046459.jpg',
    plan: 'free',
    generationsUsed: 0,
    maxFreeGenerations: 5,
    createdAt: new Date().toISOString(),
  };

  saveLocalUser({ user: localUser, passwordHash: password });

  return {
    success: true,
    user: localUser,
  };
}

/**
 * Universal Login with server-first and resilient client-fallback
 */
export async function loginAccount(
  email: string,
  password: string
): Promise<ApiResponse<{ user: User }>> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    return { success: false, error: 'Please enter your email address.' };
  }
  if (!password) {
    return { success: false, error: 'Please enter your password.' };
  }

  // 1. Attempt server login
  const serverRes = await safeApiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: cleanEmail, password }),
  });

  if (serverRes.success && serverRes.user) {
    return {
      success: true,
      user: serverRes.user,
    };
  }

  // If server returned a business error (e.g. Invalid credentials)
  if (!serverRes.isNonJson && !serverRes.isNetworkError && serverRes.error) {
    return {
      success: false,
      error: serverRes.error,
    };
  }

  // 2. Fallback to local authentication store
  const existingUsers = getLocalUsers();
  const match = existingUsers.find(
    u => u.user.email.toLowerCase() === cleanEmail && u.passwordHash === password
  );

  if (match) {
    return {
      success: true,
      user: match.user,
    };
  }

  // Check if email exists with wrong password
  const emailExists = existingUsers.some(u => u.user.email.toLowerCase() === cleanEmail);
  if (emailExists) {
    return {
      success: false,
      error: 'Invalid password. Please check your credentials.',
    };
  }

  return {
    success: false,
    error: 'Invalid email or password credentials.',
  };
}
