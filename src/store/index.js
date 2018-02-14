import Vuex from 'vuex';
import Vue from 'vue';
import TimeConverter from '../assets/js/time';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: '',
    alarms: [],
    unread: 0,
    its: [],
  },
  mutations: {
    change(state, user) {
      state.user = user;
    },
    pushAlarm(state, alarm) {
      state.alarms.unshift(alarm);
    },
    increadUnread(state) {
      state.unread += 1;
    },
    setAllAlramsRead(state) {
      state.alarms.forEach((alarm) => {
        alarm.read = true;
      });
      state.unread = 0;
    },
    setAlarmsTime(state) {
      state.alarms.forEach((alarm) => {
        alarm.time = TimeConverter(alarm.timestamp);
      });
    },
    setIts(state, its) {
      state.its = its;
    },
  },
});
