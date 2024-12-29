import { PagginationType } from 'utils/types/const';
export interface RoleItems {
  id: number;
  key: string;
  image?: string;
  type: string;
  published: string;
  createDate: string;
  modificationDate: string;
  parent: boolean;
}
export interface RoleState {
  loading: boolean;
  list: RoleItems[];
  pagination?: PagginationType;
  isPermission?: boolean;
}
