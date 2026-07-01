import type { TrainListItem } from "@/lib/types/train-list";
import trainsData from "@/lib/trains.json";

let cachedTrains: TrainListItem[] | null = null;

function getTrains(): TrainListItem[] {
  if (!cachedTrains) {
    cachedTrains = trainsData as TrainListItem[];
  }
  return cachedTrains;
}

export function searchTrains(query: string, limit = 8): TrainListItem[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const numQuery = q.replace(/\D/g, "");
  const trains = getTrains();

  const numberPrefix: TrainListItem[] = [];
  const nameStarts: TrainListItem[] = [];
  const nameContains: TrainListItem[] = [];
  const routeMatch: TrainListItem[] = [];

  for (const train of trains) {
    if (
      numberPrefix.length + nameStarts.length + nameContains.length + routeMatch.length >=
      limit * 4
    ) {
      break;
    }

    const no = String(train.train_no ?? "");
    const name = (train.train_name ?? "").toLowerCase();
    const source = (train.source ?? "").toLowerCase();
    const destination = (train.destination ?? "").toLowerCase();
    const sourceCode = (train.source_code ?? "").toLowerCase();
    const destCode = (train.destination_code ?? "").toLowerCase();

    if (!no || !name) continue;

    if (numQuery.length >= 2 && no.startsWith(numQuery)) {
      numberPrefix.push(train);
      continue;
    }
    if (name.startsWith(q)) {
      nameStarts.push(train);
      continue;
    }
    if (name.includes(q)) {
      nameContains.push(train);
      continue;
    }
    if (
      sourceCode.includes(q) ||
      destCode.includes(q) ||
      source.includes(q) ||
      destination.includes(q)
    ) {
      routeMatch.push(train);
    }
  }

  return [...numberPrefix, ...nameStarts, ...nameContains, routeMatch].slice(0, limit);
}

export function findTrainByNumber(trainNo: string): TrainListItem | undefined {
  const digits = trainNo.replace(/\D/g, "");
  if (!digits) return undefined;
  return getTrains().find(
    (train) => String(train.train_no) === digits && Boolean(train.train_name?.trim()),
  );
}
