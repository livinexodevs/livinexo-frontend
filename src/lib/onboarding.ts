"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  getAuth,
  signInWithPopup,
  type UserCredential,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyABUgH51hWTPnqRxeIytAnIpXbmFUxhPwc",
  authDomain: "livinxo-19ead.firebaseapp.com",
  projectId: "livinxo-19ead",
  storageBucket: "livinxo-19ead.firebasestorage.app",
  messagingSenderId: "243893467967",
  appId: "1:243893467967:web:9aa86b1a2d72ecde21f18a",
  measurementId: "G-YP3B009WP4",
};

const API_BASE_URL = "https://haveli-household-backend-1.onrender.com/api";

const SESSION_KEY = "livinexo.onboarding.session";
const HOUSE_KEY = "livinexo.onboarding.house";
const INTENT_KEY = "livinexo.onboarding.intent";
const TOKEN_CACHE_KEY = "livinexo.onboarding.tokenCache";
const BACKEND_ACCESS_TOKEN_KEY = "livinexo.onboarding.backendAccessToken";
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;

export type OnboardingIntent = "create" | "join";

export interface OnboardingSession {
  uid: string;
  localId: string;
  providerId: string;
  federatedId: string;
  name: string;
  email: string;
  avatar: string;
  emailVerified: boolean;
  idToken: string;
  tokenExpiresAt: number;
  backendAccessToken?: string;
  member?: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface HouseMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinedAt: string;
}

export interface HouseResponse {
  id: string;
  name: string;
  createdById: string;
  members: HouseMember[];
  createdAt: string;
  updatedAt: string;
}

export type HouseInvitation = Record<string, unknown>;
export type ExpenseSummary = Record<string, unknown>;
export type AnalyticsSummary = Record<string, unknown>;

function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

function pickString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function pickProfileData(result: UserCredential) {
  const profile =
    (getAdditionalUserInfo(result)?.profile as Record<string, unknown> | null) ??
    null;

  const googleId = pickString(profile?.id);
  const providerId = result.providerId || "google.com";

  return {
    name:
      pickString(profile?.name) ||
      pickString(profile?.given_name) ||
      result.user.displayName ||
      "User",
    email: pickString(profile?.email) || result.user.email || "",
    avatar: pickString(profile?.picture) || result.user.photoURL || "",
    providerId,
    federatedId: googleId ? `https://accounts.google.com/${googleId}` : "",
    emailVerified: Boolean(profile?.verified_email) || result.user.emailVerified,
  };
}

interface TokenCache {
  idToken: string;
  expiresAt: number;
}

interface GoogleAuthApiResponse {
  uid: string;
  email: string;
  name: string;
  picture: string;
  member: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
}

function sanitizeApiMessage(message: string, fallback: string): string {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("jdbc exception") ||
    normalized.includes("select distinct") ||
    normalized.includes("sql [n/a]") ||
    normalized.includes("lower(bytea)")
  ) {
    return fallback;
  }

  return message;
}

function saveTokenCache(cache: TokenCache) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(cache));
}

function getTokenCache(): TokenCache | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(TOKEN_CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TokenCache;
  } catch {
    return null;
  }
}

function updateSessionToken(idToken: string, expiresAt: number) {
  const session = getSavedSession();
  if (!session) return;
  saveSession({
    ...session,
    idToken,
    tokenExpiresAt: expiresAt,
  });
}

async function fetchAndCacheFreshToken(forceRefresh = false): Promise<string> {
  const auth = getAuth(getFirebaseApp());
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Authentication required. Please sign in again.");
  }

  const idToken = await currentUser.getIdToken(forceRefresh);
  const tokenResult = await currentUser.getIdTokenResult();
  const expiresAt = new Date(tokenResult.expirationTime).getTime();

  saveTokenCache({ idToken, expiresAt });
  updateSessionToken(idToken, expiresAt);
  return idToken;
}

function saveBackendAccessToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BACKEND_ACCESS_TOKEN_KEY, token);
}

function getBackendAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(BACKEND_ACCESS_TOKEN_KEY);
}

export async function getValidAuthToken(): Promise<string> {
  const cachedBackendToken = getBackendAccessToken();
  if (cachedBackendToken) {
    return cachedBackendToken;
  }

  const session = getSavedSession();
  if (session?.backendAccessToken) {
    saveBackendAccessToken(session.backendAccessToken);
    return session.backendAccessToken;
  }

  const cache = getTokenCache();
  const now = Date.now();
  if (cache && cache.expiresAt - TOKEN_EXPIRY_BUFFER_MS > now) {
    return cache.idToken;
  }

  try {
    return await fetchAndCacheFreshToken(true);
  } catch {
    const session = getSavedSession();
    if (session && session.tokenExpiresAt - TOKEN_EXPIRY_BUFFER_MS > now) {
      saveTokenCache({
        idToken: session.idToken,
        expiresAt: session.tokenExpiresAt,
      });
      return session.idToken;
    }
    throw new Error("Session expired. Please sign in again.");
  }
}

async function exchangeGoogleToken(idToken: string): Promise<GoogleAuthApiResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    let message = "Failed to verify Google login with backend.";
    try {
      const data = await res.json();
      message = sanitizeApiMessage(
        data?.message ?? data?.error ?? message,
        "Unable to complete login right now. Please try again."
      );
    } catch {
      message = `${message} (${res.status})`;
    }
    throw new Error(message);
  }

  return (await res.json()) as GoogleAuthApiResponse;
}

export async function signInWithGoogle(): Promise<OnboardingSession> {
  const app = getFirebaseApp();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result: UserCredential = await signInWithPopup(auth, provider);
    const profile = pickProfileData(result);
    const idToken = await result.user.getIdToken(true);
    const idTokenResult = await result.user.getIdTokenResult();
    const tokenExpiresAt = new Date(idTokenResult.expirationTime).getTime();
    const backendAuth = await exchangeGoogleToken(idToken);

    saveTokenCache({ idToken, expiresAt: tokenExpiresAt });
    saveBackendAccessToken(backendAuth.accessToken);

    return {
      uid: backendAuth.uid || result.user.uid,
      localId: backendAuth.uid || result.user.uid,
      providerId: profile.providerId,
      federatedId: profile.federatedId,
      name: backendAuth.name || profile.name,
      email: backendAuth.email || profile.email,
      avatar: backendAuth.picture || profile.avatar,
      emailVerified: profile.emailVerified,
      idToken,
      tokenExpiresAt,
      backendAccessToken: backendAuth.accessToken,
      member: backendAuth.member,
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.code === "auth/configuration-not-found") {
        throw new Error(
          "Google sign-in is not configured in Firebase. Enable Google provider in Authentication > Sign-in method and add this app domain to Authorized domains."
        );
      }
      if (error.code === "auth/unauthorized-domain") {
        throw new Error(
          "This domain is not authorized for Firebase Auth. Add the current domain in Firebase Authentication > Settings > Authorized domains."
        );
      }
    }
    throw error;
  }
}

async function apiRequest<T>(
  path: string,
  options: RequestInit
): Promise<T> {
  const token = await getValidAuthToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      message = sanitizeApiMessage(
        data?.message ?? data?.error ?? message,
        "Something went wrong while loading house data. Please try again."
      );
    } catch {
      message = `${message} (${res.status})`;
    }
    throw new Error(message);
  }

  return (await res.json()) as T;
}

export async function createHouse(name: string) {
  return apiRequest<HouseResponse>(
    "/houses",
    {
      method: "POST",
      body: JSON.stringify({ name }),
    }
  );
}

export async function sendHouseInvitation(
  houseId: string,
  email: string
) {
  return apiRequest<{ message?: string }>(
    `/houses/${houseId}/invitations`,
    {
      method: "POST",
      body: JSON.stringify({ email }),
    }
  );
}

export async function listHouseInvitations(houseId: string) {
  return apiRequest<HouseInvitation[]>(
    `/houses/${houseId}/invitations`,
    {
      method: "GET",
    }
  );
}

export async function acceptInvitation(token: string) {
  return apiRequest<HouseResponse>(
    "/invitations/accept",
    {
      method: "POST",
      body: JSON.stringify({ token }),
    }
  );
}

export async function getHouseById(houseId: string) {
  return apiRequest<HouseResponse>(
    `/houses/${houseId}`,
    {
      method: "GET",
    }
  );
}

export async function listHouses() {
  return apiRequest<HouseResponse[]>(
    "/houses",
    {
      method: "GET",
    }
  );
}

export async function listExpenses(params?: {
  page?: number;
  limit?: number;
  category?: string;
  memberId?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.category) query.set("category", params.category);
  if (params?.memberId) query.set("memberId", params.memberId);

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiRequest<ExpenseSummary[] | { expenses?: ExpenseSummary[] }>(
    `/expenses${suffix}`,
    {
      method: "GET",
    }
  );
}

export async function getAnalytics() {
  return apiRequest<AnalyticsSummary>(
    "/analytics",
    {
      method: "GET",
    }
  );
}

export function saveSession(session: OnboardingSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  if (session.backendAccessToken) {
    saveBackendAccessToken(session.backendAccessToken);
  }
}

export function getSavedSession(): OnboardingSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OnboardingSession;
  } catch {
    return null;
  }
}

export function saveHouse(house: HouseResponse) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HOUSE_KEY, JSON.stringify(house));
}

export function getSavedHouse(): HouseResponse | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(HOUSE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as HouseResponse;
  } catch {
    return null;
  }
}

export function saveIntent(intent: OnboardingIntent) {
  if (typeof window === "undefined") return;
  localStorage.setItem(INTENT_KEY, intent);
}

export function getSavedIntent(): OnboardingIntent | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(INTENT_KEY);
  if (value !== "create" && value !== "join") return null;
  return value;
}
