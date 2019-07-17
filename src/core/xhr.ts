import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types';
import { parseHeaders } from '../helpers/headers';
import { createError } from '../helpers/error';

const xhr = (config: AxiosRequestConfig): AxiosPromise => {
  return new Promise((resolve, reject) => {
    // get data from request config
    const {
      url,
      method = 'get',
      data = null,
      headers,
      responseType,
      timeout
    } = config;
    // build and set request
    const request = new XMLHttpRequest();
    if (responseType) {
      request.responseType = responseType;
    }
    if (timeout) {
      request.timeout = timeout;
    }
    // url is always non-null
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    request.open(method.toUpperCase(), url!, true);
    // handle response
    request.onreadystatechange = function () {
      if (this.readyState !== 4) return;
      if (this.status === 0) return;
      const response: AxiosResponse = {
        data: responseType === 'text' ? this.responseText : this.response,
        status: this.status,
        statusText: this.statusText,
        headers: parseHeaders(this.getAllResponseHeaders()),
        config,
        request
      };
      if (response.status >= 200 && response.status < 300) {
        resolve(response);
      } else {
        reject(createError(`Request failed with status code ${response.status}`, config, null, request, response));
      }
    };
    // handle network error
    request.onerror = function() {
      reject(createError('Network Error', config, null, request));
    };
    // handle timout error
    request.ontimeout = function() {
      reject(createError(`Timeout of ${timeout} ms exceed`, config, 'ECONNABORTED', request));
    };
    // set header
    Object.keys(headers).forEach(name => {
      // if there is no data, we don't need to set 'Content-Type' attribute for Request
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name];
      } else {
        request.setRequestHeader(name, headers[name]);
      }
    });
    // send request
    request.send(data);
  });
};

export default xhr;
