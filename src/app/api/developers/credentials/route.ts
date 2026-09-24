import { PublicApiError, createCredential, listCredentials } from "@/lib/developers/public-api";
import { currentAccessToken } from "@/lib/developers/session";

async function accessOr401() {
  const access = await currentAccessToken();
  if (!access) {
    return null;
  }
  return access;
}

export async function GET() {
  const access = await accessOr401();
  if (!access) {
    return Response.json({ error: "Authentication is required." }, { status: 401 });
  }
  try {
    const credentials = await listCredentials(access);
    return Response.json({ credentials });
  } catch (error) {
    if (error instanceof PublicApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "The request could not be completed." }, { status: 500 });
  }
}

export async function POST() {
  const access = await accessOr401();
  if (!access) {
    return Response.json({ error: "Authentication is required." }, { status: 401 });
  }
  try {
    const issued = await createCredential(access);
    return Response.json(issued, { status: 201 });
  } catch (error) {
    if (error instanceof PublicApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "The request could not be completed." }, { status: 500 });
  }
}
