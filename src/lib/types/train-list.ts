export interface TrainListItem {
  id: number;
  train_no: number;
  train_name: string | null;
  source: string | null;
  destination: string | null;
  source_code: string | null;
  destination_code: string | null;
  train_type: string | null;
}
