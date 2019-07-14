import xhr from './xhr';
import { AxiosRequestConfig, AxiosPromise } from './types';
import { buildURL } from './utils/url';
import { transformRequest } from './utils/data';
import { processHeaders } from './utils/headers';

/**
 * Get url and params from config, then build url
 * @param config - AxiosRequestConfig
 */
const transformURL = (config: AxiosRequestConfig): string => {
  const {
    url,
    params
  } = config;
  return buildURL(url, params);
};

/**
 * Process data part
 * @param config
 */
const transformRequestData = (config: AxiosRequestConfig): any => {
  return transformRequest(config.data);
}

const transformHeaders = (config: AxiosRequestConfig): any => {
  const {
    headers = {},
    data
  } = config;
  return processHeaders(headers, data);
}

/**
 * Process Request Config before use it
 * @param config - AxiosRequestConfig
 */
const processConfig = (config: AxiosRequestConfig): void => {
  config.url = transformURL(config);
  // here we need to handle headers before data,
  // because it depends on data which will be change in transformRequestData function
  config.headers = transformHeaders(config);
  config.data = transformRequestData(config);
};

const axios = (config: AxiosRequestConfig): AxiosPromise => {
  processConfig(config);
  return xhr(config);
};

export default axios;
