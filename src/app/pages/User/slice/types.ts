import { PagginationType } from 'utils/types/const';
export interface UserItems {
  id: number;
  key: string;
  image?: string;
  type: string;
  published: string;
  createDate: string;
  modificationDate: string;
  parent: boolean;
}
export interface UserState {
  loading: boolean;
  list: UserItems[];
  pagination?: PagginationType;
}
