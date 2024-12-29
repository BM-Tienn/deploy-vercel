import { BaseXHR } from 'utils/axios';
export const loginAPI = data =>
  BaseXHR.$post('/corepulse/cms/api/auth/login', data);
export const logOutAPI = () => BaseXHR.$post('/corepulse/cms/api/auth/logout');
