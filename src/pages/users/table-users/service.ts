// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { TableUsersItem } from './data';
/** 获取规则列表 GET /api/users */
export async function users(
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
    data: TableUsersItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/users', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
