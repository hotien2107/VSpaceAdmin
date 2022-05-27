import HttpClient from "../../../../helpers/axios";
import type { DeleteItemApiResponseInterface, ItemParamsInterface } from "./types";

const URL ="admin/item-categories";

export async function deleteCategory(params: ItemParamsInterface) {
    const response = await HttpClient.delete<DeleteItemApiResponseInterface>( `${URL}/${params.id}`);
    return response.data;
}