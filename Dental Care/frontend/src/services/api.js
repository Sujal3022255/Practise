import axios from 'axios';

const ApiFormData = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

const Api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add token to all requests
Api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

ApiFormData.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors (token expired)
Api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

ApiFormData.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// User APIs
export const createUserApi = (data) => Api.post("/api/user/register", data);
export const loginUserApi = (data) => Api.post("/api/user/login", data);
export const getMe = () => {
    const user = localStorage.getItem('user');
    return Promise.resolve({ data: { user: user ? JSON.parse(user) : null } });
};
export const getUserByIdApi = (id) => Api.get(`/api/user/getUserById/${id}`);
export const updateUserByIdApi = (id, data) => Api.put(`/api/user/updateUserById/${id}`, data);
export const deleteUserByIdApi = (id) => Api.delete(`/api/user/deleteUserById/${id}`);
export const getAllUsersApi = () => Api.get("/api/user/getAllUsers");
export const forgotPasswordApi = (data) => Api.post("/api/user/forgot-password", data);
export const resetPasswordApi = (data) => Api.post("/api/user/reset-password", data);

// Product APIs
export const getAllProductsApi = () => Api.get("/api/product/getAllProducts");
export const createProductApi = (data) => Api.post("/api/product/addProduct", data);
export const deleteProductByIdApi = (id) => Api.delete(`/api/product/deleteProduct/${id}`);
export const updateProductByIdApi = (id, data) => Api.put(`/api/product/updateProduct/${id}`, data);

export default Api;
 