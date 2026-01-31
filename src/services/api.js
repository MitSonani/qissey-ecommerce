/**
 * Base API Client Centralized network layer configuration
 * Supports interceptors, base URL handling, and common error management.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

const apiClient = async (endpoint, { body, ...customConfig } = {}) => {
    const headers = { 'Content-Type': 'application/json' };
    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await window.fetch(`${BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (response.ok) {
            return data;
        }

        throw new Error(data.message || 'Network response was not ok');
    } catch (error) {
        return Promise.reject(error.message || 'Something went wrong');
    }
};

export const api = {
    get: (url, config) => apiClient(url, { ...config, method: 'GET' }),
    post: (url, body, config) => apiClient(url, { ...config, body, method: 'POST' }),
    put: (url, body, config) => apiClient(url, { ...config, body, method: 'PUT' }),
    delete: (url, config) => apiClient(url, { ...config, method: 'DELETE' }),
};

export default apiClient;
