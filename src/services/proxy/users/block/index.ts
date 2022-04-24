import { blockUser } from '@/services/api/users/block';
import type { ProxyFuncType } from '../../../../types/http/proxy/ProxyFuncType';
import { ProxyStatusEnum } from '../../../../types/http/proxy/ProxyStatus';
import type { BlockUserProxyResponseInterface, BlockUserProxyTransformInterface } from './types';

const blockUserTransform = (
  res: BlockUserProxyTransformInterface,
): BlockUserProxyResponseInterface => {
  const transform = {
    message: res?.id ? 'User blocked' : 'User not blocked',
  };

  return transform;
};

const BlockUserProxy = async (
  id: number,
): Promise<ProxyFuncType<BlockUserProxyResponseInterface>> => {
  const res = await blockUser(id);

  if (res?.code && res.code !== 200) {
    return {
      status: ProxyStatusEnum.FAIL,
      message: res.message,
      code: res.code,
      errors: res.errors,
    };
  }

  const blockUserRespTransformed = blockUserTransform(res.data);
  return {
    status: ProxyStatusEnum.SUCCESS,
    data: blockUserRespTransformed,
  };
};

export default BlockUserProxy;
