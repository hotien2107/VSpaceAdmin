import type { ProxyFuncType } from '../../../../types/http/proxy/ProxyFuncType';
import { ProxyStatusEnum } from '../../../../types/http/proxy/ProxyStatus';
import type { BlockProxyResponseInterface, BlockProxyTransformInterface } from './types';
import { blockOffice } from '@/services/api/offices/block-office';

const blockOfficeTransform = (
  res: BlockProxyTransformInterface,
): BlockProxyResponseInterface => {
  const transform = {
    message: res?.id ? 'User blocked' : 'User not blocked',
  };

  return transform;
};

const BlockOfficeProxy = async (
  id: number,
): Promise<ProxyFuncType<BlockProxyResponseInterface>> => {
  const res = await blockOffice(id);

  if (res?.code && res.code !== 200) {
    return {
      status: ProxyStatusEnum.FAIL,
      message: res.message,
      code: res.code,
      errors: res.errors,
    };
  }

  const blockOfficeRespTransformed = blockOfficeTransform(res.data);
  return {
    status: ProxyStatusEnum.SUCCESS,
    data: blockOfficeRespTransformed,
  };
};

export default BlockOfficeProxy;
