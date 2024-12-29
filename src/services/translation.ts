import { BaseXHR } from 'utils/axios';
export const translationListing = params =>
  BaseXHR.$get('/corepulse/cms/api/translations/listing?' + params);
export const translationCreate = params =>
  BaseXHR.$post('/corepulse/cms/api/translations/create?' + params);
export const translationUpdate = params =>
  BaseXHR.$post('/corepulse/cms/api/translations/update', params);
export const translationDelete = params =>
  BaseXHR.$post('/corepulse/cms/api/translations/delete?' + params);
