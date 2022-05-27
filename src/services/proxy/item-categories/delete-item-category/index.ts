import type { ProxyFuncType } from '../../../../types/http/proxy/ProxyFuncType';
import { ProxyStatusEnum } from '../../../../types/http/proxy/ProxyStatus';
import { deleteCategory } from '@/services/api/item-categories/delete-item-category';
import type { 
  DeleteItemProxyResponseInterface, 
  DeleteItemProxyTransformInterface,
  ItemParamsInterface
 } from './types';

const DeleteItemTransform = (
  res: DeleteItemProxyTransformInterface,
): DeleteItemProxyResponseInterface => {
  const transform = {
    id: res.id
  };

  return transform;
};

const DeleteCategoryProxy = async (params:ItemParamsInterface): Promise<ProxyFuncType<DeleteItemProxyResponseInterface>> => {
  const res = await deleteCategory(params);

  if (res?.code && res.code !== 200) {
    return {
      status: ProxyStatusEnum.FAIL,
      message: res.message,
      code: res.code,
      errors: res.errors,
    };
  }

  const DeleteItemRespTransformed = DeleteItemTransform(res?.data);
  return {
    status: ProxyStatusEnum.SUCCESS,
    data: DeleteItemRespTransformed,
  };
};

export default DeleteCategoryProxy;
