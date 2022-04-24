export interface ItemParamsInterface {
  id: number;
}


export interface DeleteItemApiResponseInterface {
    code: number;
    message?: string;
    errors?: string[];
    status?: string;
  }
  