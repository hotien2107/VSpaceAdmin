import { ItemCategoryInterface } from "@/types/item-category";

export interface ItemParamsInterface {
  name: string;
  description: string;
}

export interface CreateItemCategoryApiResponseInterface {
    data: {
      itemCategory: ItemCategoryInterface;
    };
    code?: number;
    message?: string;
    errors?: string[];
    status?: string;
}