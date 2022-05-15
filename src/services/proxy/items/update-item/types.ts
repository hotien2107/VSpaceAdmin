import { ItemInterface } from "@/types/item";

export interface ItemParamsInterface {
  id: number;
  name: string;
  modelPath: string;
  image:string;
  categoryId: number;
}
export interface CreateItemProxyTransformInterface {
  data: {
    items: ItemInterface;
  };
}

export interface CreateItemProxyResponseInterface {
  data: {
    items: ItemInterface;
  };
}
