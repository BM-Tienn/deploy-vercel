import { PagginationType } from 'utils/types/const';

export interface IndexingItems {
  id: number;
  url: string;
  time: string;
  type: string;
  response: string;
  createAt: string;
  updateAt: string;
  internalType: string;
  internalValue: string;
  status: any;
  result: any;
}

export interface IndexingState {
  loading: boolean;
  list: IndexingItems[];
  pagination?: PagginationType;
}
