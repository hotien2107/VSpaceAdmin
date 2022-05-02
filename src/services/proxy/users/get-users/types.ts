import type { UserInterface } from '../../../../types/user';

export interface UserListProxyTransformInterface {
  users: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    status: 'active' | 'inactive' | 'blocked';
    provider: 'local' | 'google' | 'facebook';
    externalId?: string;
    createdAt: string;
  }[];
  pagination: {
    count: number;
    page: number;
    totalCount: number;
  };
}

export interface UserListProxyResponseInterface {
  userList: UserInterface[];
  pagination?: {
    count: number;
    page: number;
    totalCount: number;
  };
}


export interface GetUsersParamsProxyInterface {
  page?: number;
  limit?: number;
  "email[contains]"?: string;
  "name[startsWith]"?: string;
  status?:string;
  sort_by?:string;
}