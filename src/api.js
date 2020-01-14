import axios from 'axios';

const http = axios.create({
  baseURL: 'https://attendo-ba.herokuapp.com',
  timeout: 10000,
});

export default {
  login({ username, password }) {
    return http.post('attendo', null, { params: { username, password } })
      .then((result) => {
        return result.data;
      });
  },
  getDailyData() {

  },
};
