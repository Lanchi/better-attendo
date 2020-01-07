import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    user: {},
  },
  actions: {
    saveUser({ commit }, data) {
      commit('SET_USER')
    },
  },
  mutations: {
    SET_USER({ state }, data) {

    },
  },
});

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
