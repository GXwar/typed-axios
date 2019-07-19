import xhr from './xhr';
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types';
import { buildURL, combineURL, isAbsoluteURL } from '../helpers/url';
import { flattenHeaders } from '../helpers/headers';
import transform from './transform';

/**
 * Get url and params from config, then build the wholeurl
 * @param config - AxiosRequestConfig
 */
export const transformURL = (config: AxiosRequestConfig): string => {
  let { url, params, paramsSerializer, baseURL } = config;
  if (baseURL && url && !isAbsoluteURL(url)) {
    url = combineURL(baseURL, url);
  }
  // url is always non-null
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  return buildURL(url!, params, paramsSerializer);
};

const transformResponseData = (res: AxiosResponse): AxiosResponse => {
  res.data = transform(res.data, res.headers, res.config.transformResponse);
  return res;
};

/**
 * Process Request Config before use it
 * @param config - AxiosRequestConfig
 */
const processConfig = (config: AxiosRequestConfig): void => {
  config.url = transformURL(config);
  // process headers and data
  config.data = transform(config.data, config.headers, config.transformRequest);
  // config.method is always non-null
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  config.headers = flattenHeaders(config.headers, config.method!);
};

const dispatchRequest = (config: AxiosRequestConfig): AxiosPromise => {
  processConfig(config);
  return xhr(config).then(res => {
    return transformResponseData(res);
  });
};

export default dispatchRequest;
