import { BaseXHR } from 'utils/axios';
import { objectType } from 'utils/types/const';

export const siteMapGetSetting = () =>
  BaseXHR.$get('/corepulse/cms/api/sitemap/setting');
export const siteMapPostSetting = (params?: objectType) =>
  BaseXHR.$post('/corepulse/cms/api/sitemap/setting', params);
