import { buildTrainSlug } from "@/lib/train-slug";
import { findTrainByNumber } from "@/lib/search-trains";
import type { TrainListItem } from "@/lib/types/train-list";

type TrainSlugFields = Pick<
  TrainListItem,
  | "train_no"
  | "train_name"
  | "source_code"
  | "destination_code"
  | "source"
  | "destination"
>;

function toSlugInput(train: TrainSlugFields) {
  return {
    train_no: train.train_no,
    train_name: train.train_name ?? "",
    source_code: train.source_code ?? "",
    destination_code: train.destination_code ?? "",
    source: train.source ?? "",
    destination: train.destination ?? "",
  };
}

export function getTrainScheduleHref(train: TrainSlugFields): string;
export function getTrainScheduleHref(trainNo: number | string): string;
export function getTrainScheduleHref(
  trainOrNo: TrainSlugFields | number | string,
): string {
  if (typeof trainOrNo === "object") {
    return `/train-schedule/${buildTrainSlug(toSlugInput(trainOrNo))}`;
  }

  const digits = String(trainOrNo).replace(/\D/g, "");
  const train = findTrainByNumber(digits);
  if (train) {
    return `/train-schedule/${buildTrainSlug(toSlugInput(train))}`;
  }

  return `/train-schedule/${digits}`;
}

function liveStatusPathFromTrain(train: TrainSlugFields): string {
  return `/live-train-status/${buildTrainSlug(toSlugInput(train))}`;
}

export function getLiveTrainStatusHref(train: TrainSlugFields): string;
export function getLiveTrainStatusHref(trainNo: number | string): string;
export function getLiveTrainStatusHref(
  trainOrNo: TrainSlugFields | number | string,
): string {
  if (typeof trainOrNo === "object") {
    return liveStatusPathFromTrain(trainOrNo);
  }

  const digits = String(trainOrNo).replace(/\D/g, "");
  if (!digits) return "/live-train-status";

  const train = findTrainByNumber(digits);
  if (train) {
    return liveStatusPathFromTrain(train);
  }

  return `/live-train-status/${digits}`;
}

export function getLiveTrainStatusHrefWithDate(
  train: TrainSlugFields,
  date?: string,
): string;
export function getLiveTrainStatusHrefWithDate(
  trainNo: number | string,
  date?: string,
): string;
export function getLiveTrainStatusHrefWithDate(
  trainOrNo: TrainSlugFields | number | string,
  date?: string,
): string {
  const href =
    typeof trainOrNo === "object"
      ? getLiveTrainStatusHref(trainOrNo)
      : getLiveTrainStatusHref(trainOrNo);
  if (!date || href === "/live-train-status") return href;
  return `${href}?date=${encodeURIComponent(date)}`;
}
