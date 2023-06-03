<template>
  <div id="app">
    <div v-if="isArticlesDownloaded" class="wrapper">
      <div class="content">
        <the-add-category-modal v-if="this.$store.state.modal.isVisible"/>
        <the-header/>
        <div v-if="isCategoriesAdded">
          <category-list v-for="(categorie, index) in renderedCategoriesData"
                         :class="['mb-16px']"
                         v-bind="categorie"
                         :open="true"
                         :key="index + categorie.name"/>
        </div>
        <div v-else>
          <the-stub/>
        </div>
      </div>

      <div v-if="isCategoriesAdded" class="footer">
        <base-pagination :currentPage="currentPage"
                         :pagesCounter="numberOfPages"
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
import { mapGetters } from 'vuex';
import TheAddCategoryModal from './components/TheAddCategoryModal.vue';
import TheHeader from './components/TheHeader.vue';
import TheStub from './components/TheStub.vue';
import CategoryList from './components/CategoryList.vue';
import Preloader from './components/Preloader.vue';

export default {
  name: 'App',
  components: {
    TheAddCategoryModal,
    TheHeader,
    TheStub,
    CategoryList,
    Preloader,
  },
  data() {
    return {
      text: '',
      currentPage: 1,
      numberOfPages: null,
      renderedCategoriesData: null,
    };
  },
  methods: {
    restoreStore() {
      const categories = JSON.parse(localStorage.getItem('categories'));
      if (categories) {
        this.$store.commit('setCategories', categories);
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
      this.currentPage = newCurrentPage;
    },
    onDecrementPageCounter() {
      this.currentPage -= 1;
    },
    onIncrementPageCounter() {
      this.currentPage += 1;
    },
  },
  computed: {
    lastCategoryIndex() {
      return this.currentPage * this.$store.state.categoriesPerPage;
    },
    ...mapGetters([
      'isArticlesDownloaded',
      'isCategoriesAdded',
      'getCategories',
      'getCategoriesPerPage',
    ]),
  },
  watch: {
    '$store.state.categories': {
      handler(newCategories) {
        this.numberOfPages = Math.ceil(newCategories.length / this.$store.state.categoriesPerPage);
      },
      immediate: true,
    },
    currentPage: {
      handler(newCurrentPage) {
        let start = (newCurrentPage - 1) * 3;
        const end = newCurrentPage * this.$store.state.categoriesPerPage;
        const renderedCategories = [];
        for (; start < end; start += 1) {
          const category = this.$store.state.categories[start];
          if (!category) {
            break;
          }
          renderedCategories.push(category);
        }

        this.renderedCategoriesData = renderedCategories;
      },
      immediate: true,
    },
  },
  async mounted() {
    this.getArticles();
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
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.content {
  flex: 1 0 auto;
}
.footer {
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

</style>
