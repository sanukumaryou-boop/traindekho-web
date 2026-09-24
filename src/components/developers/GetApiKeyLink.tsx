import Link from "next/link";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/developers/public-api";

export default async function GetApiKeyLink({
  className = "",
}: {
  className?: string;
}) {
  const jar = await cookies();
  const signedIn = Boolean(jar.get(ACCESS_COOKIE)?.value || jar.get(REFRESH_COOKIE)?.value);
  if (signedIn) return null;
  return (
    <Link
      href="/developers/login"
      className={`inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 ${className}`}
    >
      Get API key
    </Link>
  );
}
