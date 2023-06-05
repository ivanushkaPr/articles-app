<template>
  <form ref="self"
        class="the-delete-category-modal"
        @submit.prevent="onDeleteCategory">
    <section class="the-delete-category-modal__window"
             v-click-outside="onCloseDeleteModal">
      <h2 class="the-delete-category-modal__headline"> Удалить категорию? </h2>
      <p class="the-delete-category-modal__description"> Все дочерние категории удалятся. </p>
      <div class="the-delete-category-modal__controls">
        <BaseActionButton text="Удалить"/>
        <BaseCancelButton text="Отмена" @onButtonClicked="onCloseDeleteModal"/>
      </div>
    </section>
  </form>
</template>

<script>
import { mapActions } from 'vuex';
import vClickOutside from 'v-click-outside';
import findCategory from '../mixins/findCategory';
import toggleBodyOverflow from '../mixins/toggleBodyOverflow';

export default {
  directives: {
    clickOutside: vClickOutside.directive,
  },
  mixins: [findCategory, toggleBodyOverflow],
  methods: {
    ...mapActions(['deleteModal/closeModal', 'addNewCategory']),
    copyObject(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    getCategories() {
      return this.$store.getters.getCategories;
    },
    getEditedCategoryName() {
      return this.$store.getters.getEditedCategory.category.name;
    },
    onDeleteCategory() {
      const categoriesCopy = this.copyObject(this.getCategories());
      const { category, parent } = this.findCategory(categoriesCopy, this.getEditedCategoryName());
      const newCategoriesAfterDeletion = this.deleteCategory(categoriesCopy, parent, category);
      this.addNewCategory(newCategoriesAfterDeletion);
      this['deleteModal/closeModal']();
    },
    deleteCategory(categoriesCopy, parentCategory, deletedCategory) {
      if (!parentCategory) {
        const index = categoriesCopy.findIndex((cat) => cat.name === deletedCategory.name);
        categoriesCopy.splice(index, 1);
      } else {
        const childNodes = parentCategory.children;
        const index = childNodes.findIndex((cat) => cat.name === deletedCategory.name);
        parentCategory.children.splice(index, 1);
      }
      return categoriesCopy;
    },
    onCloseDeleteModal() {
      this['deleteModal/closeModal']();
    },
  },
  mounted() {
    this.toggleBodyOverflow();
    this.$refs.self.style.top = `${window.pageYOffset}px`;
  },
  beforeDestroy() {
    this.toggleBodyOverflow();
  },
};
</script>

<style scoped>
  .the-delete-category-modal {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100vh;
    background-color: rgba(10, 14, 32, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: scroll;
  }

  .the-delete-category-modal__window {
    padding: 32px 64px 46px;
    width: 432px;
    box-sizing: border-box;
    border-radius: 10px;
    background: #FFFFFF;
    box-shadow: inset 0px -6px 0px #EAF4FE;
  }

  .the-delete-category-modal__headline {
    margin-bottom: 4px;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #303446;
  }

  .the-delete-category-modal__description {
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    color: #6A6E7E;
  }

  .the-delete-category-modal__controls{
    display: flex;
    justify-content: space-between;
    width: 240px;
    margin: 0 auto;
  }
</style>
