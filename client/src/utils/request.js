import axios from "axios";
import { Message } from "element-ui";

const service = axios.create({
    baseURL: '/api',
    timeout: 30000,
    maxRedirects: 0,
});

// request interceptor
service.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
service.interceptors.request.use(
    config => {
        return new Promise((resolve, reject) => {
            resolve(config);
        });
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    },
);

// response interceptor
service.interceptors.response.use(
    response => {
        if (response.request.responseType === 'arraybuffer') {
            return response;
        }
        if (response.headers.location) {
            return { location: response.headers.location, ...response.data };
        }
        return response.data;
    },
    error => {
        if (!error.response) {
            Message({
                message: 'System error',
                type: 'error',
                duration: 5 * 1000,
            });
            return Promise.reject(error);
        }
        Message({
            message: error.response.data.message || `${error.response.status} ${error.response.statusText}`,
            type: 'error',
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    },
);

export default service;