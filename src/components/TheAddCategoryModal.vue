<template>
  <form class="the-add-category-modal" @submit.prevent="onSubmitForm">
    <div class="the-add-category-modal__window">
      <h2 class="the-add-category-modal__headline"> Новая категория </h2>
      <base-input class="mb-16px"
                  legend="Название"
                  :error="$v.categoryName.$error"
                  :error-message="getCategoryNameErrorMessage"
                  :value="categoryName"
                  @input="onNameChange"/>
      <base-select class="mb-16px"
                   legend="Родительская карточка (необязательно)"
                   :value="selectedParent"
                   @input="onParentInputChange"
                   :error="$v.selectedParent.$error"
                   :error-message="selectedParentErrorMessage"
                   :options="parentOptions"
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
                          :bg="true"/>
        <BaseCancelButton @onButtonClicked="onCloseModal"
                          text="Отмена"
                          :bg="true"/>
      </div>
    </div>
  </form>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { debounce } from 'lodash';

import {
  isNotEmpty,
  checkParentExistence,
  isOptionStartWithQuery,
  isArticleExists,
  isArticleSelected,
  isAtLeastOneArticleSelected,
  checkCategoryExistence,
} from '../validators';

export default {
  data() {
    return {
      categoryName: '',
      selectedParent: '',
      selectedParentErrorMessage: 'Нет такой категории',
      parentOptions: [],
      searchQuery: '',
      selectedArticlesError: false,
      articlesOptions: [],
      articlesSelectedOptions: [],
      isOptionAdded: false,
      isSubmitted: false,
      lastAction: null,
    };
  },
  validations() {
    const validationsObject = {
      categoryName: {
        isNotEmpty,
        checkCategoryExistence,
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
    } else if (this.lastAction === 'formSubmitted') {
      validationsObject.searchQuery = {
        isAtLeastOneArticleSelected,
      };
    }
    return validationsObject;
  },
  methods: {
    onNameChange(value) {
      this.categoryName = value;
      this.$v.categoryName.$touch();
    },
    onParentInputChange(value) {
      this.selectedParent = value;
      this.$v.selectedParent.$touch();
    },
    checkParentExistence: debounce(function (value) {
      this.selectedParentError = !this.parentOptions.find((option) => option.indexOf(value));
    }, 100),
    onArticlesInputChange(value) {
      this.lastAction = 'inputChange';
      this.searchQuery = value;
      this.$v.searchQuery.$touch();
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
    onArticleUnselected(value) {
      this.lastAction = 'optionAdded';
      const selectedOptionIndex = this.articlesSelectedOptions.indexOf(value);
      this.articlesSelectedOptions.splice(selectedOptionIndex, 1);
    },
    onCloseModal() {
      this.$store.commit('modal/close');
    },
    findCategory(categories, name) {
      return this.iterateCategories(categories, name);
    },
    iterateCategories(categories, name) {
      let target = null;
      for (let counter = 0; counter < categories.length; counter += 1) {
        const category = categories[counter];
        if (category.name === name) {
          target = category;
          break;
        }

        if (category.children.length > 0) {
          target = this.iterateCategories(category.children, name);
        }
      }
      return target;
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
        children: [],
      };
    },
    getCategories() {
      return this.$store.getters.getCategories;
    },
    copyObject(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    insertCategory(categories, category) {
      const categoriesCopy = this.copyObject(categories);

      if (this.selectedParent) {
        const parent = this.findCategory(categoriesCopy, this.selectedParent);
        parent.children.push(category);
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
    ...mapActions(['addNewCategory']),
  },
  computed: {
    ...mapState({
      getArticles(state) {
        return state.articles;
      },
    }),
    firstArticleThatContainsQuery() {
      if (!this.searchQuery) {
        return -1;
      }
      return this.articlesOptions.findIndex((article) => article.includes(this.searchQuery));
    },
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
        isOptionStartWithQuery: 'Поле не может быть пустым',
        isArticleExists: 'Нет такой статьи',
        isArticleSelected: 'Статья уже выбрана',
        isNotEmpty: 'Поле обязательно к заполнению',
        isAtLeastOneArticleSelected: 'Выберите хотя бы одну статью',
      };

      const errorKey = [
        'isOptionStartWithQuery',
        'isNotEmpty',
        'isArticleExists',
        'isArticleSelected',
        'isAtLeastOneArticleSelected',
      ].find((key) => {
        return this.$v.searchQuery[key] === false;
      });

      return errors[errorKey];
    },
  },
  mounted() {
    window.addEventListener('keypress', this.onCloseModalViaKeyboard);
  },
  beforeDestroy() {
    window.removeEventListener('keypress', this.onCloseModalViaKeyboard);
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
