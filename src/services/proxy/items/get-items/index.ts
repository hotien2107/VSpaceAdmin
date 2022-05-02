import { getItemList } from '@/services/api/items/get-items';
import type { ProxyFuncType } from '../../../../types/http/proxy/ProxyFuncType';
import { ProxyStatusEnum } from '../../../../types/http/proxy/ProxyStatus';
import type { ItemListProxyResponseInterface, ItemListProxyTransformInterface, ItemListProxyParamsInterface } from './types';

const ItemListTransform = (
  res: ItemListProxyTransformInterface,
): ItemListProxyResponseInterface => {
  const transform = {
      items: res.data?.items,
      pagination: {
        count: res.data?.pagination.count,
        page: res.data?.pagination.page,
        totalCount: res.data?.pagination.totalCount,
      },
  };

  return transform;
};

const ItemListProxy = async (params:ItemListProxyParamsInterface): Promise<ProxyFuncType<ItemListProxyResponseInterface>> => {
  const res = await getItemList(params);

  if (res?.code && res.code !== 200) {
    return {
      status: ProxyStatusEnum.FAIL,
      message: res.message,
      code: res.code,
      errors: res.errors,
    };
  }

  const itemListRespTransformed = ItemListTransform(res);
  return {
    status: ProxyStatusEnum.SUCCESS,
    data: itemListRespTransformed,
  };
};

export default ItemListProxy;
