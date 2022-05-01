import type {TableListItem} from "../../../../types/item";

export interface ItemListProxyTransformInterface {
  data: {
    items: TableListItem[];
    pagination: {
      count: number;
      page: number;
      totalCount: number;
    };
  };
}

export interface ItemListProxyResponseInterface {
  items: TableListItem[];
  pagination: {
    count: number;
    page: number;
    totalCount: number;
  };
}

<<<<<<< HEAD
interface ItemInterface {
  id: number;
  name: string;
  modelPath: string;
  createdAt: string;
}
=======
>>>>>>> 480a06d457e13abb451dc8fd5288ca3c4ede3a0c
