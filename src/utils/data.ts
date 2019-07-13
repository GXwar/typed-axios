import { isPlainObject } from './type_check';

export const transformRequest = (data: any): any => {
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
};
