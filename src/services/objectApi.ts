import { BaseXHR } from 'utils/axios';
import { objectType } from 'utils/types/const';

export const getListObject = (params: string) =>
  BaseXHR.$get('/corepulse/cms/api/object/listing-by-object?' + params);
export const getColumnList = (params: string) =>
  BaseXHR.$get('/corepulse/cms/api/object/get-column-setting?' + params);
export const objectCreate = (params: string) =>
  BaseXHR.$post('/corepulse/cms/api/object/add?' + params);
export const objectDeleteApi = (params: string) =>
  BaseXHR.$post('/corepulse/cms/api/object/delete?' + params);
export const objectGetDetailsApi = (id: string | null) =>
  BaseXHR.$get('/corepulse/cms/api/object/detail/' + id);
export const objectPostDetailsApi = (
  id?: string | null,
  params?: objectType | undefined,
) => BaseXHR.$post('/corepulse/cms/api/object/detail/' + id, params);
export const objectGetOptionsApi = (params: string) =>
  BaseXHR.$get('/corepulse/cms/api/object/options?' + params);
