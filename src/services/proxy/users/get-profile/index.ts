import { ProxyStatusEnum } from "../../../../types/http/proxy/ProxyStatus";
import { ProxyFuncType } from "../../../../types/http/proxy/ProxyFuncType";
import { getProfile } from "../../../api/users/get-profile";
import {
  ProfileProxyResponseInterface,
  ProfileProxyTransformInterface,
} from "./type";

const profileTransform = (
  res: ProfileProxyTransformInterface
): ProfileProxyResponseInterface => {
  const transform = {
    userInfo: {
      id: res?.id ?? "",
      email: res?.email ?? "",
      name: res?.name ?? "",
      phone: res?.phone ?? "",
      avatar: res?.avatar ?? "",
      provider: res?.provider ?? "",
      externalId: res?.externalId ?? "",
      status: res?.status ?? "",
      createdAt: res?.createdAt ?? "",
    },
  };
  return transform;
};

const ProfileProxy = async (): Promise<
  ProxyFuncType<ProfileProxyResponseInterface>
> => {
  const res = await getProfile();
  console.log(res);
  if (res?.code && res?.code!==200) {
    return {
      status: ProxyStatusEnum.FAIL,
      message: res.message,
      code: res.code,
      errors: res.errors,
    };
  }

  const profileRespTransformed = profileTransform(res?.data?.user);
  return {
    status: ProxyStatusEnum.SUCCESS,
    data: profileRespTransformed,
  };
};

export default ProfileProxy;
