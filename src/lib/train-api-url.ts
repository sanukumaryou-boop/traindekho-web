const DEFAULT_API_URL = "https://api.traindekho.live/go";

export function getTrainApiUrl(): string {
  return process.env.TRAIN_API_URL ?? DEFAULT_API_URL;
}
