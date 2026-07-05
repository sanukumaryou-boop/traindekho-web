import { fetchTrainLiveStatus } from "@/lib/api/live-status";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trainNo = (searchParams.get("no") ?? searchParams.get("train") ?? "")
    .replace(/\D/g, "");
  const date = searchParams.get("date") ?? undefined;

  if (!trainNo) {
    return Response.json(
      { ok: false, status: 400, message: "Enter a valid train number." },
      { status: 400 },
    );
  }

  const result = await fetchTrainLiveStatus(trainNo, date);
  return Response.json(result, {
    status: result.ok ? 200 : result.status,
  });
}
