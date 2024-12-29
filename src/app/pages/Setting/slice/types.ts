import { PagginationType } from 'utils/types/const';
export interface SettingItems {
  id?: number | string;
  name?: string;
  title?: string;
  checked?: string;
}
export interface SettingState {
  loading: boolean;
  list: SettingItems[];
  pagination?: PagginationType;
}
