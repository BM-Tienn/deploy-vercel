import { BaseXHR } from 'utils/axios';
import { objectType } from 'utils/types/const';

export const getTreeApi = params =>
  BaseXHR.$get('/corepulse/cms/api/media/tree-children-asset?' + params);
export const getFolderDetailApi = params =>
  BaseXHR.$get('/corepulse/cms/api/media/get-asset?' + params);
export const uploadMediaFile = (data, config) =>
  BaseXHR.$post('/corepulse/cms/api/asset/upload-file', data, config);
export const deleteMediaFile = params =>
  BaseXHR.$post('/corepulse/cms/api/asset/delete?' + params);
export const createNewFolder = params =>
  BaseXHR.$get('/corepulse/cms/api/asset/upload-folder?' + params);
export const mediaGetDetailApi = (id: string | null) =>
  BaseXHR.$get('/corepulse/cms/api/asset/detail/' + id);
export const mediaPostDetailApi = (
  id?: string | null,
  params?: objectType | undefined,
) => BaseXHR.$post('/corepulse/cms/api/asset/detail/' + id, params);
export const mediaDelete = params =>
  BaseXHR.$post('/corepulse/cms/api/asset/delete?' + params);
export const mediaPermissionApi = params =>
  BaseXHR.$get('/corepulse/cms/api/media/get-asset-permission?' + params);
