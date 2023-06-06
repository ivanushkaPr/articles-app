<template>
  <section class="the-filtered-articles">
    <h2 class="the-filtered-articles__headline">Найдено: {{ articlesCounter }} статей</h2>
    <div class="the-filtered-articles__article-cards">
      <category-list-article v-for="(article, index) in articlesData"
                             v-bind:key="index"
                             v-bind="article"/>
    </div>
  </section>
</template>

<script>
import CategoryListArticle from './CategoryListArticle.vue';

export default {
  components: {
    CategoryListArticle,
  },
  name: 'the-filtered-articles',
  props: {
    articlesData: {
      type: Array,
      required: true,
    },
    articlesCounter: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>

.the-filtered-articles__headline {
  margin-top: 16px;
  margin-bottom: 16px;
  margin-right: 8px;
  font-size: 24px;
  line-height: 32px;
  color: #303446;
}

.the-filtered-articles__article-cards {
  display: flex;
  flex-wrap: wrap;
}

</style>
