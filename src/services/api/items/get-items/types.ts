export interface GetItemApiResponseInterface {
  data: {
    items: ItemInterface[];
    pagination: {
      count: number;
      page: number;
      totalCount: number;
    };
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
  