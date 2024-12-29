import { BaseXHR } from 'utils/axios';
import { objectType } from 'utils/types/const';
export const pageListGet = params =>
  BaseXHR.$get('/corepulse/cms/api/document/listing?' + params);
export const pageCreate = params =>
  BaseXHR.$get('/corepulse/cms/api/document/add?' + params);
export const pageGetDetailApi = (id: string | null) =>
  BaseXHR.$get('/corepulse/cms/api/document/detail/' + id);
export const pagePostDetailApi = (
  id?: string | null,
  params?: objectType | undefined,
) => BaseXHR.$post('/corepulse/cms/api/document/detail/' + id, params);
export const pageDelete = params =>
  BaseXHR.$get('/corepulse/cms/api/document/delete?' + params);
export const pageGetController = () =>
  BaseXHR.$get('/corepulse/cms/api/document/get-controller');
export const pageGetTemplates = () =>
  BaseXHR.$get('/corepulse/cms/api/document/get-templates');
export const pageGetDocumentType = id =>
  BaseXHR.$get('/corepulse/cms/api/document/get-document-list-type?id=' + id);
export const pageGetOptions = params =>
  BaseXHR.$post('/corepulse/cms/api/document/options', params);
