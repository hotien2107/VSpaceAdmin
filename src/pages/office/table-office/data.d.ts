export type TableUsersItem = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'blocked';
  provider: 'local' | 'google' | 'facebook';
  externalId?: string;
  createdAt: Date;
};

export type TableUsersPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableUsersData = {
  Users: TableUsersItem[];
  pagination: Partial<TableUsersPagination>;
};

export type TableUsersParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
