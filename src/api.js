import axios from 'axios';

const http = axios.create({
  baseURL: 'https://attendo-ba.herokuapp.com',
  timeout: 10000,
});

export default {
  login({ username, password }) {
    const payload = new FormData();
    payload.append('username', username);
    payload.append('password', password);

    return http.post('attendo', payload)
      .then((result) => {
        return result.data;
      });
  },
  getDailyData() {

  },
};
