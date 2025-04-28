import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Uses the environment variable
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
