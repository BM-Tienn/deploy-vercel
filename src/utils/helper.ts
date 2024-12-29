import { getCookie } from './cookies';
import { Token } from './types/const';

export const auth = () => !!getCookie(Token);
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
export const getFormData = object =>
  Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
  }, new FormData());
