import axios, { AxiosInstance } from "axios";

import { BACKEND_URL } from "./config"
import {
    responseInterceptor,
    responseInterceptorError,
    requestInterceptor,
    requestInterceptorError,
} from "./interceptors";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
    },
    timeout: 1000000,
});

axiosInstance.interceptors.response.use(
    responseInterceptor,
    responseInterceptorError,
);
axiosInstance.interceptors.request.use(
    requestInterceptor,
    requestInterceptorError,);

export default axiosInstance;
