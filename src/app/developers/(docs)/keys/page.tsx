import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import KeysPanel from "@/components/developers/KeysPanel";
import {
  ACCESS_COOKIE,
  PublicApiError,
  REFRESH_COOKIE,
  getAccount,
  listCredentials,
} from "@/lib/developers/public-api";

export const metadata: Metadata = {
  title: "API keys",
  description: "Create and revoke Train Dekho API keys.",
};

export default async function KeysPage() {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (!access) {
    redirect(refresh ? "/api/developers/continue?next=/developers/keys" : "/developers/login");
  }

  try {
    await getAccount(access);
    const credentials = await listCredentials(access);
    return <KeysPanel credentials={credentials} />;
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 401) {
      redirect(refresh ? "/api/developers/continue?next=/developers/keys" : "/developers/login");
    }
    throw error;
  }
}
