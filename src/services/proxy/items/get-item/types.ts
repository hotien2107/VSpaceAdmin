export interface ItemParamsInterface {
  id: number;
}

export interface GetItemProxyTransformInterface {
  data: {
    items: ItemInterface;
  };
}

export interface GetItemProxyResponseInterface {
  data: {
    items: ItemInterface;
  };
}

interface ItemInterface {
  id: number;
  name: string;
  modelPath:string;
  createdAt: string;
}