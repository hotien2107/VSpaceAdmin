import type { OfficeInterface } from "../../../../types/office";

export interface OfficeListParamsInterface {
  page?: number;
  limit?: number;
  "name[startsWith]"?: string;
  sort_by?:string;
}

export interface OfficeListApiResponseInterface {
  data: {
    offices: OfficeInterface[];
    pagination: {
      count: number;
      page: number;
      totalCount: number;
    };
  };
  status?: string;
  code?: number;
  message?: string;
  errors?: any[];
}
