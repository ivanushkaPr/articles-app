import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    articles: [],
    categories: [],
    // add category modal window
    isAddCategoryModalVisible: true,
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
    closeAddCategoryModal(state) {
      state.isAddCategoryModalVisible = false;
    },
    openAddCategoryModal(state) {
      state.isAddCategoryModalVisible = true;
    },
  },
  actions: {
  },
  modules: {
  },
});
