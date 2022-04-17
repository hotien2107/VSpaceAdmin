export interface GetUsersApiResponseInterface {
  userList: UserInterface[];
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
