<template>
  <div id="app">
    <div v-if="isArticlesDownloaded">
      {{this.$store.state.articles}}
    </div>
    <Preloader v-else/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Preloader from './components/Preloader.vue';

export default {
  name: 'App',
  components: {
    Preloader,
  },
  computed: {
    ...mapState({
      isArticlesDownloaded: (state) => state.articles.length > 0,
    }),
  },
  async mounted() {
    debugger;
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
};
</script>

<style lang="scss">
body {
  margin: 0px;
}

#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
