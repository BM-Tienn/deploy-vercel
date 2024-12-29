import axios, {
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  AxiosInstance,
  AxiosPromise,
} from 'axios';
import qs from 'qs';
import { getCookie, removeCookie } from './cookies';
import { objectType, Token, CsrfToken } from './types/const';
import { globalActions } from 'app/slice';
import { store } from 'store/configureStore';
const onSuccessInterceptorRequest = async (config: AxiosRequestConfig) => {
  const token = await getCookie(Token);
  const csrfToken = await getCookie(CsrfToken);

  if (csrfToken && config && config.headers)
    config.headers['csrfToken'] = `${csrfToken}`;

  if (token && config && config.headers)
    config.headers['CMS-TOKEN'] = `${token}`;

  config.paramsSerializer = (params: any) =>
    qs.stringify(params, {
      arrayFormat: 'brackets',
    });

  return config;
};
const onErrorInterceptorRequest = (error: AxiosError) => Promise.reject(error);
const onErrorInterceptorResponse = (error: AxiosError<objectType>) => {
  if (error.response && error.response.status) {
    // openNotificationWithIcon(
    //   'error',
    //   error.response?.data?.errors?.message
    //     ? error.response?.data?.errors?.key
    //     : 'error',
    //   error.response?.data?.errors?.message
    //     ? error.response?.data?.errors?.message
    //     : '',
    // );

    if (error.response.status === 401) {
      removeCookie(CsrfToken);
      removeCookie(Token);
      store.dispatch(globalActions.clearData());
    }
  }
  return Promise.reject(error);
};
const onSuccessInterceptorResponse = (response: AxiosResponse) => {
  // if (
  //   response.status === 200 &&
  //   response.config.method !== 'get' &&
  //   !response.config.url?.includes('auth') &&
  //   !response.config.url?.includes('notification') &&
  //   !response.config.url?.includes('react') &&
  //   !response.config.url?.includes('checkout/create-cart')
  // ) {
  // }
  return response;
};
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';
axios.defaults.headers.put['Content-Type'] =
  'application/x-www-form-urlencoded';
axios.defaults.headers.post.Accept = 'application/x-www-form-urlencoded';
axios.defaults.headers.put.Accept = 'application/x-www-form-urlencoded';

const _axios: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  timeout: 120 * 1000,
  // withCredentials: true, // Check cross-site Access-Control
});

_axios.interceptors.request.use(
  onSuccessInterceptorRequest,
  onErrorInterceptorRequest,
);

_axios.interceptors.response.use(
  onSuccessInterceptorResponse,
  onErrorInterceptorResponse,
);

/**
 *
 * @NOTE primary methods axios
 *
 */
class AxiosXHRConstructor {
  axiosInstance: AxiosInstance;
  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
    this.$get = this.$get.bind(this);
    this.$post = this.$post.bind(this);
    this.$put = this.$put.bind(this);
    this.$delete = this.$delete.bind(this);
  }
  public $get(
    url: string,
    params?: objectType,
    config?: objectType,
  ): AxiosPromise {
    return this.axiosInstance.get(url, {
      ...{ params },
      ...config,
    });
  }
  public $post(
    url: string,
    data?: objectType,
    config?: objectType,
  ): AxiosPromise {
    return this.axiosInstance.post(url, data, config);
  }
  public $put(
    url: string,
    data?: objectType,
    config?: objectType,
  ): AxiosPromise {
    return this.axiosInstance.put(url, data, config);
  }
  public $delete(url: string, data?: objectType): AxiosPromise {
    // return this.axiosInstance.delete(url, {
    //   data,
    // });

    /**
     * @hotfix {https://github.com/axios/axios/issues/3220}
     */
    return this.axiosInstance.request({
      method: 'delete',
      url,
      data,
    });
  }
}
export const BaseXHR = new AxiosXHRConstructor(_axios);

export default _axios;
