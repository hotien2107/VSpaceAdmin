import HttpClient from "../../../../helpers/axios";
import type { DeleteItemApiResponseInterface, ItemParamsInterface } from "./types";

const URL ="/items";

export async function deleteItem(params: ItemParamsInterface) {
    const response = await HttpClient.delete<DeleteItemApiResponseInterface>( `${URL}/${params.id}`);
    return response.data;
}