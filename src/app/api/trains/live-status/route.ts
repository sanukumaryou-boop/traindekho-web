export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    {
      ok: false,
      status: 503,
      message: "Live train status is coming soon.",
    },
    { status: 503 },
  );
}
