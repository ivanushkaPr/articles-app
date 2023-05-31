import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    articles: [],
    categories: [],
  },
  mutations: {
    setArticles(state, articles) {
      state.articles = articles;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    addCategory(state, payload) {
      state.categories.push(payload);
    },
  },
  actions: {
  },
  modules: {
    modal: {
      namespaced: true,
      state: {
        isVisible: false,
      },
      mutations: {
        close(state) {
          state.isVisible = false;
        },
        open(state) {
          state.isVisible = true;
        },
      },
    },
  },
});
