import { PublicApiError, signupAccount } from "@/lib/developers/public-api";
import { writeSession } from "@/lib/developers/session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    password?: string;
  } | null;
  if (!body?.name || !body.email || !body.password) {
    return Response.json({ error: "Request is invalid." }, { status: 400 });
  }
  try {
    const created = await signupAccount({
      name: body.name,
      email: body.email,
      password: body.password,
    });
    await writeSession(created.access_token, created.refresh_token, created.expires_in);
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof PublicApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "The request could not be completed." }, { status: 500 });
  }
}
