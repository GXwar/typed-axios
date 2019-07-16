import { AxiosInstance, AxiosRequestConfig } from './types/index';
import Axios from './core/Axios';
import { extend } from './utils/type_check';
import defaults from './defaults';

const createInstance = (config: AxiosRequestConfig): AxiosInstance => {
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context);

  extend(instance, context);
  return instance as AxiosInstance;
};
// load default configs for request
const axios = createInstance(defaults);

export default axios;
