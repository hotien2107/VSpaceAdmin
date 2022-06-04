import HttpClient from "../../../../helpers/axios";
import type { GetItemApiResponseInterface, ItemParamsInterface } from "./types";

const URL ="admin/item-categories";

export async function updateCategory(params: ItemParamsInterface) {
    const response = await HttpClient.patch<GetItemApiResponseInterface>( `${URL}/${params.id}`,{
        name: params.name,
        description: params.description,
    });
    console.log(response.data)
    return response.data;
}