import { PagginationType } from 'utils/types/const';
export interface CustomerItems {
  id: number;
  key: string;
  image?: string;
  type: string;
  published: string;
  createDate: string;
  modificationDate: string;
  parent: boolean;
}
export interface CustomerState {
  loading: boolean;
  list: CustomerItems[];
  pagination?: PagginationType;
}
