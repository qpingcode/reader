import axios from 'axios';

// 创建axios实例
const service = axios.create({
    baseURL: "",    // api的base_url
    timeout: 45000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
    config.headers['authorization'] = '123';    // 从localstorage中取token
    config.headers['Content-Type'] = 'application/json'
    return config;
}, error => {
    Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
    response => {
        if (response.status !== 200 || response.data.error) {
            return Promise.reject(response.data);
        } else {
            return response.data;
        }
    },
    error => {
        return Promise.reject(error);
    },
);

export default service;
