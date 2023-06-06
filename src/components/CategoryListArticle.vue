<template>
  <section class="category-list-article mr-24px mb-24px">
    <div class="category-list-article__popularity mb-8px">
      <base-like-button :isChecked="isLiked"
                        :counter="likes"
                        @input="onChangeLikeCounter"/>
      <base-edit-button/>
    </div>
    <img class="category-list-article__image" :src="img"/>
    <h3 class="category-list-article__headline">{{headline}}</h3>
    <p class="category-list-article__text">{{description}}</p>
  </section>
</template>

<script>
export default {
  name: 'CategoryListArticle',
  props: {
    headline: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      required: false,
    },
    id: {
      type: Number,
      required: true,
    },
    isLiked: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isChecked: false,
    };
  },
  methods: {
    onChangeLikeCounter() {
      this.isChecked = !this.isChecked;
      const operation = this.isChecked ? 'addLike' : 'removeLike';
      this.$store.commit(operation, this.id - 1);
    },
  },
  watch: {
    isLiked(newValue) {
      this.isChecked = newValue;
    },
  },
};
</script>

<style scoped>
.category-list-article {
  padding: 16px 22px;
  background: #FFFFFF;
  border: 1px solid #BFC3D5;
  border-radius: 10px;
  box-sizing: border-box;
  width: 291px;
  min-height: 295px;
}

.category-list-article__popularity {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-list-article__image {
  width: 100%;
  height: 80px;
}

.category-list-article__headline {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #303446;
  margin: 0;
  margin-bottom: 8px;
}

.category-list-article__text {
  /* Временное решение чтобы не разбираться с обрезкой текста */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;

  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #6A6E7E;
  margin: 0;
}

.category-list-article:nth-child(4n) {
  margin-right: 0px;
}
</style>
