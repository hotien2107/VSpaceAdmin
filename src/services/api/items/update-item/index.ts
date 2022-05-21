import HttpClient from "../../../../helpers/axios";
import type { CreateItemApiResponseInterface, ItemParamsInterface } from "./types";


const URL =  "admin/items";

export async function updateItem(params: ItemParamsInterface) {
    const response = await HttpClient.patch<CreateItemApiResponseInterface>(`${URL}/${params.id}`,{
        name: params.name,
        modelPath: params.modelPath,
        image: params.image,
        categoryId: params.categoryId,
    });
    return response.data;
}