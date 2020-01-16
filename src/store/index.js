import Vue from 'vue';
import Vuex from 'vuex';
import { Base64 } from 'js-base64';
import utf8 from 'utf8';
import api from '@/api';
import authPlugin from './authPlugin';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentSession: null,
    entries: [],
    remainingTime: null,
    totalBreak: null,
    totalWorkTime: null,
    user: null,
    historyRecords: {},
  },
  getters: {
    user: (state) => state.user,
    entries: (state) => state.entries,
    workingInfo: (state) => ({
      currentSession: state.currentSession,
      totalBreak: state.totalBreak,
      totalWorkTime: state.totalWorkTime,
      remainingTime: state.remainingTime,
    }),
    historyRecord: (state) => (date) => state.historyRecords[date],
  },
  actions: {
    login({ commit }, data) {
      return api.login(data).then((result) => {
        const user = {
          username: data.username,
          password: data.password,
        };

        commit('SET_USER', user);
        commit('SET_ENTRIES', result.entries);
        commit('SET_WORKING_INFO', {
          currentSession: result.currentSession,
          totalBreak: result.totalBreak,
          totalWorkTime: result.totalWorkTime,
          remainingTime: result.remainingTime,
        });

        const userEncoded = {
          username: utf8.encode(data.username),
          password: utf8.encode(data.password),
        };

        localStorage.setItem('betterAttendo', Base64.encode(JSON.stringify(userEncoded)));

        return result;
      });
    },
    getHistoryRecord({ commit, getters }, date) {
      const requestPayload = {
        date,
        ...getters.user,
      };

      return api.getDailyData(requestPayload).then((result) => {
        const payload = {
          date,
          data: result,
        };

        commit('SET_DAILY_DATA', payload);
      });
    },
    getTodayRecord({ dispatch, getters }) {
      return dispatch('login', getters.user);
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
    SET_DAILY_DATA(state, { date, data }) {
      state.historyRecords[date] = {
        entries: data.entries,
        totalWorkTime: data.totalWorkTime,
        totalBreak: data.totalBreak,
      };
    },
  },
  plugins: [
    authPlugin(),
  ],
});
