export interface ItemParamsInterface {
  id: number;
}

export interface GetItemApiResponseInterface {
    data: {
      items: ItemInterface;
    };
    code?: number;
    message?: string;
    errors?: string[];
    status?: string;
  }
  
  interface ItemInterface {
    id: number;
    name: string;
    modelPath:string;
    createdAt: string;
  }
  