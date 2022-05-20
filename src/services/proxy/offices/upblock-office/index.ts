import type { ProxyFuncType } from '../../../../types/http/proxy/ProxyFuncType';
import { ProxyStatusEnum } from '../../../../types/http/proxy/ProxyStatus';
import type { UnblockProxyResponseInterface, UnblockProxyTransformInterface } from './types';
import { unblockOffice } from '@/services/api/offices/unblock-office';
const unblockTransform = (
  res: UnblockProxyTransformInterface,
): UnblockProxyResponseInterface => {
  const transform = {
    message: res?.id ? ' unblocked' : ' not unblocked',
  };

  return transform;
};

const UnblockOfficeProxy = async (
  id: number,
): Promise<ProxyFuncType<UnblockProxyResponseInterface>> => {
  const res = await unblockOffice(id);

  if (res?.code && res.code !== 200) {
    return {
      status: ProxyStatusEnum.FAIL,
      message: res.message,
      code: res.code,
      errors: res.errors,
    };
  }

  const unblockRespTransformed = unblockTransform(res.data);
  return {
    status: ProxyStatusEnum.SUCCESS,
    data: unblockRespTransformed,
  };
};

export default UnblockOfficeProxy;
