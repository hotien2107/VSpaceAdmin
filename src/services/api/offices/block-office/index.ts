import HttpClient from '../../../../helpers/axios';
import type { BlockApiResponseInterface } from './types';

const URL = 'admin/offices/:id/block';

export async function blockOffice(id: number) {
  const response = await HttpClient.patch<BlockApiResponseInterface>(
    URL.replace(':id', id.toString()),
  );

  return response.data;
}
