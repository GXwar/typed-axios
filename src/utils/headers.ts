import { isPlainObject } from './type_check';

const normalizeHeaderName = (headers: any, normalizedName: string): void => {
  if (!headers) return;
  Object.keys(headers).forEach(name => {
    // convert name to normalizedName
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name];
      delete headers[name];
    }
  })
}

export const processHeaders = (headers: any, data: any): any => {
  normalizeHeaderName(headers, 'Content-Type');

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8';
    }
  }

  return headers;
};
