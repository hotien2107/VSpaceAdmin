import { createItem } from '@/services/api/items/create-item';
import type { ProxyFuncType } from '../../../../types/http/proxy/ProxyFuncType';
import { ProxyStatusEnum } from '../../../../types/http/proxy/ProxyStatus';
import type { CreateItemProxyResponseInterface, CreateItemProxyTransformInterface, ItemParamsInterface } from './types';

const createItemTransform = (
  res: CreateItemProxyTransformInterface,
): CreateItemProxyResponseInterface => {
  const transform = {
    data: res.data
  };

  return transform;
};

const CreateItemProxy = async (params: ItemParamsInterface): Promise<ProxyFuncType<CreateItemProxyResponseInterface>> => {
  const res = await createItem(params);

  if (res?.code && res.code !== 201) {
    return {
      status: ProxyStatusEnum.FAIL,
      message: res.message,
      code: res.code,
      errors: res.errors,
    };
  }

  const userListRespTransformed = createItemTransform(res);
  return {
    status: ProxyStatusEnum.SUCCESS,
    data: userListRespTransformed,
  };
};

export default CreateItemProxy;
