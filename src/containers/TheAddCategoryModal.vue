<template>
  <form ref="self"
        class="the-add-category-modal"
        @submit.prevent="onSubmitForm">
    <div class="the-add-category-modal__window" v-click-outside="onCloseModal">
      <h2 class="the-add-category-modal__headline"> Новая категория </h2>
      <base-input class="mb-16px"
                  legend="Название"
                  :error="$v.categoryName.$error"
                  :error-message="getCategoryNameErrorMessage"
                  :value="categoryName"
                  @input="onNameChange"/>
      <base-select v-if="parentOptions.length > 0"  class="mb-16px"
                   legend="Родительская карточка (необязательно)"
                   :value="selectedParent"
                   @input="onParentInputChange"
                   :error="$v.selectedParent.$error"
                   :error-message="selectedParentErrorMessage"
                   :options="parentOptions"
                   :option-highlighted-index="firstOptionThatContainsParent"
      />
      <base-multi-select legend="Вложенные статьи"
                         :value="searchQuery"
                         @input="onArticlesInputChange"
                         @option-selected="onArticleSelected"
                         @option-deleted="onArticleUnselected"
                         :error="$v.searchQuery.$error"
                         :error-message="getSearchQueryErrorMessage"
                         :options="articlesOptions"
                         :selected-options="articlesSelectedOptions"
                         :option-highlighted-index="firstArticleThatContainsQuery"
                         :class="['mb-350px']"
      />

      <hr class="the-add-category-modal__divider" color="#BFC3D5" width="100%">

      <div class="the-add-category-modal__controls">
        <BaseActionButton class="mr-24px"
                          text="Сохранить"
                          type="submit"
                          :disabled="categoryName && $v.categoryName.$error"
                          :bg="true"/>
        <BaseCancelButton @onButtonClicked="onCloseModal"
                          text="Отмена"
                          :bg="true"/>
      </div>
    </div>
  </form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import vClickOutside from 'v-click-outside';
import findCategory from '../mixins/findCategory';
import toggleBodyOverflow from '../mixins/toggleBodyOverflow';
import BaseMultiselectHandlers from '../mixins/BaseMultiselectHandlers';

import {
  isNotEmpty,
  checkParentExistence,
  isOptionStartWithQuery,
  isArticleExists,
  isArticleSelected,
  checkCategoryExistence,
} from '../validators';

export default {
  directives: {
    clickOutside: vClickOutside.directive,
  },
  mixins: [findCategory, toggleBodyOverflow, BaseMultiselectHandlers],
  data() {
    return {
      categoryName: '',
      selectedParent: '',
      selectedParentErrorMessage: 'Нет такой категории',
      parentOptions: [],
      parentTimer: null,
      searchQuery: '',
      selectedArticlesError: false,
      articlesOptions: [],
      articlesSelectedOptions: [],
      searchQueryTimer: null,
      isOptionAdded: false,
      isSubmitted: false,
      lastAction: null,
      isEdited: false,
    };
  },
  validations() {
    const validationsObject = {
      categoryName: {
        isNotEmpty,
        checkCategoryExistence: checkCategoryExistence('parentOptions'),
      },
      selectedParent: {
        checkParentExistence,
      },
      searchQuery: {
        isOptionStartWithQuery,
      },
    };
    if (this.lastAction === 'optionAdded') {
      validationsObject.searchQuery = {
        isArticleExists,
        isArticleSelected,
      };
    } else if (this.isEdited) {
      validationsObject.categoryName = {
        isNotEmpty,
        checkCategoryExistence: checkCategoryExistence(
          'parentOptions',
          this.getEditedCategory().category.name,
        ),
      };
    } else if (this.lastAction === 'formSubmitted') {
      validationsObject.searchQuery = {};
    }
    return validationsObject;
  },
  methods: {
    onNameChange(value) {
      this.categoryName = value;
      this.$v.categoryName.$touch();
    },
    onParentInputChange(value) {
      this.$v.selectedParent.$reset();
      this.selectedParent = value;
      if (this.parentTimer) {
        clearTimeout(this.parentTimer);
      }
      this.parentTimer = setTimeout(() => this.onSelectedParentTouch(), 1000);
    },
    onSelectedParentTouch() {
      this.$v.selectedParent.$touch();
    },
    onArticleSelected(value) {
      this.lastAction = 'optionAdded';
      this.searchQuery = value;
      this.$v.searchQuery.$touch();

      if (!this.$v.searchQuery.$error && value !== '') {
        this.articlesSelectedOptions.push(value);
        this.articlesSelectedOptions.sort();
        this.searchQuery = '';
      }
    },
    onCloseModal() {
      this.$store.commit('deleteEditedCategory');
      this.$store.commit('modal/close');
    },
    marArticlesNamesToId(articleNames) {
      return articleNames.map((articleName) => {
        const data = this.$store.state.articles.find((article) => article.headline === articleName);
        return data.id;
      });
    },
    createNewCategory() {
      return {
        name: this.categoryName,
        articlesIds: this.marArticlesNamesToId(this.articlesSelectedOptions),
        children: this.isEdited ? [...this.getEditedCategory().category.children] : [],
      };
    },
    copyObject(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    insertCategory(categories, category) {
      let result = null;
      if (this.isEdited) {
        result = this.insertEditedCategory(categories, category);
      } else {
        result = this.insertNewCategory(categories, category);
      }
      return result;
    },
    isCategoryHaveParent() {
      return this.selectedParent;
    },
    insertEditedCategory(categories, category) {
      const categoriesCopy = this.copyObject(categories);
      return this.isCategoryHaveParent() ? this.insertAsChildCategory(categoriesCopy)
        : this.insertAsRootElement(categoriesCopy, category);
    },
    insertAsRootElement(categoriesCopy, category) {
      const categoryPrevName = this.getEditedCategory().category.name;
      const {
        parent: parentTreeNode,
      } = this.findCategory(categoriesCopy, categoryPrevName);
      if (parentTreeNode) {
        const oldCategoryIndex = parentTreeNode.children.findIndex((categoryCopy) => {
          return categoryCopy.name === categoryPrevName;
        });
        const transferredTreeNode = parentTreeNode.children.splice(oldCategoryIndex, 1);
        categoriesCopy.push(transferredTreeNode[0]);
      } else {
        const oldCategoryIndex = categoriesCopy.findIndex((categoryCopy) => {
          return categoryCopy.name === categoryPrevName;
        });
        categoriesCopy.splice(oldCategoryIndex, 1, category);
      }
      return categoriesCopy;
    },
    insertAsChildCategory(categoriesCopy) {
      const { parent: oldParent } = this.findCategory(
        categoriesCopy,
        this.getEditedCategory().category.name,
      );
      const { category: newParentNode } = this.findCategory(
        categoriesCopy,
        this.selectedParent,
      );

      const parentProperty = oldParent ? oldParent.children : categoriesCopy;
      const indexOfTransferredTreeNode = parentProperty.findIndex((categoryCopy) => {
        return categoryCopy.name === this.getEditedCategory().category.name;
      });
      const transferredNode = parentProperty.splice(indexOfTransferredTreeNode, 1);
      newParentNode.children.push(transferredNode[0]);
      return categoriesCopy;
    },
    insertNewCategory(categories, category) {
      const categoriesCopy = this.copyObject(categories);
      if (this.selectedParent) {
        const categoryData = this.findCategory(categoriesCopy, this.selectedParent);
        categoryData.category.children.push(category);
      } else {
        categoriesCopy.push(category);
        categoriesCopy.sort();
      }
      return categoriesCopy;
    },
    onSubmitForm() {
      this.lastAction = 'formSubmitted';
      this.$v.$touch();

      if (!this.$v.$invalid) {
        const newCategory = this.createNewCategory();
        const newCategories = this.copyObject(this.getCategories());
        const newCategoriesAfterInsertion = this.insertCategory(newCategories, newCategory);
        this.addNewCategory(newCategoriesAfterInsertion);
        localStorage.setItem('categories', JSON.stringify(this.$store.state.categories));
        this.$store.commit('modal/close');
      }
    },
    onCloseModalViaKeyboard(e) {
      if (e.code === 'Escape') {
        this.$store.commit('modal/close');
      }
    },
    getCategoryNames(categories, storage) {
      return categories.reduce((acc, cur) => {
        acc.push(cur.name);
        if (cur.children.length) {
          this.getCategoryNames(cur.children, acc);
        }
        return acc;
      }, storage);
    },
    ...mapActions(['addNewCategory', 'setEditedCategory']),
    ...mapGetters(['getCategories', 'getEditedCategory']),
  },
  computed: {
    ...mapState({
      getArticles(state) {
        return state.articles;
      },
    }),
    getCategoryNameErrorMessage() {
      const errors = {
        isNotEmpty: 'Поле обязательно к заполнению',
        checkCategoryExistence: 'Такое название существует.',
      };

      const errorKey = ['isNotEmpty', 'checkCategoryExistence'].find((key) => {
        return this.$v.categoryName[key] === false;
      });

      return errors[errorKey];
    },
    getSelectedParentError() {
      const errors = {
        checkParentExistence: 'Нет такой категории',
      };

      const errorKey = ['checkParentExistence'].find((key) => {
        return this.$v.selectedParent[key] === false;
      });
      return errors[errorKey];
    },
    getSearchQueryErrorMessage() {
      const errors = {
        isOptionStartWithQuery: 'Нет такой статьи',
        isArticleExists: 'Нет такой статьи',
        isArticleSelected: 'Статья уже выбрана',
        isNotEmpty: 'Поле обязательно к заполнению',
      };

      const errorKey = [
        'isOptionStartWithQuery',
        'isNotEmpty',
        'isArticleExists',
        'isArticleSelected',
      ].find((key) => {
        return this.$v.searchQuery[key] === false;
      });

      return errors[errorKey];
    },
    firstOptionThatContainsParent() {
      if (!this.selectedParent) {
        return -1;
      }
      return this.parentOptions.findIndex((pOption) => pOption.includes(this.selectedParent));
    },
  },
  mounted() {
    window.addEventListener('keypress', this.onCloseModalViaKeyboard);
    this.toggleBodyOverflow();
    this.$refs.self.style.top = `${window.pageYOffset}px`;
  },
  beforeDestroy() {
    window.removeEventListener('keypress', this.onCloseModalViaKeyboard);
    this.toggleBodyOverflow();
    this.setEditedCategory(null);
  },
  watch: {
    '$store.state.articles': {
      handler(newValue) {
        const articleKeys = newValue.map((article) => article.headline);
        this.articlesOptions = articleKeys;
      },
      immediate: true,
    },
    '$store.state.categories': {
      handler(newCategories) {
        this.parentOptions = this.getCategoryNames(newCategories, []);
      },
      immediate: true,
    },
    '$store.state.editedCategory': {
      handler(newEditedCategory) {
        if (newEditedCategory === null) {
          return;
        }
        this.categoryName = newEditedCategory?.category?.name;
        this.selectedParent = newEditedCategory?.parent?.name || '';
        const { articles } = this.$store.state;
        this.articlesSelectedOptions = newEditedCategory.category.articlesIds.map((id) => {
          return articles[id - 1].headline;
        });
        const indexOfSelf = this.parentOptions.findIndex((option) => option === this.categoryName);
        this.parentOptions.splice(indexOfSelf, 1);
        this.isEdited = true;
      },
      immediate: true,
    },
  },
};
</script>

<style>
  .the-add-category-modal {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100vh;
    background-color: rgba(10, 14, 32, 0.4);
    overflow-y: scroll;
  }
  .the-add-category-modal__window {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 826px;
    padding: 32px 32px 24px 32px;
    margin: 55px auto;
    background-color: #FFFFFF;
    border-radius: 10px;
  }

  .the-add-category-modal__headline {
    margin-top: 0px;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
  }

  .the-add-category-modal__divider {
    color: #BFC3D5;
    margin-bottom: 16px;
  }

  .the-add-category-modal__controls {
    display: flex;
    margin-bottom: 24px;
  }
</style>
