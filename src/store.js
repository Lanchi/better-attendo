import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentSession: null,
    entries: [],
    remainingTime: null,
    totalBreak: null,
    totalWorkTime: null,
    user: null,
  },
  getters: {
    user: state => state.user,
    entries: state => state.entries,
    workingInfo: state => ({
      currentSession: state.currentSession,
      totalBreak: state.totalBreak,
      totalWorkTime: state.totalWorkTime,
      remainingTime: state.remainingTime,
    }),
  },
  actions: {
    login({ commit }, data) {
      return api.login(data).then((result) => {
        const user = {
          username: result.username,
          password: result.password,
        };

        commit('SET_USER', user);
        commit('SET_ENTRIES', result.entries);
        commit('SET_WORKING_INFO', {
          currentSession: result.currentSession,
          totalBreak: result.totalBreak,
          totalWorkTime: result.totalWorkTime,
          remainingTime: result.remainingTime,
        });

        return result;
      });
    },
  },
  mutations: {
    SET_USER(state, data) {
      state.user = data;
    },
    SET_ENTRIES(state, data) {
      state.entries = data;
    },
    SET_WORKING_INFO(state, data) {
      state.currentSession = data.currentSession;
      state.totalBreak = data.totalBreak;
      state.totalWorkTime = data.totalWorkTime;
      state.remainingTime = data.remainingTime;
    },
  },
});