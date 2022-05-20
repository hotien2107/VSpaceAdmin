export interface BlockApiResponseInterface {
  data: {
    id: number;
  };
  code?: number;
  message?: string;
  errors?: string[];
}
