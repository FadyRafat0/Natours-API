import axios from 'axios';

export const BASE_URL = 'http://localhost:2525';

const API = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true,
});

export default API;
