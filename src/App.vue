<template>
  <div id="app">
    <div v-if="isArticlesDownloaded" class="app__wrapper">
      <div class="app__content">
        <the-add-category-modal v-if="this.$store.state.modal.isVisible"/>
        <the-delete-category-modal v-if="this.$store.state.deleteModal.isVisible"/>
        <the-change-categories-modal v-if="this['changeModal/getModalState']()"/>
        <the-header/>
        <div v-if="isCategoriesAdded">
          <div v-if="getSearchQuery.length === 0">
            <category-list v-for="(category, index) in renderedCategoriesData"
                           :class="['mb-16px']"
                           v-bind="category"
                           :open="true"
                           :key="index"/>
          </div>
          <the-filtered-articles v-else-if="renderedArticlesData.length !== 0"
                                 :articlesData="renderedArticlesData"
                                 :articles-counter="searchResultArticles"/>
          <the-nothing-found-stub v-else/>
        </div>
        <div v-else>
          <the-stub/>
        </div>
      </div>

      <div v-if="getPaginationVisibility" class="app__footer">
        <base-pagination :currentPage="getCurrentPage"
                         :pagesCounter="getNumberOfPages"
                         @pageChange="onPageChange"
                         @goBack="onDecrementPageCounter"
                         @goForward="onIncrementPageCounter"/>
      </div>
    </div>
    <div v-else>
      <preloader/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import TheAddCategoryModal from './components/TheAddCategoryModal.vue';
import TheDeleteCategoryModal from './components/TheDeleteCategoryModal.vue';
import TheChangeCategoriesModal from './components/TheChangeCategoriesModal.vue';
import TheHeader from './components/TheHeader.vue';
import TheStub from './components/TheStub.vue';
import CategoryList from './components/CategoryList.vue';
import TheFilteredArticles from './components/TheFilteredArticles.vue';
import TheNothingFoundStub from './components/TheNothingFoundStub.vue';
import Preloader from './components/Preloader.vue';

export default {
  name: 'App',
  components: {
    TheAddCategoryModal,
    TheDeleteCategoryModal,
    TheChangeCategoriesModal,
    TheHeader,
    TheStub,
    CategoryList,
    TheFilteredArticles,
    TheNothingFoundStub,
    Preloader,
  },
  data() {
    return {
      text: '',
      currentPage: 1,
      numberOfPages: null,
      renderedCategoriesData: null,
      currentSearchResultsPage: 1,
      searchResultsPages: null,
      renderedArticlesData: null,
      searchResultArticles: null,
    };
  },
  methods: {
    restoreStoreLastState() {
      debugger;
      const categories = JSON.parse(localStorage.getItem('categories'));
      if (categories) {
        this.addNewCategory(categories);
      }
    },
    async getArticles() {
      const response = await fetch('articles.json');
      if (response.ok) {
        const json = await response.json();
        setTimeout(() => {
          this.$store.commit('setArticles', json);
        }, 500);
      }
    },
    onPageChange(newCurrentPage) {
      this[this.getChangedPageProp()] = newCurrentPage;
    },
    onDecrementPageCounter() {
      this[this.getChangedPageProp()] -= 1;
    },
    onIncrementPageCounter() {
      this[this.getChangedPageProp()] += 1;
    },
    getChangedPageProp() {
      return !this.$store.state.searchQuery.length ? 'currentPage'
        : 'currentSearchResultsPage';
    },
    collectRenderedData(currentPage, cardsPerPage, data) {
      // При загрузке страницы функция сработает дважды.
      // Необходимо добавить флаг или debounce, чтобы оно не запускалось дважды через watch - ы.
      // Тем не менее накладные расходы очень низкие(3 итерации),
      // поэтому считаю данную оптимизацию чрезмерной.
      let start = (currentPage - 1) * cardsPerPage;
      const end = currentPage * cardsPerPage;
      const renderData = [];

      for (; start < end; start += 1) {
        const category = data[start];
        if (!category) {
          break;
        }
        renderData.push(category);
      }
      return renderData;
    },
    countNumberOfPages(categories, elementsPerPage) {
      return Math.ceil(categories.length / elementsPerPage);
    },
    ...mapActions(['addNewCategory']),
    ...mapGetters([
      'getFilteredArticles',
      'changeModal/getModalState',
    ]),
  },
  computed: {
    ...mapGetters([
      'isArticlesDownloaded',
      'isCategoriesAdded',
      'getCategories',
      'getCategoriesPerPage',
      'getSearchQuery',
    ]),
    getCurrentPage() {
      return !this.$store.state.searchQuery.length ? this.currentPage
        : this.currentSearchResultsPage;
    },
    getNumberOfPages() {
      return !this.$store.state.searchQuery.length ? this.numberOfPages : this.searchResultsPages;
    },
    getPaginationVisibility() {
      return (this.isCategoriesAdded && this.isSearchQueryEmpty)
        || (this.renderedArticlesData.length !== 0 && this.isSearchQueryEmpty !== 0);
    },
    isSearchQueryEmpty() {
      return this.getSearchQuery.length === 0;
    },
  },
  watch: {
    '$store.state.categories': {
      handler(newCategories) {
        this.numberOfPages = this.countNumberOfPages(
          newCategories,
          this.$store.state.categoriesPerPage,
        );
        this.renderedCategoriesData = this.collectRenderedData(
          this.currentPage,
          this.$store.state.categoriesPerPage,
          this.$store.state.categories,
        );
      },
      immediate: true,
      deep: true,
    },
    currentPage: {
      handler(newCurrentPage) {
        this.renderedCategoriesData = this.collectRenderedData(
          newCurrentPage,
          this.$store.state.categoriesPerPage,
          this.$store.state.categories,
        );
      },
      immediate: true,
    },
    '$store.state.searchQuery': {
      handler() {
        const filteredArticles = this.getFilteredArticles();
        this.searchResultsPages = this.countNumberOfPages(
          filteredArticles,
          this.$store.state.searchResultsPerPage,
        );
        this.searchResultArticles = filteredArticles.length;
        this.renderedArticlesData = this.collectRenderedData(
          1,
          this.$store.state.searchResultsPerPage,
          this.getFilteredArticles(),
        );
      },
    },
    currentSearchResultsPage: {
      handler(newSearchResultPage) {
        this.renderedArticlesData = this.collectRenderedData(
          newSearchResultPage,
          this.$store.state.searchResultsPerPage,
          this.getFilteredArticles(),
        );
      },
      immediate: true,
    },
  },
  async mounted() {
    this.getArticles();
    this.restoreStoreLastState();
  },
  updated() {
    // К сожалению не работае в firefox и opera.
    // Для них требуются более сложные танцы с бубнами.
    if (CSS.highlights) {
      const ranges = [];
      const searchQuery = this.getSearchQuery.toLowerCase();
      Array.from(document.body.querySelectorAll('.category-list-article__headline'))
        .forEach((headline) => {
          const textContent = headline.textContent.toLowerCase();
          const index = textContent.indexOf(searchQuery);
          if (index !== -1) {
            const range = new Range();
            debugger;
            range.setStart(headline.firstChild, index);
            range.setEnd(headline.firstChild, index + this.getSearchQuery.length);
            ranges.push(range);
          }
        });
      // eslint-disable-next-line
      const highlight = new Highlight(...ranges);
      CSS.highlights.set('articles-highlights', highlight);
    }
  },
};
</script>

<style lang="scss">

body {
  margin: 0px;
  font-family: 'Montserrat';
  font-style: normal;
}

html,
body {
  height: 100%;
}

.overflow-hidden {
  overflow: hidden;
}

.app__wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.app__content {
  flex: 1 0 auto;
}
.app__footer {
  flex: 0 0 auto;
}

#app {
  width: 100vw;
  height: 100vh;
  max-width: 1236px;
  margin: 0 auto;
}

.preloader {
  width: 36px;
  height: 36px;
  border: 4px solid #ED5252;
  border-radius: 50%;
  border-top-color: transparent;
  transform: rotate(-45deg);
  animation-duration: 100s;
  animation-name: infinite-rotation;
  animation-iteration-count: infinite;
}

@keyframes infinite-rotation {
  from {
    transform: rotate(-10000deg);
  }

  to {
    transform: rotate(0deg);
  }
}

::highlight(articles-highlights) {
  background-color: yellow;
  color: black;
}
</style>
