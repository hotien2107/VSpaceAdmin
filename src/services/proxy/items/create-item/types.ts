export interface ItemParamsInterface {
  name: string;
  modelPath: string;
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

interface ItemInterface {
  id: number;
  name: string;
  modelPath:string;
  createdAt: string;
}