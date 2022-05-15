import { ItemCategoryInterface } from "@/types/item-category";

export interface ItemParamsInterface {
  name: string;
  description: string;
}

export interface ProxyTransformInterface {
  itemCategory: ItemCategoryInterface
}

export interface ProxyResponseInterface {
  itemCategory: ItemCategoryInterface
}