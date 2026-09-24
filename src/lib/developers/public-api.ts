const ACCESS_COOKIE = "td_access";
const REFRESH_COOKIE = "td_refresh";
const ACCESS_MAX_AGE = 900;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

export { ACCESS_COOKIE, REFRESH_COOKIE, ACCESS_MAX_AGE, REFRESH_MAX_AGE };

export function publicApiUrl() {
  const base = process.env.PUBLIC_API_URL ?? "https://api.traindekho.live/v1";
  return base.replace(/\/$/, "");
}

export type AccountPlan = {
  code: string;
  name: string;
  daily_request_limit: number | null;
  monthly_request_limit: number | null;
  requests_per_minute: number | null;
};

export type Account = {
  id: string;
  type: string;
  name: string;
  status: string;
  plan: AccountPlan;
};

export type ApiCredential = {
  id: string;
  type: string;
  key_prefix: string;
  status: string;
  last_used_at: string | null;
  created_at: string;
};

export type IssuedCredential = {
  credential: ApiCredential;
  secret: string;
};

type TokenPair = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export class PublicApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function readError(response: Response) {
  const body = (await response.json().catch(() => null)) as {
    error?: { message?: string };
  } | null;
  return body?.error?.message ?? "The request could not be completed.";
}

export async function publicApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${publicApiUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new PublicApiError(response.status, await readError(response));
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export async function signupAccount(input: { name: string; email: string; password: string }) {
  return publicApi<TokenPair & { account: Account }>("/account/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function loginAccount(input: { email: string; password: string }) {
  return publicApi<TokenPair>("/account/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function refreshAccount(refreshToken: string) {
  return publicApi<TokenPair>("/account/token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export type AccountUsage = {
  date: string;
  daily_request_limit: number | null;
  daily_request_count: number;
  monthly_request_limit: number | null;
  monthly_request_count: number;
  requests_per_minute: number | null;
};

export async function getUsage(accessToken: string) {
  return publicApi<AccountUsage>("/account/usage", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function getAccount(accessToken: string) {
  return publicApi<Account>("/account", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function listCredentials(accessToken: string) {
  const body = await publicApi<{ credentials: ApiCredential[] }>("/account/credentials", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return body.credentials.filter((item) => item.type === "api_key");
}

export async function createCredential(accessToken: string) {
  return publicApi<IssuedCredential>("/account/credentials", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function revokeCredential(accessToken: string, credentialId: string) {
  await publicApi<void>(`/account/credentials/${encodeURIComponent(credentialId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
