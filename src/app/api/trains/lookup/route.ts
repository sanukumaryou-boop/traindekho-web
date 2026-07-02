import { findTrainByNumber } from "@/lib/search-trains";
import { getTrainScheduleHref } from "@/lib/train-schedule-href";

export async function GET(request: Request) {
  const no = new URL(request.url).searchParams.get("no") ?? "";
  const train = findTrainByNumber(no);

  if (!train) {
    return Response.json({ error: "Train not found" }, { status: 404 });
  }

  return Response.json({ href: getTrainScheduleHref(train) });
}
