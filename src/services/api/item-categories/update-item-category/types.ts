import { ItemCategoryInterface } from "@/types/item-category";

export interface ItemParamsInterface {
  id: number;
  name:string;
  description:string;
}

export interface GetItemApiResponseInterface {
    data: {
      itemCategory: ItemCategoryInterface;
    };
    code?: number;
    message?: string;
    errors?: string[];
    status?: string;
  }
  