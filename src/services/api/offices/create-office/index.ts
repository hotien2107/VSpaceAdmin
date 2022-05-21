import HttpClient from "../../../../helpers/axios";

import { OfficeParamsInterface, OfficeApiResponseInterface } from "./types";
const URL = "admin/offices";

export async function createOffice(params: OfficeParamsInterface) {
  const response = await HttpClient.post<OfficeApiResponseInterface>(
    URL,
    params
  );

  return response.data;
}
