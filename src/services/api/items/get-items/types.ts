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

export interface ItemListParamsInterface {
  page?: number;
  limit?: number;
  "name[contains]"?: string;
  "path[startsWith]"?: string;
  sort_by?:string;
}