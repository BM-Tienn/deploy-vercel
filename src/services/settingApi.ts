import { BaseXHR } from 'utils/axios';
import { objectType } from 'utils/types/const';

export const getListObject = (params?: string) =>
  BaseXHR.$get('/corepulse/cms/api/setting/object?' + params);
export const updateSettingObject = (query?: string, params?: objectType) =>
  BaseXHR.$post('/corepulse/cms/api/setting/object?' + query, params);
export const getListAppearance = () =>
  BaseXHR.$get('/corepulse/cms/api/setting/appearance');
export const updateSettingAppearance = (params?: objectType) =>
  BaseXHR.$post('/corepulse/cms/api/setting/appearance', params);
export const getListUser = () =>
  BaseXHR.$get('/corepulse/cms/api/setting/user');
export const updateSettingUser = (params?: objectType) =>
  BaseXHR.$post('/corepulse/cms/api/setting/user', params);
export const updateEditObjectTable = (params?: objectType) =>
  BaseXHR.$post('/corepulse/cms/api/setting/edit-object', params);
export const getAllData = () =>
  BaseXHR.$get('/corepulse/cms/api/app/get-option');
export const getAllPermission = () =>
  BaseXHR.$get('/corepulse/cms/api/app/get-data-permission');
