import Vue from 'vue';
import { Base64 } from 'js-base64';
import store from './store';
import router from './router';
import App from './App';
import vuetify from './plugins/vuetify';
// import './registerServiceWorker';

// eslint-disable-next-line
Sentry.init({ dsn: 'https://b3dd75ad8f134c86b471bdea50267efc@sentry.io/1885795' });
Vue.config.productionTip = false;

const app = new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
});

router.onReady(() => {
  const credentials = localStorage.getItem('betterAttendo');

  if (!credentials) {
    if (router.currentRoute.name !== 'Login') {
      router.replace('/').then(() => app.$mount('#app'));
    } else app.$mount('#app');

    return;
  }

  const decodedCredentials = Base64.decode(credentials);
  store.dispatch('login', JSON.parse(decodedCredentials)).then(() => {
    if (router.currentRoute.name !== 'Daily') {
      router.replace('/daily').then(() => app.$mount('#app'));
    } else app.$mount('#app');
  })
    .catch(() => {
      app.$mount('#app');
    });
});
