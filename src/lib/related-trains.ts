import type { TrainListItem } from "@/lib/types/train-list";
import trainsData from "@/lib/trains.json";
import trainRajdhaniNumbers from "@/lib/train_rajdhani.json";
import trainVandeBharatExpressNumbers from "@/lib/train_vandebharat.json";

export type PremiumTrainCategory = "Rajdhani" | "Vande Bharat";

const RAJDHANI_NUMBERS = new Set(
  trainRajdhaniNumbers.map((t) => t.train_no),
);
const VANDE_BHARAT_NUMBERS = new Set(
  trainVandeBharatExpressNumbers.map((t) => t.train_no),
);

let trainsByNo: Map<number, TrainListItem> | null = null;

function getTrainsByNo(): Map<number, TrainListItem> {
  if (!trainsByNo) {
    trainsByNo = new Map();
    for (const train of trainsData as TrainListItem[]) {
      if (train.train_no) trainsByNo.set(train.train_no, train);
    }
  }
  return trainsByNo;
}

export function getPremiumTrainCategory(
  trainNo: number,
  trainType?: string,
): PremiumTrainCategory | null {
  if (RAJDHANI_NUMBERS.has(trainNo) || trainType === "Rajdhani") {
    return "Rajdhani";
  }
  if (VANDE_BHARAT_NUMBERS.has(trainNo) || trainType === "Vande Bharat") {
    return "Vande Bharat";
  }
  return null;
}

export function getRelatedPremiumTrains(
  trainNo: number,
  trainType?: string,
): { category: PremiumTrainCategory; trains: TrainListItem[] } | null {
  const category = getPremiumTrainCategory(trainNo, trainType);
  if (!category) return null;

  const numbers =
    category === "Rajdhani"
      ? trainRajdhaniNumbers
      : trainVandeBharatExpressNumbers;
  const byNo = getTrainsByNo();

  const trains = numbers
    .map((t) => byNo.get(t.train_no))
    .filter((t): t is TrainListItem => Boolean(t?.train_name?.trim()))
    .filter((t) => t.train_no !== trainNo)
    .sort((a, b) => a.train_no - b.train_no);

  return { category, trains };
}
