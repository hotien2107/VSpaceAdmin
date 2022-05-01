import { getUserList } from '@/services/api/users/get-users';
import type { ProxyFuncType } from '../../../../types/http/proxy/ProxyFuncType';
import { ProxyStatusEnum } from '../../../../types/http/proxy/ProxyStatus';
import type {
  GetUsersParamsProxyInterface,
  UserListProxyResponseInterface,
  UserListProxyTransformInterface,
} from './types';

const userListTransform = (
  res: UserListProxyTransformInterface,
): UserListProxyResponseInterface => {
  const transform = {
    userList: res.users.map((user) => {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        provider: user.provider,
        externalId: user.externalId,
        status: user.status,
        createdAt: user.createdAt,
      };
    }),
    pagination: {
      count: res.pagination.count,
      page: res.pagination.page,
      totalCount: res.pagination.totalCount,
    },
  };

  return transform;
};

const UserListProxy = async (
  param: GetUsersParamsProxyInterface,
): Promise<ProxyFuncType<UserListProxyResponseInterface>> => {
  const res = await getUserList(param);

  if (res?.code && res.code !== 200) {
    return {
      status: ProxyStatusEnum.FAIL,
      message: res.message,
      code: res.code,
      errors: res.errors,
    };
  }

  const userListRespTransformed = userListTransform(res.data);
  return {
    status: ProxyStatusEnum.SUCCESS,
    data: userListRespTransformed,
  };
};

export default UserListProxy;
