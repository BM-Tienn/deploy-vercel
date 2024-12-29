import { BaseXHR } from 'utils/axios';
import { objectType } from 'utils/types/const';
export const userListGet = params =>
  BaseXHR.$get('/corepulse/cms/api/user/listing?' + params);
export const userCreate = params =>
  BaseXHR.$post('/corepulse/cms/api/user/add', params);
export const userGetDetailApi = (id: string | null) =>
  BaseXHR.$get('/corepulse/cms/api/user/detail/' + id);
export const userPostDetailApi = (
  id?: string | null,
  params?: objectType | undefined,
) => BaseXHR.$post('/corepulse/cms/api/user/detail/' + id, params);
export const userDelete = params =>
  BaseXHR.$get('/corepulse/cms/api/user/delete?' + params);
