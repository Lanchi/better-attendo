import axios from 'axios';

const http = axios.create({
  baseURL: 'https://attendo.ba/attendo',
  timeout: 10000,
});

export default {
  login(credentials) {
    return http.post('/')
  },
  getDailyData() {

  },
};
