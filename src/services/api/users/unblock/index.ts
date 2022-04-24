import HttpClient from '../../../../helpers/axios';
import type { UnblockUsersApiResponseInterface } from './types';

const URL = '/users/:id/unblock';

export async function unblockUser(id: number) {
  const response = await HttpClient.patch<UnblockUsersApiResponseInterface>(
    URL.replace(':id', id.toString()),
  );

  return response.data;
}
