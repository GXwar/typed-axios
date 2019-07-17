const toString = Object.prototype.toString;

export const isDate = (val: any): val is Date => {
  return toString.call(val) === '[object Date]';
};

/* eslint-disable-next-line @typescript-eslint/ban-types */
export const isPlainObject = (val: any): val is Object => {
  return toString.call(val) === '[object Object]';
};

export const isFormData = (val: any): val is FormData => {
  return typeof val != 'undefined' && val instanceof FormData;
};

export const isURLSearchParams = (val: any): val is URLSearchParams => {
  return typeof val != 'undefined' && val instanceof URLSearchParams;
};

export const extend = <T, U>(to: T, from: U): T & U => {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any;
  }
  return to as T & U;
};

export const deepMerge = (...objs: any[]): any => {
  const result = Object.create(null);

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key];
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val);
          } else {
            result[key] = deepMerge(val);
          }
        } else {
          result[key] = val;
        }
      });
    }
  });
  return result;
};
