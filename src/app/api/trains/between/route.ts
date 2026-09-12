import { fetchTrainsBetween } from "@/lib/api/trains-between";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const from = params.get("from") ?? "";
    const to = params.get("to") ?? "";

    if (!from.trim() || !to.trim()) {
      return Response.json(
        { error: "Both from and to station codes are required" },
        { status: 400 },
      );
    }

    if (from.trim().toUpperCase() === to.trim().toUpperCase()) {
      return Response.json(
        { error: "Origin and destination must be different" },
        { status: 400 },
      );
    }

    const results = await fetchTrainsBetween(from, to);
    if (!results) {
      return Response.json({ error: "Route search failed" }, { status: 502 });
    }

    return Response.json(results);
  } catch (error) {
    console.error("Route search failed:", error);
    return Response.json({ error: "Route search failed" }, { status: 500 });
  }
}
