// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

export async function getFakeCaptcha(
  params: {
    phone?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>('/api/login/captcha', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
