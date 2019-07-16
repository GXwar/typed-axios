import xhr from './xhr';
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types';
import { buildURL } from '../utils/url';
import { transformRequest, transformResponse } from '../utils/data';
import { processHeaders, flattenHeaders } from '../utils/headers';
import transform from './transform';

/**
 * Get url and params from config, then build the wholeurl
 * @param config - AxiosRequestConfig
 */
const transformURL = (config: AxiosRequestConfig): string => {
  const {
    url,
    params
  } = config;
  return buildURL(url!, params);
};

const transformResponseData = (res: AxiosResponse): AxiosResponse => {
  res.data = transform(res.data, res.headers, res.config.transformResponse);
  return res;
}

/**
 * Process Request Config before use it
 * @param config - AxiosRequestConfig
 */
const processConfig = (config: AxiosRequestConfig): void => {
  config.url = transformURL(config);
  // process headers and data
  config.data = transform(config.data, config.headers, config.transformRequest);
  config.headers = flattenHeaders(config.headers, config.method!);
};

const dispatchRequest = (config: AxiosRequestConfig): AxiosPromise => {
  processConfig(config);
  return xhr(config).then(res => {
    return transformResponseData(res);
  });
};

export default dispatchRequest;
