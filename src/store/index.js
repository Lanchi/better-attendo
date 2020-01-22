import Vue from 'vue';
import Vuex from 'vuex';
import { toNumber } from 'lodash';
import { Base64 } from 'js-base64';
import utf8 from 'utf8';
import { format } from 'date-fns';
import api from '@/api';
import authPlugin from './authPlugin';

Vue.use(Vuex);

// Parse format like 3H23M33S to 3:23:33
const parseTimeFormat = (data) => {
  const timeParts = [];
  let raw = data.split('H');
  timeParts.push(raw[0]);

  if (!raw[1]) return timeParts[0];

  raw = raw[1].split('M');
  timeParts.push(toNumber(raw[0].replace('-', '')));

  if (!raw[1]) return timeParts.join(':');

  timeParts.push(toNumber(raw[1].split('S')[0].replace('-', '')));

  return timeParts.join(':');
};

// Returns a sum of provided time entries, e.g. weekly and current day work time
const calculateFullWorkTime = (target, entry) => {
  const todayParts = entry.split(':');
  const weekParts = target.split(':');
  const todayMapper = {
    hours: todayParts[0] || 0,
    minutes: todayParts[1] || 0,
    seconds: todayParts[2] || 0,
  };
  const weekMapper = {
    hours: weekParts[0] || 0,
    minutes: weekParts[1] || 0,
    seconds: weekParts[2] || 0,
  };

  const result = [];

  const totalSeconds = Number(weekMapper.seconds) + Number(todayMapper.seconds);
  if (totalSeconds >= 60) {
    const secondsDiff = totalSeconds - 60;
    result.push(secondsDiff);
    weekMapper.minutes++;
  } else {
    result.push(totalSeconds);
  }

  const totalMinutes = Number(weekMapper.minutes) + Number(todayMapper.minutes);
  if (totalMinutes >= 60) {
    const minutesDiff = totalMinutes - 60;
    result.unshift(minutesDiff);
    weekMapper.hours++;
  } else {
    result.unshift(totalMinutes);
  }

  const totalHours = Number(weekMapper.hours) + Number(todayMapper.hours);
  result.unshift(totalHours);

  return result.join(':');
};

// Calculates the diff between provided time entries, e.g. target and current weekly work time
const calculateRemainingFullWorkTime = (target, entry) => {
  const currentParts = entry.split(':');
  const currentMapper = {
    hours: currentParts[0] || 0,
    minutes: currentParts[1] || 0,
    seconds: currentParts[2] || 0,
  };
  const targetMapper = {
    hours: target,
    minutes: 60,
    seconds: 60,
  };

  if (currentMapper.hours >= targetMapper.hours) {
    return 'Good job! You did your time.';
  }

  const result = [];

  const diffSeconds = targetMapper.seconds - currentMapper.seconds;
  result.push(diffSeconds);
  currentMapper.minutes++;

  const diffMinutes = targetMapper.minutes - currentMapper.minutes;
  result.unshift(diffMinutes);
  currentMapper.hours++;

  result.unshift(targetMapper.hours - currentMapper.hours);

  return result.join(':');
};

export default new Vuex.Store({
  state: {
    currentSession: null,
    entries: [],
    remainingTime: null,
    totalBreak: null,
    totalWorkTime: null,
    user: null,
    historyRecords: {},
    weeklyAggregates: {},
  },
  getters: {
    user: (state) => state.user,
    entries: (state) => state.entries,
    weeklyAggregates: (state) => state.weeklyAggregates,
    workingInfo: (state) => ({
      currentSession: state.currentSession,
      totalBreak: state.totalBreak,
      totalWorkTime: state.totalWorkTime,
      remainingTime: state.remainingTime,
      estimatedEndTime: state.estimatedEndTime,
    }),
    historyRecord: (state) => (date) => state.historyRecords[date],
  },
  actions: {
    login({ commit, dispatch, getters }, data) {
      return api.login(data).then((result) => {
        const user = {
          username: data.username,
          password: data.password,
        };

        const currentTime = format(new Date(), 'hh:mm:ss');
        // eslint-disable-next-line
        if (!getters.user || !getters.user.username) Sentry.captureException(new Error(user.username));

        commit('SET_USER', user);
        commit('SET_ENTRIES', result.entries);
        commit('SET_WORKING_INFO', {
          currentSession: result.currentSession,
          totalBreak: result.totalBreak,
          totalWorkTime: result.totalWorkTime,
          remainingTime: result.remainingTime,
          estimatedEndTime: result.remainingTime.indexOf('-') >= 0
            ? 'Good job! You did your time.' : calculateFullWorkTime(currentTime, result.remainingTime),
        });

        dispatch('parseAggregates', result);

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
    parseAggregates({ commit }, data) {
      const { intervalClosed } = data;
      const date = new Date();
      const formattedWork = parseTimeFormat(data.cumulativeCalculated);
      const formattedWorkPeriod = parseTimeFormat(data.workPeriod);

      // weekly target
      const target = date.getDay() * formattedWorkPeriod;

      // weekly work - when interval is closed, it already contains correct data
      // when interval is open, we need to add current daily work
      const fullWorkTime = intervalClosed ? formattedWork
        : calculateFullWorkTime(formattedWork, data.totalWorkTime);

      const aggregates = {
        target,
        current: fullWorkTime,
        difference: calculateRemainingFullWorkTime(target, fullWorkTime),
      };
      commit('SET_AGGREGATES', aggregates);
    },
  },
  mutations: {
    SET_AGGREGATES(state, data) {
      state.weeklyAggregates = data;
    },
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
      state.estimatedEndTime = data.estimatedEndTime;
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
