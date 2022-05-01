import type { TableListItem } from "@/types/item";

export interface GetItemApiResponseInterface {
  data: {
    items: TableListItem[];
    pagination: {
      count: number;
      page: number;
      totalCount: number;
    };
  };
  code?: number;
  message?: string;
  errors?: string[];
  status?: string;
}