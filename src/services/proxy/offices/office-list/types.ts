import type{ OfficeInterface } from "../../../../types/office";

export interface OfficeListProxyParamsInterface {
  page?: number;
  limit?: number;
  "name[startsWith]"?: string;
  sort_by?:string;
}

export interface OfficeListProxyResponseInterface {
  offices: OfficeInterface[];
  pagination?: {
    count: number;
    page: number;
    totalCount: number;
  };
}

export interface OfficeListProxyTransformInterface {
  offices: OfficeInterface[];
  pagination: {
    count: number;
    page: number;
    totalCount: number;
  };
}
