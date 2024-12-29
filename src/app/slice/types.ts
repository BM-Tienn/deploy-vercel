import { PermissionData } from 'app/components/Permission/constant';

export interface GlobalState {
  isLogged: boolean;
  loading: boolean;
  classes?: Classes[];
  isAdmin?: boolean;
  permissionData?: PermissionData;
}

export interface ItemProps {
  label: string;
  value: string;
  children?: ItemProps[];
  publish?: boolean;
  key?: string;
}

export interface ApiOptions {
  value?: any[];
  id?: string;
  class?: string;
}

export interface Classes {
  id: string;
  name: string;
  title: string;
}

export interface Sort {
  type: string;
  order: 'asc' | 'desc';
}

export interface FilterObj {
  filterRule: 'and' | 'or';
  filter: any[];
}
