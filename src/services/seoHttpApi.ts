import { BaseXHR } from 'utils/axios';
import { objectType } from 'utils/types/const';
export const seoMonitorListGet = params =>
  BaseXHR.$get('/corepulse/cms/api/seo/404/listing?' + params);
export const seoMonitorDetail = params =>
  BaseXHR.$get('/corepulse/cms/api/seo/404/detail?' + params);
export const seoMonitorDelete = params =>
  BaseXHR.$post('/corepulse/cms/api/seo/404/delete?' + params);
export const seoRedirectListGet = params =>
  BaseXHR.$get('/corepulse/cms/api/seo/301/listing?' + params);
export const seoRedirectCreate = params =>
  BaseXHR.$post('/corepulse/cms/api/seo/301/add', params);
export const seoRedirectUpdate = (params?: objectType | undefined) =>
  BaseXHR.$post('/corepulse/cms/api/seo/301/update', params);
export const seoRedirectDelete = params =>
  BaseXHR.$post('/corepulse/cms/api/seo/301/delete?' + params);
export const seoRedirectOption = () =>
  BaseXHR.$get('/corepulse/cms/api/seo/301/redirect-type');
export const seoRedirectTypeOption = () =>
  BaseXHR.$get('/corepulse/cms/api/seo/301/redirect-type-option');
export const seoRedirectGetSettingApi = () =>
  BaseXHR.$get('/corepulse/cms/api/seo/301/setting');
export const seoRedirectPostSettingApi = (params?: objectType | undefined) =>
  BaseXHR.$post('/corepulse/cms/api/seo/301/setting', params);
