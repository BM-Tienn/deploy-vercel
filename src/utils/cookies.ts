import cookie from 'react-cookies';
import { objectType } from './types/const';

export const getAllCookies = () => cookie.loadAll();

export const selectCookies = (regex: RegExp) => cookie.select(regex);

export const getCookie = (key: string) => cookie.load(key);

export const setCookie = (
  key: string,
  value: string,
  options: objectType = { path: '/' },
  // @ts-ignore
) => cookie.save(key, value);

export const removeCookie = (
  key: string,
  options: objectType = { path: '/' },
) => cookie.remove(key);
