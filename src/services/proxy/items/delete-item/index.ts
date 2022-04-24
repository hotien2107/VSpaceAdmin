import { deleteItem } from '@/services/api/items/delete-item';
import type { ProxyFuncType } from '../../../../types/http/proxy/ProxyFuncType';
import { ProxyStatusEnum } from '../../../../types/http/proxy/ProxyStatus';
import type { 
  DeleteItemProxyResponseInterface, 
  DeleteItemProxyTransformInterface,
  ItemParamsInterface
 } from './types';

const DeleteItemTransform = (
  res: DeleteItemProxyTransformInterface,
): DeleteItemProxyResponseInterface => {
  const transform = {
    code: res.code
  };

  return transform;
};

const DeleteItemProxy = async (params:ItemParamsInterface): Promise<ProxyFuncType<DeleteItemProxyResponseInterface>> => {
  const res = await deleteItem(params);

  if (res?.code && res.code !== 200) {
    return {
      status: ProxyStatusEnum.FAIL,
      message: res.message,
      code: res.code,
      errors: res.errors,
    };
  }

  const DeleteItemRespTransformed = DeleteItemTransform(res);
  return {
    status: ProxyStatusEnum.SUCCESS,
    data: DeleteItemRespTransformed,
  };
};

export default DeleteItemProxy;
