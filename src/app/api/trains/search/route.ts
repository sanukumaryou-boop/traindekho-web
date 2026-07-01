import { searchTrains } from "@/lib/search-trains";

export async function GET(request: Request) {
  try {
    const q = new URL(request.url).searchParams.get("q") ?? "";
    const results = searchTrains(q);
    return Response.json(results);
  } catch (error) {
    console.error("Train search failed:", error);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
