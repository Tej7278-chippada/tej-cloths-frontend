// src/api.js
import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const fetchProducts = () => API.get('/products');
export const addProduct = (data) => API.post('/products/add/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) => API.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const likeProduct = (id) => API.post(`/products/${id}/like`);
export const addComment = (id, comment) => API.post(`/products/${id}/comment`, comment);
