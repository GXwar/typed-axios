import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types';

const xhr = (config: AxiosRequestConfig): AxiosPromise => {
  return new Promise((resolve, reject) => {
    // get data from request config
    const {
      url,
      method = 'get',
      data = null,
      headers,
      responseType
    } = config;
    // build request
    const request = new XMLHttpRequest();
    if (responseType) {
      request.responseType = responseType;
    }
    request.open(method.toUpperCase(), url, true);
    // handle response
    request.onreadystatechange = function () {
      if (this.readyState !== 4) return;
      const response : AxiosResponse = {
        data: responseType === 'text' ? this.responseText : this.response,
        status: this.status,
        statusText: this.statusText,
        headers: this.getAllResponseHeaders(),
        config,
        request
      };
      resolve(response);
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
