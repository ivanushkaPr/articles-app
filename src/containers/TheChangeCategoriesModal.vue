<template>
  <form ref="self"
        class="the-change-categories-modal"
        @submit.prevent="onSubmitForm">
    <div class="the-change-categories-modal__window" v-click-outside="onCloseModal">
      <h2 class="the-change-categories-modal__headline"> Изменение расположения статьи </h2>

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
                         :slot-value="newCategoryName"
                         @slotInputChange="onChangeNewCategoryName"
                         :slot-error="$v.newCategoryName.$error"
                         :slot-error-message="getNewCategoryNameErrorMessage"
                         @slotButtonClicked="onCreateNewCategory"
                         :class="['mb-350px', {'mb-16px': true}]">
        <template v-slot:default="slotProps">
          <div v-if="slotProps.slotVisibility" v-click-outside="slotProps.slotHideSlotContent"
               class="flexed align-items-flex-start">
            <base-input :value="slotProps.slotInputValue"
                        @input="slotProps.slotInputHandler"
                        :error="slotProps.slotError"
                        :error-message="slotProps.slotErrorMessage"
                        :class="['mr-16px']"
                        legend="Название новой категории"/>
            <base-action-button :style="{'min-width': '160px' }"
                                text="Создать"
                                :disabled="slotProps.slotError || slotProps.slotInputValue === ''"
                                @onButtonClicked="slotProps.slotButtonHandler"
            />
          </div>
        </template>
      </base-multi-select>
      <hr class="the-change-categories-modal__divider" color="#BFC3D5" width="100%">

      <div class="the-change-categories-modal__controls">
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
import { mapActions, mapGetters } from 'vuex';
import vClickOutside from 'v-click-outside';
import {
  isOptionStartWithQuery,
  isArticleExists,
  isArticleSelected,
  checkCategoryExistence,
} from '../validators';

import BaseMultiselectHandlers from '../mixins/BaseMultiselectHandlers';
import toggleBodyOverflow from '../mixins/toggleBodyOverflow';

export default {
  mixins: [toggleBodyOverflow, BaseMultiselectHandlers],
  directives: {
    clickOutside: vClickOutside.directive,
  },
  data() {
    return {
      searchQuery: '',
      articlesOptions: [],
      articlesSelectedOptions: [],
      newCategoryName: '',
      lastAction: '',
    };
  },
  validations() {
    debugger;
    const validationsObject = {
      searchQuery: {
        isOptionStartWithQuery,
      },
      newCategoryName: {
        checkCategoryExistence: checkCategoryExistence('articlesOptions'),
      },
    };
    if (this.lastAction === 'optionAdded') {
      validationsObject.searchQuery = {
        isArticleExists,
        isArticleSelected,
      };
    } else if (this.lastAction === 'formSubmitted') {
      validationsObject.searchQuery = {};
    }
    return validationsObject;
  },
  methods: {
    onCloseModal() {
      this['changeModal/closeModal']();
    },
    onSubmitForm() {
      debugger;
      this.lastAction = 'formSubmitted';
      this.$v.$touch();

      if (!this.$v.$invalid) {
        const newCategories = this.copyObject(this.getCategories());
        this.changeIDS(newCategories, this.articlesSelectedOptions, this.getEditedArticleID());
        this.addNewCategory(newCategories);
        localStorage.setItem('categories', JSON.stringify(this.getCategories()));
        this['changeModal/closeModal']();
      }
    },
    changeIDS(categories, categoriesNames, id) {
      categories.forEach((category) => {
        const articleIndex = category.articlesIds.indexOf(id);
        const isTargetCategory = categoriesNames.indexOf(category.name);
        debugger;
        if (articleIndex === -1 && isTargetCategory !== -1) {
          category.articlesIds.push(id);
        } else if (articleIndex !== -1 && isTargetCategory === -1) {
          category.articlesIds.splice(articleIndex, 1);
        }
        if (category.children.length > 0) {
          this.changeIDS(category.children, categoriesNames, id);
        }
      });
    },
    onChangeNewCategoryName(value) {
      this.newCategoryName = value;
      this.$v.$touch();
      this.$v.newCategoryName.$touch();
    },
    onCreateNewCategory() {
      const newCategory = this.createNewCategory();
      const newCategories = this.copyObject(this.getCategories());
      const newCategoriesAfterInsertion = this.insertCategory(newCategories, newCategory);
      this.addNewCategory(newCategoriesAfterInsertion);
      localStorage.setItem('categories', JSON.stringify(this.getgetCategories()));
      this.$nextTick(() => {
        this.onArticleSelected(this.newCategoryName);
        this.newCategoryName = '';
      });
    },
    copyObject(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    insertCategory(categories, category) {
      const categoriesCopy = this.copyObject(categories);
      categoriesCopy.push(category);
      categoriesCopy.sort();
      return categoriesCopy;
    },
    createNewCategory() {
      return {
        name: this.newCategoryName,
        articlesIds: [this.getEditedArticleID()],
        children: [],
      };
    },
    ...mapActions([
      'changeModal/closeModal',
      'addNewCategory',
      'setEditedCategory',
      'addNewCategory',
    ]),
    ...mapGetters(['getEditedArticleID', 'getCategories']),
  },
  computed: {
    getNewCategoryNameErrorMessage() {
      const errors = {
        checkCategoryExistence: 'Такое название существует.',
      };

      const errorKey = ['checkCategoryExistence'].find((key) => {
        return this.$v.newCategoryName[key] === false;
      });

      return errors[errorKey];
    },
    getSearchQueryErrorMessage() {
      const errors = {
        isOptionStartWithQuery: 'Поле не может быть пустым',
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
  },
  watch: {
    '$store.state.articleParentCategories': {
      handler(newParentCategories) {
        this.articlesSelectedOptions = newParentCategories;
      },
      immediate: true,
    },
    '$store.state.categories': {
      handler(newCategories) {
        this.articlesOptions = [
          'Создать новую категорию',
          ...this.getCategoryNames(newCategories, []),
        ];
      },
      immediate: true,
      deeep: true,
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
  },
};
</script>

<style>
.the-change-categories-modal {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100vh;
  background-color: rgba(10, 14, 32, 0.4);
  overflow-y: scroll;
}
.the-change-categories-modal__window {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 826px;
  padding: 32px 32px 24px 32px;
  margin: 55px auto;
  background-color: #FFFFFF;
  border-radius: 10px;
}

.the-change-categories-modal__headline {
  margin-top: 0px;
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
}

.the-change-categories-modal__divider {
  color: #BFC3D5;
  margin-bottom: 16px;
}

.the-change-categories-modal__controls {
  display: flex;
  margin-bottom: 24px;
}

.flexed {
  display: flex;
}

.align-items-flex-start {
  align-items: flex-start;
}
</style>
