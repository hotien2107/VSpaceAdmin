import HttpClient from "../../../../helpers/axios";
import type { GetItemApiResponseInterface, ItemListParamsInterface } from "./types";


const URL = "/item-categories";

export async function getCategoryList(params: ItemListParamsInterface) {
    const response = await HttpClient.get<GetItemApiResponseInterface>(URL, {
      params: params,
    });
    console.log(params);
    return response.data;
  }
  