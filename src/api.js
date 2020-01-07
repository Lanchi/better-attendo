import axios from 'axios';

const http = axios.create({
  baseURL: 'https://attendo.ba/attendo',
  timeout: 10000,
});

export default {
  login(credentials) {
    const payload = new FormData();
    payload.append('j_username', credentials.username);
    payload.append('j_password', credentials.password);
    return http.post('/security_check', payload).then((result) => result.data);
  },
  getDailyData() {

  },
};
