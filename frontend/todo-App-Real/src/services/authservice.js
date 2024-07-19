

import axios from 'axios';

const API_URL = 'http://localhost:2029/users';

const register = (username, email, password) => {
  return axios.post(`${API_URL}/register`, { username, email, password });
};

const login = (username, password) => {
  return axios.post(`${API_URL}/login`, { username, password });
};

export default {
  register,
  login,
};
