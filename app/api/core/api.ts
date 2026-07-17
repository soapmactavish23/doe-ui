import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export const api = axios.create({
    baseURL: '/api'
});

export const apiUnAuth = axios.create({
    baseURL: '/api'
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export function decodeToken(): JwtPayload | null {
    try {
        const token = getToken();
        if (!token) return null;
        return jwtDecode<JwtPayload>(token);
    } catch (error) {
        console.error('Token inválido:', error);
        return null;
    }
}

export function getToken(): string | null {
    try {
        return localStorage.getItem('access_token');
    } catch (error) {
        console.error('Erro ao recuperar token:', error);
        return null;
    }
}
