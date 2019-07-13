import xhr from './xhr';
import { AxiosRequestConfig } from './types';
import { buildURL } from './utils/url';
import { transformRequest } from './utils/data';

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

/**
 * Process Config before use it
 * @param config - AxiosRequestConfig
 */
const processConfig = (config: AxiosRequestConfig): void => {
  config.url = transformURL(config);
  config.data = transformRequestData(config);
};

const axios = (config: AxiosRequestConfig): void => {
  processConfig(config);
  xhr(config);
};

export default axios;
