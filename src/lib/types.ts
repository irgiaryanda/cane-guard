import type { CategoryValue, StatusValue } from "./constants";

export interface Incident {
  id: string;
  category: CategoryValue;
  description: string;
  reporter_name: string | null;
  reporter_note: string | null;
  latitude: number;
  longitude: number;
  photo_path: string | null;
  photo_url: string | null;
  status: StatusValue;
  created_at: string;
  updated_at: string;
}

export interface IncidentInsert {
  category: CategoryValue;
  description: string;
  reporter_name?: string;
  reporter_note?: string;
  latitude: number;
  longitude: number;
  photo_path?: string;
  photo_url?: string;
  status?: StatusValue;
}
