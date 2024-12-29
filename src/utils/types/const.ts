import { PermissionItem } from 'app/components/Permission/constant';

export const Token = 'token';
export const CsrfToken = 'csrfToken';
export type objectType = {
  [key: string]: any;
};

export interface PagginationType {
  last: number;
  current: number;
  numItemsPerPage: number;
  first: number;
  pageCount: number;
  totalCount: number;
  pageParameterName: string;
  sortFieldParameterName: string;
  sortDirectionParameterName: string;
  filterFieldParameterName: string;
  filterValueParameterName: string;
  distinct: true;
  pageOutOfRange: string;
  defaultLimit: number;
  next: number;
  pagesInRange: [number] | [];
  firstPageInRange: number;
  lastPageInRange: number;
  currentItemCount: number;
  firstItemNumber: number;
  lastItemNumber: number;
}

export interface FilterType {
  [key: string]: 'string' | 'boolean' | 'number' | 'date';
}

export interface ColumnType {
  sortType: { label: string; value: string }[];
  filterType: FilterType;
}

export interface Asset {
  id: number;
  type?:
    | 'image'
    | 'video'
    | 'document'
    | 'audio'
    | 'text'
    | 'archive'
    | 'folder';
  mimetype?: string;
  filename?: string;
  fullPath?: string;
  parentId?: number;
  checked?: boolean;
  path: string;
  permissions?: PermissionItem;
  thumbnail?: string;
}

export interface ViewType {
  [key: string]: boolean;
}

export interface SortType {
  type: string;
  order: 'asc' | 'desc';
}

export interface FilterTypes {
  filterRule: 'and' | 'or';
  filter: any[];
}
