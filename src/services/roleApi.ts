import { BaseXHR } from 'utils/axios';
import { objectType } from 'utils/types/const';
export const roleListGet = params =>
  BaseXHR.$get('/corepulse/cms/api/role/listing?' + params);
export const roleCreate = params =>
  BaseXHR.$post('/corepulse/cms/api/role/add', params);
export const roleGetDetailApi = (id: string | null) =>
  BaseXHR.$get('/corepulse/cms/api/role/detail/' + id);
export const rolePostDetailApi = (
  id?: string | null,
  params?: objectType | undefined,
) => BaseXHR.$post('/corepulse/cms/api/role/detail/' + id, params);
export const roleDelete = params =>
  BaseXHR.$get('/corepulse/cms/api/role/delete?' + params);
