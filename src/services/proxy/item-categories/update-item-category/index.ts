import type { ProxyFuncType } from '../../../../types/http/proxy/ProxyFuncType';
import { ProxyStatusEnum } from '../../../../types/http/proxy/ProxyStatus';
import type { ProxyResponseInterface, ProxyTransformInterface, ItemParamsInterface } from './types';
import { updateCategory } from '@/services/api/item-categories/update-item-category';

const Transform = (
  res: ProxyTransformInterface,
): ProxyResponseInterface => {
  const transform = {
    itemCategory: res.itemCategory
  };

  return transform;
};

const UpdateCategoryProxy = async (params: ItemParamsInterface): Promise<ProxyFuncType<ProxyResponseInterface>> => {
  const res = await updateCategory(params);

  if (res?.code && res?.code !== 200) {
    return {
      status: ProxyStatusEnum.FAIL,
      message: res.message,
      code: res.code,
      errors: res.errors,
    };
  }

  const respTransformed = Transform(res?.data);
  return {
    status: ProxyStatusEnum.SUCCESS,
    data: respTransformed ,
  };
};

export default UpdateCategoryProxy;
