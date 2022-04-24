import HttpClient from "../../../../helpers/axios";
import type { CreateItemApiResponseInterface, ItemParamsInterface } from "./types";


const URL =  "/items";

export async function createItem(params: ItemParamsInterface) {
    const response = await HttpClient.post<CreateItemApiResponseInterface>(URL,params);
    console.log(response.data);
    return response.data;
}