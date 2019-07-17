import { AxiosRequestConfig, AxiosResponse } from '../types';

export class AxiosError extends Error {
  public isAxiosError: boolean;
  public config: AxiosRequestConfig;
  public code?: string | null;
  public request?: any;
  public response?: AxiosResponse;

  public constructor(message: string, config: AxiosRequestConfig, code?: string | null, reqeust?: any, response?: AxiosResponse) {
    super(message);
    this.config = config;
    this.code = code;
    this.request = reqeust;
    this.response = response;
    this.isAxiosError = true;

    // set the prototype explicitly
    Object.setPrototypeOf(this, AxiosError.prototype);
  }
}

// factory function
export const createError = (message: string, config: AxiosRequestConfig, code?: string | null, reqeust?: any, response?: AxiosResponse): AxiosError => {
  const error = new AxiosError(message, config, code, reqeust, response);
  return error;
};
