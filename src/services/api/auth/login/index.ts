import HttpClient from "../../../../helpers/axios";
import type { LoginApiResponseInterface, LoginParamsInterface } from "./types";

const URL = "/auth/login";

export async function login(params: LoginParamsInterface) {
  const response = await HttpClient.post<LoginApiResponseInterface>(
    URL,
    params
  );
  console.log(response);
  return response.data;
}

