import { PublicApiError, signupAccount } from "@/lib/developers/public-api";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  } | null;
  if (!body?.name || !body.email || !body.password || !body.confirmPassword) {
    return Response.json({ error: "Request is invalid." }, { status: 400 });
  }
  if (body.password !== body.confirmPassword) {
    return Response.json({ error: "Passwords do not match." }, { status: 400 });
  }
  try {
    const created = await signupAccount({
      name: body.name,
      email: body.email,
      password: body.password,
    });
    return Response.json({ ok: true, email: created.email });
  } catch (error) {
    if (error instanceof PublicApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "The request could not be completed." }, { status: 500 });
  }
}
