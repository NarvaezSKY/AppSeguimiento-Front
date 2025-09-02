import { InternalAxiosRequestConfig } from "axios";

export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = sessionStorage.getItem("token");

  if (token && config.headers) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
};

export const requestInterceptorError = (error: any): Promise<any> => {
  return Promise.reject(error);
};
