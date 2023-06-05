<template>
  <ul class="category-list">
    <header class="category-list__header">
      <div class="category-list__info">
        <h2 class="category-list__headline">{{name}}</h2>
        <sup class="category-list__counter">({{getArticlesCounter}})</sup>
      </div>
      <div class="category-list__controls">
        <button class="category-list__button-opener mr-16px"
                :class="{ 'rotate-180-deg': isOpened }"
                @click="onToggleArticlesVisibility"></button>
        <div class="category-list__edit-block">
          <div class="category-list__burger-menu"
               @click="onToggleEditMenu"
               v-click-outside="onClickOutsideEditMenu"
          >
            <span class="category-list__menu-dot"></span>
            <span class="category-list__menu-dot"></span>
            <span class="category-list__menu-dot"></span>
          </div>
          <ul class="category-list__edit-list"
              :class="{'category-list__edit-list_hidden': !isEditMenuShowed}">
            <li class="category-list__edit-list-item"
                @click="onOpenModal">
              Редактировать
            </li>
            <li class="category-list__edit-list-item"
                @click="onOpenDeleteCategoryModal">
              Удалить
            </li>
          </ul>
        </div>
      </div>
    </header>
    <div v-show="isOpened" class="category-list__articles">
      <category-list-article v-for="id in articlesIds"
                             v-bind:key="id"
                             v-bind="getArticleById(id)"
      />
    </div>
    <div v-show="children && isOpened">
      <category-list v-for="category in children"
                     :class="['mb-16px']"
                     v-bind="category"
                     :topLevelOpenedState="isOpened"
                     :key="category.name"/>
    </div>
  </ul>
</template>
<script>
import { mapActions } from 'vuex';
import vClickOutside from 'v-click-outside';
import findCategory from '../mixins/findCategory';
import CategoryListArticle from './CategoryListArticle.vue';

export default {
  name: 'CategoryList',
  mixins: [findCategory],
  directives: {
    clickOutside: vClickOutside.directive,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    articlesIds: {
      type: Array,
      required: true,
      validator(ids) {
        return ids.every((id) => typeof id === 'number');
      },
    },
    children: {
      type: Array,
      required: false,
    },
    open: {
      type: Boolean,
      required: false,
      default: false,
    },
    topLevelOpenedState: {
      type: Boolean,
      required: false,
      default: undefined,
    },
  },
  components: {
    CategoryListArticle,
  },
  data() {
    return {
      isOpened: this.open,
      isEditMenuShowed: false,
    };
  },
  methods: {
    ...mapActions(['modal/openModal', 'setEditedCategory', 'deleteModal/openModal']),
    onOpenModal() {
      const selectedCategory = this.findCategory(this.$store.state.categories, this.name);
      this.setEditedCategory(selectedCategory);
      this.onToggleEditMenu();
      this['modal/openModal']();
    },
    onToggleEditMenu() {
      this.isEditMenuShowed = !this.isEditMenuShowed;
    },
    onToggleArticlesVisibility() {
      this.isOpened = !this.isOpened;
    },
    getArticleById(id) {
      return this.$store.state.articles[id - 1];
    },
    onOpenDeleteCategoryModal() {
      const selectedCategory = this.findCategory(this.$store.state.categories, this.name);
      this.setEditedCategory(selectedCategory);
      this.onToggleEditMenu();
      this['deleteModal/openModal']();
    },
    onClickOutsideEditMenu() {
      this.isEditMenuShowed = false;
    },
  },
  computed: {
    getArticlesCounter() {
      return this.articlesIds.length;
    },
    getData() {
      return {
        headline: 'Город невезения 1',
        img: 'https://avatars.dzeninfra.ru/get-zen_doc/114944/pub_5b10fd35fd96b192a89fcf02_5b10fe6fe44a94290ba07f4b/scale_1200',
        description: 'Идейные соображения высшего порядка, а также сложившаяся структура организации играет важную роль в формировании существенных финансовых и административных условий. Равным образом начало повседневной работы по формированию позиции повседневной работы по формированию позицииповседневной работы по формированию позицииповседневной работы по формированию позицииповседневной работы по формированию позицииповседневной работы по формированию позицииповседневной работы по формированию позицииповседневной работы по формированию позицииповседневной работы по формированию позицииповседневной работы по формированию позиции',
        likes: 10,
        id: 1,
      };
    },
  },
  watch: {
    topLevelOpenedState(newValue) {
      if (newValue === false) {
        this.isOpened = newValue;
      }
    },
  },
};
</script>

<style scoped>

.category-list {
  padding-left: 0px;
}

.category-list:last-child {
  padding-bottom: 60px;
}

.category-list .category-list {
  margin-left: 16px;
  padding-bottom: 0px;
}

.category-list .category-list:last-child {
  margin-bottom: 0px !important;
}

.category-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
}

.category-list__info {
  display: flex;
}

.category-list__headline {
  margin-top: 0px;
  margin-bottom: 0px;
  margin-right: 8px;
  font-size: 24px;
  line-height: 32px;
  color: #303446;
}

.category-list .category-list .category-list__headline{
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #4D5163;
}

.category-list__counter {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #A0A6BF;
}

.category-list__controls {
  display: flex;
  align-items: center;
}

.category-list__button-opener {
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8' viewBox='0 0 14 8' fill='none'%3E%3Cpath d='M13.5 1.5625L7.53125 7.28125C7.34375 7.4375 7.15625 7.5 7 7.5C6.8125 7.5 6.625 7.4375 6.46875 7.3125L0.46875 1.5625C0.15625 1.28125 0.15625 0.78125 0.4375 0.5C0.71875 0.1875 1.21875 0.1875 1.5 0.46875L7 5.71875L12.4688 0.46875C12.75 0.1875 13.25 0.1875 13.5312 0.5C13.8125 0.78125 13.8125 1.28125 13.5 1.5625Z' fill='%234D5163'/%3E%3C/svg%3E");  background-repeat: no-repeat;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  padding: 0;
  transition-duration: 0.3s;
  transition-property: transform;
}

.category-list__edit-block {
  position: relative;
}

.category-list__burger-menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 24px;
  padding: 0px;
  background-color: transparent;
}

.category-list__edit-list {
  top: 20px;
  left: -156px;
  position: absolute;
  z-index: 1;
  padding: 8px 9px;
  box-sizing: border-box;
  width: 161px;
  height: 88px;
  list-style-type: none;
  background: #FFFFFF;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.07);
  border-radius: 5px;
}

.category-list__edit-list_hidden {
  display: none;
}

.category-list__edit-list-item {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 6px 8px;
  width: 143px;
  height: 34px;
  margin-bottom: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #4D5163;
}

.category-list__edit-list-item:last-child {
  margin-bottom: 0px
}

.category-list__edit-list-item:hover {
  background: rgba(48, 52, 70, 0.03);
  border-radius: 5px;
}

.category-list__menu-dot {
  width: 4px;
  height: 4px;
  margin-bottom: 2px;
  border-radius: 4px;
  background-color: #4D5163;
}

.category-list__menu-dot:last-child {
  margin-bottom: 0;
}

.rotate-180-deg {
  transform: rotate(-180deg);
}
.category-list__articles {
  display: flex;
}
</style>
