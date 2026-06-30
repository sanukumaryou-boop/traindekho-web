import type { Train } from "@/lib/types/train";
import { titleCase } from "@/lib/format";

export function parseTrainNumberFromSlug(slug: string): string {
  const match = slug.match(/^(\d+)/);
  return match?.[1] ?? slug;
}

function sanitizeSlugPart(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function wordsToSlug(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u2013\u2014\u2212]/g, " ")
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => titleCase(word).replace(/\s+/g, ""))
    .map(sanitizeSlugPart)
    .filter(Boolean)
    .join("-");
}

export function buildTrainSlug(train: Pick<
  Train,
  "train_no" | "source_code" | "destination_code" | "train_name" | "source" | "destination"
>): string {
  const source = sanitizeSlugPart(train.source_code);
  const dest = sanitizeSlugPart(
    train.destination_code.charAt(0).toUpperCase() +
      train.destination_code.slice(1).toLowerCase(),
  );

  let name = train.train_name;
  for (const token of [
    train.source_code,
    train.destination_code,
    train.source,
    train.destination,
  ]) {
    name = name.replace(new RegExp(token, "gi"), "");
  }

  const nameSlug = wordsToSlug(name.trim());
  const fallbackSlug = wordsToSlug(train.train_name);

  const slug = `${train.train_no}-${source}-${dest}-${nameSlug || fallbackSlug}`;
  return sanitizeSlugPart(slug.replace(/-+/g, "-")) || String(train.train_no);
}
