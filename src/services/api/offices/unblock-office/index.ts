import HttpClient from '../../../../helpers/axios';
import type { UnblockApiResponseInterface } from './types';

const URL = '/offices/:id/unblock';

export async function unblockOffice(id: number) {
  const response = await HttpClient.patch<UnblockApiResponseInterface>(
    URL.replace(':id', id.toString()),
  );

  return response.data;
}
