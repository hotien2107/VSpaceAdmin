import HttpClient from '../../../../helpers/axios';
import type { GetUsersApiResponseInterface, GetUsersParamsInterface } from './types';

const URL = 'admin/users';

export async function getUserList(param: GetUsersParamsInterface) {
  const response = await HttpClient.get<GetUsersApiResponseInterface>(URL, { params: param });

  return response.data;
}
