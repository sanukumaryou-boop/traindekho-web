import { fetchTrainLiveStatus } from "@/lib/api/live-status";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const no = url.searchParams.get("no") ?? "";
  const date = url.searchParams.get("date") ?? undefined;
  const result = await fetchTrainLiveStatus(no, date);

  return Response.json(result, { status: result.ok ? 200 : result.status });
}
