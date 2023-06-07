import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    searchQuery: '',
    categoriesPerPage: 3,
    searchResultsPerPage: 12,
    articles: [],
    categories: [{
      name: 'Категория 1',
      articlesIds: [1, 2, 3, 4],
      children: [{
        name: 'Подкатегория 1',
        articlesIds: [4, 5, 6],
        children: [
          {
            name: 'Подкатегория подкатегории 1',
            articlesIds: [7, 8, 9],
            children: [],
          },
          {
            name: 'Подкатегория подкатегории 2',
            articlesIds: [7, 8, 9],
            children: [],
          },
        ],
      }, {
        name: 'Подкатегория 2',
        articlesIds: [4, 5, 6],
        children: [],
      }],
    }, {
      name: 'Категория 2',
      articlesIds: [1, 2, 3, 4],
      children: [],
    }, {
      name: 'Категория 3',
      articlesIds: [1, 2, 3, 4],
      children: [],
    }, {
      name: 'Категория 4',
      articlesIds: [1, 2, 3, 4],
      children: [],
    }],
    editedCategory: null,
    articleParentCategories: null,
    editedArticleID: null,
  },
  mutations: {
    setArticles(state, articles) {
      state.articles = articles.map((article) => {
        const newArticle = { ...article };
        newArticle.isLiked = false;
        return newArticle;
      });
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setSearchQuery(state, value) {
      state.searchQuery = value;
    },
    addLike(state, index) {
      const newArticle = JSON.parse(JSON.stringify(state.articles[index]));
      newArticle.likes += 1;
      newArticle.isLiked = true;
      state.articles.splice(index, 1, newArticle);
    },
    removeLike(state, index) {
      const newArticle = JSON.parse(JSON.stringify(state.articles[index]));
      newArticle.likes -= 1;
      newArticle.isLiked = false;
      state.articles.splice(index, 1, newArticle);
    },
    changeEditedCategory(state, editedCategory) {
      state.editedCategory = editedCategory;
    },
    deleteEditedCategory(state) {
      state.editedCategory = null;
    },
    changeArticleParentCategory(state, value) {
      state.articleParentCategories = value;
    },
    changeEditedArticleID(state, value) {
      state.editedArticleID = value;
    },
  },
  getters: {
    isArticlesDownloaded(state) {
      return state.articles.length;
    },
    isCategoriesAdded(state) {
      return state.categories.length;
    },
    getCategories(state) {
      return state.categories;
    },
    getCategoriesPerPage(state) {
      return state.categoriesPerPage;
    },
    getEditedCategory(state) {
      return state.editedCategory;
    },
    getSearchQuery(state) {
      return state.searchQuery;
    },
    getFilteredArticles(state) {
      const sqLowerCased = state.searchQuery.toLowerCase();
      return state.articles.filter((article) => {
        return article.headline.toLowerCase().indexOf(sqLowerCased) !== -1;
      }).sort((articleA, articleB) => articleA > articleB);
    },
    getEditedArticleID(state) {
      return state.editedArticleID;
    },
  },
  actions: {
    addNewCategory(context, newCategories) {
      context.commit('setCategories', newCategories);
    },
    setEditedCategory(context, selectedCategory) {
      context.commit('changeEditedCategory', selectedCategory);
    },
    deleteEditedCategory(context) {
      context.commit('deleteEditedCategory');
    },
    updateSearchQuery(context, value) {
      context.commit('setSearchQuery', value);
    },
    setArticleParentCategories(context, value) {
      context.commit('changeArticleParentCategory', value);
    },
    setEditedArticleID(context, value) {
      context.commit('changeEditedArticleID', value);
    },
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
      actions: {
        openModal(context) {
          context.commit('open');
        },
      },
    },
    deleteModal: {
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
      actions: {
        openModal(context) {
          context.commit('open');
        },
        closeModal(context) {
          context.commit('close');
        },
      },
    },
    changeModal: {
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
      getters: {
        getModalState(state) {
          return state.isVisible;
        },
      },
      actions: {
        openModal(context) {
          context.commit('open');
        },
        closeModal(context) {
          context.commit('close');
        },
      },
    },
  },
});
