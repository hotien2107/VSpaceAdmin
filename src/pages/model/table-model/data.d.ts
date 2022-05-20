import { CategoryInterface } from "@/types/item";

export type TableListItem = {
  id: number;
  name: string;
  modelPath: string;
  image:string;
  category: CategoryInterface;
  createdAt: string;
};

export type InputForm = {
  name: string;
  modelPath: string;
  image:string;
  categoryId: number;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
  name: string;
  modelPath: string;
};

export type FilterInterface = {
  value: number;
  text: string;
}

export type SelectedInterface ={
  value: string;
  label: string;
}