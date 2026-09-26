import { PublicApiError, verifyDeveloperEmail } from "@/lib/developers/public-api";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { token?: string } | null;
  if (!body?.token) {
    return Response.json({ error: "Request is invalid." }, { status: 400 });
  }
  try {
    await verifyDeveloperEmail(body.token);
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof PublicApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "The request could not be completed." }, { status: 500 });
  }
}
