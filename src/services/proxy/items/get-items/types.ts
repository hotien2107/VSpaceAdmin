import type {TableListItem} from "../../../../types/item";

export interface ItemListProxyTransformInterface {
  data: {
    items: TableListItem[];
    pagination: {
      count: number;
      page: number;
      totalCount: number;
    };
  };
}

export interface ItemListProxyResponseInterface {
  items: TableListItem[];
  pagination: {
    count: number;
    page: number;
    totalCount: number;
  };
}

