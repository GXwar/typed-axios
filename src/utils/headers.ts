import { isPlainObject, deepMerge } from './type_check';
import { Method } from '../types/index';

/**
 * Normalize headers name
 * @param headers
 * @param normalizedName
 */
const normalizeHeaderName = (headers: any, normalizedName: string): void => {
  if (!headers) return;
  Object.keys(headers).forEach(name => {
    // convert name to normalizedName
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name];
      delete headers[name];
    }
  })
};

/**
 * If data is a plain object, we set 'Content-Type' as 'application/json;charset=utf-8';
 * @param headers
 * @param data
 */
export const processHeaders = (headers: any, data: any): any => {
  normalizeHeaderName(headers, 'Content-Type');

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8';
    }
  }

  return headers;
};

export const parseHeaders = (headers: string): any => {
  let parsed = Object.create(null);
  if (headers.length === 0) {
    return parsed;
  }
  // get headers line by line, then add key - value pair to the parsed object
  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':');
    key = key.trim().toLowerCase();
    if (!key) return;
    if (val) {
      val = val.trim();
    }
    parsed[key] = val;
  });
  return parsed;
}

export const flattenHeaders = (headers: any, method: Method): any => {
  if (!headers) {
    return headers;
  }
  headers = deepMerge(headers.common, headers[method], headers);
  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];
  methodsToDelete.forEach(method => {
    delete headers[method];
  });
  return headers;
};
