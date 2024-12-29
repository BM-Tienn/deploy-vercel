import { ItemProps } from 'app/components/FormSelect';
import { PermissionItem } from '../constant';

export interface SelectItem {
  id: string | number;
  key: string;
  parentId: number;
  path: string;
  type: string;
}

export interface ObjectItem {
  id: string;
  name: string;
  title: string;
}

export interface PermissionState {
  assets: PermissionItem[];
  documents: PermissionItem[];
  objects: PermissionItem[];
  others: PermissionItem[];
  othersConfig: ItemProps[];
  documentsConfig: ItemProps[];
  assetsConfig: ItemProps[];
  objectsConfig: ItemProps[];
}
