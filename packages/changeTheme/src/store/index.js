import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 2,
  },
  mutations: {
    add: (state, payload) => {
      state.count += payload;
    },
  },
  actions: {
    add: ({ commit }, payload) => {
      setTimeout(() => {
        commit('add', payload);
      }, 2000);
    },
  },
  getters: {
    getCount(state) {
      return state.count;
    },
  },
});
