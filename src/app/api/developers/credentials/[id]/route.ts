import { PublicApiError, revokeCredential } from "@/lib/developers/public-api";
import { currentAccessToken } from "@/lib/developers/session";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const access = await currentAccessToken();
  if (!access) {
    return Response.json({ error: "Authentication is required." }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    await revokeCredential(access, id);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof PublicApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "The request could not be completed." }, { status: 500 });
  }
}
