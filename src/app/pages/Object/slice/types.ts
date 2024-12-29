import { PagginationType } from 'utils/types/const';
export interface ObjectItems {
  id: number;
  key: string;
  image?: string;
  type: string;
  published: string;
  createDate: string;
  modificationDate: string;
  parent: boolean;
}
export interface ObjectState {
  loading: boolean;
  list: ObjectItems[];
  pagination?: PagginationType;
}
