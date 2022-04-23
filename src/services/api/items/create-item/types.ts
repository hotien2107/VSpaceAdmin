
export interface ItemParamsInterface {
  name: string;
  modelPath: string;
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
  
  interface ItemInterface {
    id: number;
    name: string;
    modelPath:string;
    createdAt: string;
  }
  