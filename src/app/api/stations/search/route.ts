import { searchStations } from "@/lib/search-stations";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const q = new URL(request.url).searchParams.get("q") ?? "";
    const results = await searchStations(q);
    return Response.json(results);
  } catch (error) {
    console.error("Station search failed:", error);
    return Response.json({ error: "Station search failed" }, { status: 500 });
  }
}
