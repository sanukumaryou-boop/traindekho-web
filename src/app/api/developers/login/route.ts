import { PublicApiError, loginAccount } from "@/lib/developers/public-api";
import { writeSession } from "@/lib/developers/session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;
  if (!body?.email || !body.password) {
    return Response.json({ error: "Request is invalid." }, { status: 400 });
  }
  try {
    const pair = await loginAccount({ email: body.email, password: body.password });
    await writeSession(pair.access_token, pair.refresh_token, pair.expires_in);
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof PublicApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "The request could not be completed." }, { status: 500 });
  }
}
