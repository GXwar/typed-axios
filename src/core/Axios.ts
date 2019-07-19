import { AxiosRequestConfig, AxiosPromise, Method, AxiosResponse, ResolvedFn, RejectedFn } from '../types';
import dispatchRequest, { transformURL } from './dispatchRequest';
import InterceptorManger from './interceptorManager';
import mergeConfig from './mergeConfig';

interface Interceptors {
  request: InterceptorManger<AxiosRequestConfig>;
  response: InterceptorManger<AxiosResponse>;
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise);
  rejected?: RejectedFn;
}

export default class Axios {
  public defaults: AxiosRequestConfig;
  public interceptors: Interceptors;

  public constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig;
    this.interceptors = {
      request: new InterceptorManger<AxiosRequestConfig>(),
      response: new InterceptorManger<AxiosResponse>()
    };
  }

  public request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {};
      }
      config.url = url;
    } else {
      config = url;
    }

    config = mergeConfig(this.defaults, config);

    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      },
    ];

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor);
    });
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor);
    });
    let promise = Promise.resolve(config);
    while (chain.length) {
      // chain is always non-null
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      const { resolved, rejected } = chain.shift()!;
      promise = promise.then(resolved, rejected);
    }
    return promise;
  }

  public get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config);
  }

  public delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config);
  }

  public head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config);
  }

  public options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config);
  }

  public post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config);
  }

  public put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config);
  }

  public patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config);
  }

  public getUri(config?: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config);
    return transformURL(config);
  }

  private _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(Object.assign(config || {}, {
      method,
      url
    }));
  }

  private _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(Object.assign(config || {}, {
      method,
      url,
      data
    }));
  }
}
