import { ItemInterface } from "@/types/item";

export interface ItemParamsInterface {
  id:number;
  name: string;
  modelPath: string;
  image:string;
  categoryId: number;
}

export interface CreateItemApiResponseInterface {
    data: {
      items: ItemInterface;
    };
    code?: number;
    message?: string;
    errors?: string[];
    status?: string;
  }
  