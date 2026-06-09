import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:2525';

const API = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
