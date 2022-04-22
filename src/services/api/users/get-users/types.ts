export interface GetUsersApiResponseInterface {
  data: {
    users: UserInterface[];
    pagination: {
      count: number;
      page: number;
      totalCount: number;
    };
  };
  code?: number;
  message?: string;
  errors?: string[];
}

interface UserInterface {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'blocked';
  provider: 'local' | 'google' | 'facebook';
  externalId?: string;
  createdAt: string;
}
