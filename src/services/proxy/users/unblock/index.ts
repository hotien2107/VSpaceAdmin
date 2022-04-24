import { unblockUser } from '@/services/api/users/unblock';
import type { ProxyFuncType } from '../../../../types/http/proxy/ProxyFuncType';
import { ProxyStatusEnum } from '../../../../types/http/proxy/ProxyStatus';
import type { UnblockUserProxyResponseInterface, UnblockUserProxyTransformInterface } from './types';

const unblockUserTransform = (
  res: UnblockUserProxyTransformInterface,
): UnblockUserProxyResponseInterface => {
  const transform = {
    message: res?.id ? 'User unblocked' : 'User not unblocked',
  };

  return transform;
};

const UnblockUserProxy = async (
  id: number,
): Promise<ProxyFuncType<UnblockUserProxyResponseInterface>> => {
  const res = await unblockUser(id);

  if (res?.code && res.code !== 200) {
    return {
      status: ProxyStatusEnum.FAIL,
      message: res.message,
      code: res.code,
      errors: res.errors,
    };
  }

  const unblockUserRespTransformed = unblockUserTransform(res.data);
  return {
    status: ProxyStatusEnum.SUCCESS,
    data: unblockUserRespTransformed,
  };
};

export default UnblockUserProxy;
