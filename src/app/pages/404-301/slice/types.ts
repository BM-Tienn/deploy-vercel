import { PagginationType } from 'utils/types/const';

export interface SeoMonitorItems {
  id: number;
  uri: string;
  code: string;
  date: string;
  count: number;
}

export interface SeoRedirectItems {
  id: number;
  type: string;
  source: string;
  sourceSite: string;
  target: string;
  active: boolean;
  creationDate: string;
  expiry: string;
  modificationDate: string;
  passThroughParameters: string;
  priority: string;
  regex: string;
  statusCode: string;
  targetSite: string;
}

export interface SeoHttpState {
  loadingMonitor: boolean;
  listMonitor: SeoMonitorItems[];
  paginationMonitor?: PagginationType;
  loadingRedirect: boolean;
  listRedirect: SeoRedirectItems[];
  paginationRedirect?: PagginationType;
}
