export interface ItemParamsInterface {
  id: number;
}


export interface DeleteItemApiResponseInterface {
    data:{
      id:number;
    }
    code: number;
    message?: string;
    errors?: string[];
    status?: string;
  }
  