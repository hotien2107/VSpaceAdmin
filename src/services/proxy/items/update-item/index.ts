import type { ProxyFuncType } from '../../../../types/http/proxy/ProxyFuncType';
import { ProxyStatusEnum } from '../../../../types/http/proxy/ProxyStatus';
import type { CreateItemProxyResponseInterface, CreateItemProxyTransformInterface, ItemParamsInterface } from './types';
import { updateItem } from '@/services/api/items/update-item';

const transform = (
  res: CreateItemProxyTransformInterface,
): CreateItemProxyResponseInterface => {
  const transform = {
    data: res.data
  };

  return transform;
};

const UpdateItemProxy = async (params: ItemParamsInterface): Promise<ProxyFuncType<CreateItemProxyResponseInterface>> => {
  const res = await updateItem(params);

  if (res?.code && res.code !== 200) {
    return {
      status: ProxyStatusEnum.FAIL,
      message: res.message,
      code: res.code,
      errors: res.errors,
    };
  }

  const respTransformed = transform(res);
  return {
    status: ProxyStatusEnum.SUCCESS,
    data: respTransformed,
  };
};

export default UpdateItemProxy;
