import HttpClient from "../../../../helpers/axios";
import type { GetItemApiResponseInterface } from "./types";


const URL = "/items";
console.log(URL);

export async function getItemList() {
    const response = await HttpClient.get<GetItemApiResponseInterface>(URL);
    return response.data;
}