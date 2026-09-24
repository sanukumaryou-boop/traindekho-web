import { cookies } from "next/headers";

import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
  PublicApiError,
  getAccount,
  refreshAccount,
  type Account,
} from "@/lib/developers/public-api";

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function writeSession(accessToken: string, refreshToken: string, expiresIn = ACCESS_MAX_AGE) {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, accessToken, sessionCookieOptions(expiresIn));
  jar.set(REFRESH_COOKIE, refreshToken, sessionCookieOptions(REFRESH_MAX_AGE));
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

export async function currentAccessToken() {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  if (access) {
    try {
      await getAccount(access);
      return access;
    } catch (error) {
      if (!(error instanceof PublicApiError) || error.status !== 401) {
        throw error;
      }
    }
  }

  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (!refresh) {
    return null;
  }
  try {
    const pair = await refreshAccount(refresh);
    await writeSession(pair.access_token, pair.refresh_token, pair.expires_in);
    return pair.access_token;
  } catch (error) {
    if (error instanceof PublicApiError && (error.status === 401 || error.status === 400)) {
      await clearSession();
      return null;
    }
    throw error;
  }
}

export async function currentAccount(): Promise<Account | null> {
  const access = await currentAccessToken();
  if (!access) return null;
  return getAccount(access);
}

export async function requireSession() {
  const access = await currentAccessToken();
  if (!access) return null;
  const account = await getAccount(access);
  return { access, account };
}
