import { BaseXHR } from 'utils/axios';

export const reportListGet = params =>
  BaseXHR.$get('/corepulse/cms/api/report/listing?' + params);
export const reportDetailList = params =>
  BaseXHR.$get('/corepulse/cms/api/report/detail?' + params);
