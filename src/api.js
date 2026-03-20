import axios from 'axios';

export const USER_ID = 2;

export const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export const getErrorMessage = (error, fallbackMessage = '요청 처리 중 오류가 발생했습니다.') =>
  error?.response?.data?.message || fallbackMessage;

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
