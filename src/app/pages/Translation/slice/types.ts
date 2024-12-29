import { PagginationType } from 'utils/types/const';
export interface TranslationItems {
  id: number;
  key: string;
}
export interface TranslationState {
  loading: boolean;
  list: TranslationItems[];
  pagination?: PagginationType;
  column: [];
}
