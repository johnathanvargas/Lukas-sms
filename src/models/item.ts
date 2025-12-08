export interface Item {
  id: string;
  // ... other existing fields for items
  created_at?: string | Date | null;
  updated_at?: string | Date | null; // newly tracked field
}

export interface CreateItemDTO {
}
}
