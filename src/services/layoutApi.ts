import { BaseXHR } from 'utils/axios';
import { objectType } from 'utils/types/const';

export const getSidebarApi = () =>
  BaseXHR.$get('/corepulse/cms/api/object/get-sidebar');
export const getSearchHistoryApi = () =>
  BaseXHR.$get('/corepulse/cms/api/search/history');
export const updateSearchHistoryApi = (params: objectType | undefined) =>
  BaseXHR.$post('/corepulse/cms/api/search/history', params);
export const getSearchTypeApi = (params: objectType | undefined) =>
  BaseXHR.$post('/corepulse/cms/api/search/type', params);
export const getSearchTreeCascaderApi = (params: objectType | undefined) =>
  BaseXHR.$post('/corepulse/cms/api/search/tree-cascader', params);
