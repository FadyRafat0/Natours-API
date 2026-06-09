import { BASE_URL } from '../api';

/**
 * Image helpers — images now live in the backend
 * so we use absolute paths pointing to the backend server.
 */

export const tourImg = (filename: string) => `${BASE_URL}/img/tours/${filename}`;

export const userImg = (filename: string) => `${BASE_URL}/img/users/${filename}`;

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
