import HttpClient from '../../../../helpers/axios';
import type { GetUsersApiResponseInterface } from './types';

const URL = '/users';

export async function getUserList() {
  const response = await HttpClient.get<GetUsersApiResponseInterface>(URL);

  return response.data;
}
