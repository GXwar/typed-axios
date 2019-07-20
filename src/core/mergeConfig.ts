import { AxiosRequestConfig } from '../types';
import { isPlainObject, deepMerge } from '../helpers/util';

/**
 * Default Strategy: if
 * @param val1
 * @param val2
 */
const defaultStrat = (val1: any, val2: any): any => {
  return typeof val2 !== 'undefined' ? val2 : val1;
};

/**
 * Just get value from Val2
 * @param val1
 * @param val2
 */
const fromVal2Strat = (val1: any, val2: any): any => {
  if (typeof val2 !== 'undefined') return val2;
};

const deepMergeStrat = (val1: any, val2: any): any => {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2);
  } else if (typeof val2 !== 'undefined') {
    return val2;
  } else if (isPlainObject(val1)) {
    return deepMerge(val1);
  } else {
    return val1;
  }
};

const strats = Object.create(null);
// For 'url', 'params', 'data' fields, it must be assigned by each request.
// So there we can just get these values for Val2.
const stratKeysFromVal2 = ['url', 'params', 'data'];
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat;
});
// For 'headers', 'auth', we can use deepMergeStrat because it could be assigned for each request.
const stratKeysDeepMerge = ['headers', 'auth'];
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat;
});

/**
 * Config2 is prior than config1. For any key, we always get the value in Config2 unless Config2 doesn't have it
 * @param config1
 * @param config2
 */
const mergeConfig = (config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig => {
  if (!config2) {
    config2 = {};
  }
  // create a empty object whose prototype is null
  const config = Object.create(null);

  // helper function
  const mergeField = (key: string): void => {
    const strategy = strats[key] || defaultStrat;
    // config2 is always non-null, if it doesn't exist, we create a empty object
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    config[key] = strategy(config1[key], config2![key]);
  };

  for (let key in config2) {
    mergeField(key);
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key);
    }
  }

  return config;
};

export default mergeConfig;
