// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { TableListItem } from './data.d';
/** 获取规则列表 GET /api/items */
export async function items(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: TableListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/models', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
