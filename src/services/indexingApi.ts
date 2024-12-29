import { BaseXHR } from 'utils/axios';
import { objectType } from 'utils/types/const';
export const indexingListGet = params =>
  BaseXHR.$get('/corepulse/cms/api/indexing/listing?' + params);
export const indexingCreate = params =>
  BaseXHR.$post('/corepulse/cms/api/indexing/add', params);
export const indexingSubmitTypeApi = (params?: objectType | undefined) =>
  BaseXHR.$post('/corepulse/cms/api/indexing/submit-type', params);
export const indexingDelete = params =>
  BaseXHR.$get('/corepulse/cms/api/indexing/delete?' + params);
export const indexingGetSettingApi = () =>
  BaseXHR.$get('/corepulse/cms/api/indexing/setting');
export const indexingPostSettingApi = (params?: objectType | undefined) =>
  BaseXHR.$post('/corepulse/cms/api/indexing/setting', params);
export const indexingStatusListGet = () =>
  BaseXHR.$get('/corepulse/cms/api/indexing/status');
