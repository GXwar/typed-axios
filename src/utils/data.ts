import { isPlainObject } from './type_check';

export const transformRequest = (data: any): any => {
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
};

export const transformResponse = (data: any): any => {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      // TODO
    }
  }
  return data;
};
