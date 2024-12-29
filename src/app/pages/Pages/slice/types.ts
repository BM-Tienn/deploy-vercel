import { PermissionItem } from 'app/components/Permission/constant';
import { PagginationType } from 'utils/types/const';
export interface PageItems {
  id: number;
  key: string;
  image?: string;
  type: string;
  published: string;
  createDate: string;
  modificationDate: string;
  parent: boolean;
  permissions?: PermissionItem;
}
export interface PageState {
  loading: boolean;
  list: PageItems[];
  pagination?: PagginationType;
}
