export type TableListItem = {
  id: number;
  name: string;
  path: string;
  createdAt: string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
  name: string;
  modelPath: string;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};