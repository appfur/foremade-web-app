import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/foremadeWebApp',
});

export default api;