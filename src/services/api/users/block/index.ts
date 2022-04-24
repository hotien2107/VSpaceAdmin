import HttpClient from '../../../../helpers/axios';
import type { BlockUsersApiResponseInterface } from './types';

const URL = '/users/:id/block';

export async function blockUser(id: number) {
  const response = await HttpClient.patch<BlockUsersApiResponseInterface>(
    URL.replace(':id', id.toString()),
  );

  return response.data;
}
