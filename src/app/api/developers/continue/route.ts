import { NextResponse } from "next/server";
import { requireSession } from "@/lib/developers/session";

export async function GET(request: Request) {
  const next = new URL(request.url).searchParams.get("next") ?? "/developers/keys";
  const destination = next.startsWith("/developers") ? next : "/developers/keys";
  const session = await requireSession();
  const url = new URL(session ? destination : "/developers/login", request.url);
  return NextResponse.redirect(url);
}
