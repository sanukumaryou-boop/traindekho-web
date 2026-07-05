const DEFAULT_API_URL = "https://rails-orpin.vercel.app";

export function getTrainApiUrl(): string {
  return process.env.TRAIN_API_URL ?? DEFAULT_API_URL;
}
