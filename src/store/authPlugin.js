import { Base64 } from 'js-base64';
import router from '@/router';

const scheduleRefresh = (store, interval) => {
  const timeout = setTimeout(() => {
    const credentials = localStorage.getItem('betterAttendo');

    if (!credentials) {
      router.replace('/');
      return;
    }

    const decodedCredentials = Base64.decode(credentials);
    store.dispatch('login', JSON.parse(decodedCredentials));
  }, interval);

  return timeout;
};

export default function createAuthPlugin() {
  return (store) => {
    let refreshTimeoutId = null;

    store.subscribe((mutation) => {
      if (mutation.type === 'SET_USER') {
        clearTimeout(refreshTimeoutId);
        refreshTimeoutId = scheduleRefresh(store, 599000);
      }
    });
  };
}
