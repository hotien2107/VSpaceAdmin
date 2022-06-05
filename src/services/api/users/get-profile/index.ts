import HttpClient from "../../../../helpers/axios";
import type { UserApiResponseInterface } from "./types";

const URL = "/users/me/profile";

export async function getProfile() {
  const response = await HttpClient.get<UserApiResponseInterface>(URL);

  return response.data;
}
