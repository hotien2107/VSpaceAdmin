import { CreatorInterface } from "@/types/item-category";

export type TableListItem = {
  id: number;
  name: string;
  description: string;
  createBy: CreatorInterface
  createdAt: string;
};


export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};


export type InputForm = {
  name: string;
  description: string;
};