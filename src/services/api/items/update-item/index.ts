import HttpClient from "../../../../helpers/axios";
import type { CreateItemApiResponseInterface, ItemParamsInterface } from "./types";


const URL =  "/items";

export async function updateItem(params: ItemParamsInterface) {
    console.log(params);
    const response = await HttpClient.patch<CreateItemApiResponseInterface>(`${URL}/${params.id}`,{
        name: params.name,
        modelPath: params.modelPath,
        image: params.image,
        categoryId: params.categoryId,
    });
    console.log(response.data);
    return response.data;
}