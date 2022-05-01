export interface ItemListProxyTransformInterface {
  data: {
    items: ItemInterface[];
    pagination: {
      count: number;
      page: number;
      totalCount: number;
    };
  };
}

export interface ItemListProxyResponseInterface {
  data: {
    items: ItemInterface[];
    pagination: {
      count: number;
      page: number;
      totalCount: number;
    };
  };
}

interface ItemInterface {
  id: number;
  name: string;
  modelPath: string;
  createdAt: string;
}