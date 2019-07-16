import { AxiosRequestConfig, AxiosStatic, AxiosInstance } from './types';
import Axios from './core/Axios';
import { extend } from './helpers/util';
import defaults from './defaults';
import mergeConfig from './core/mergeConfig';

const createInstance = (config: AxiosRequestConfig): AxiosStatic => {
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context);

  extend(instance, context);
  return instance as AxiosStatic;
};

// load default configs for request
const axios = createInstance(defaults);

axios.create = (config?: AxiosRequestConfig): AxiosInstance => {
  return createInstance(mergeConfig(defaults, config));
};

export default axios;
