import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: {},
  },
  actions: {
    saveUser({ commit }, data) {
      commit('SET_USER', data);
    },
  },
  mutations: {
    SET_USER(state, data) {
      state.user = data;
    },
  },
});

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
