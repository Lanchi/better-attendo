import axios from 'axios';

const http = axios.create({
  baseURL: 'https://attendo-ba.herokuapp.com',
  timeout: 10000,
});

const getUserFormPayload = ({ username, password }) => {
  const payload = new FormData();
  payload.append('username', username);
  payload.append('password', password);

  return payload;
};

export default {
  login(data) {
    const payload = getUserFormPayload(data);

    return http.post('attendo', payload)
      .then((result) => result.data);
  },
  getDailyData(data) {
    const payload = getUserFormPayload(data);
    payload.append('date', data.date);

    return http.post('attendo', payload)
      .then((result) => result.data);
  },
};
