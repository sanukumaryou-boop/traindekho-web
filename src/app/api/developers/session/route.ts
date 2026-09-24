import { PublicApiError } from "@/lib/developers/public-api";
import { requireSession } from "@/lib/developers/session";

export async function GET() {
  try {
    const session = await requireSession();
    if (!session) {
      return Response.json({ error: "Authentication is required." }, { status: 401 });
    }
    return Response.json({ account: session.account });
  } catch (error) {
    if (error instanceof PublicApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "The request could not be completed." }, { status: 500 });
  }
}
