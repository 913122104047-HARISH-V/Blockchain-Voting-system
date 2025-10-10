import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Change to your backend API prefix
  withCredentials: true // If you need cookies/JWT
});

export default api;
