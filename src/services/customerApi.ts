import { BaseXHR } from 'utils/axios';
import { objectType } from 'utils/types/const';
export const customerListGet = params =>
  BaseXHR.$get('/corepulse/cms/api/customer/listing?' + params);
export const customerCreate = params =>
  BaseXHR.$get('/corepulse/cms/api/customer/add?' + params);
export const customerGetDetailApi = (id: string | null) =>
  BaseXHR.$get('/corepulse/cms/api/customer/detail/' + id);
export const customerPostDetailApi = (
  id?: string | null,
  params?: objectType | undefined,
) => BaseXHR.$post('/corepulse/cms/api/customer/detail/' + id, params);
export const customerDelete = params =>
  BaseXHR.$get('/corepulse/cms/api/customer/delete?' + params);
