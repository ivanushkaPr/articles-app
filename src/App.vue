<template>
  <div id="app">
    <div v-if="isArticlesDownloaded">
      <the-header/>
      <the-stub/>
      <the-add-category-modal v-if="this.$store.state.isAddCategoryModalVisible"/>
    </div>
    <preloader v-else/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TheHeader from './components/TheHeader.vue';
import TheStub from './components/TheStub.vue';
import TheAddCategoryModal from './components/TheAddCategoryModal.vue';
import Preloader from './components/Preloader.vue';

export default {
  name: 'App',
  components: {
    TheHeader,
    TheStub,
    TheAddCategoryModal,
    Preloader,
  },
  data() {
    return {
      text: '',
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
        }, 2000);
      } else {
        alert(`Ошибка HTTP: ${response.status}`);
      }
    },
  },
  computed: {
    ...mapState({
      isArticlesDownloaded: (state) => state.articles.length > 0,
    }),
  },
  async mounted() {
    this.getArticles();
    this.restoreStore();
  },
};
</script>

<style lang="scss">
body {
  margin: 0px;
  font-family: 'Montserrat';
  font-style: normal;
}

#app {
  width: 100vw;
  height: 100vh;
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
