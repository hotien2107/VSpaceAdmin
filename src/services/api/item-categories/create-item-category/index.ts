import HttpClient from "../../../../helpers/axios";
import type { CreateItemCategoryApiResponseInterface, ItemParamsInterface } from "./types";


const URL =  "admin/item-categories";

export async function createCategory(params: ItemParamsInterface) {
    const response = await HttpClient.post<CreateItemCategoryApiResponseInterface>(URL,params);
    console.log(response.data);
    return response.data;
}