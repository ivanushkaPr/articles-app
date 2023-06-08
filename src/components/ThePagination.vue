<template>
  <ul class="base-pagination">
    <li v-for="(data, name, index) in generateRenderData" :key="index">
      <p v-if="data.class==='base-pagination__dots'" :class="[data.class]">
        <span class="base-pagination__dot"></span>
        <span class="base-pagination__dot"></span>
        <span class="base-pagination__dot"></span>
      </p>
      <p v-else :class="[
         data.class,
         (currentPage === data.page) ? 'base-pagination__go-to-page-button_active' : '',
         ]"
         @click="callHandler(data.handler, data.page)">
        {{ data.page ? data.page : '' }}
      </p>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    pagesCounter: {
      type: Number,
      required: true,
    },
  },
  methods: {
    callHandler(handlerName, page) {
      this[handlerName](page);
    },
    onGoToPage(page) {
      this.$emit('pageChange', page);
    },
    onShowPrevPage() {
      if (this.currentPage === 1) {
        return;
      }
      this.$emit('goBack');
    },
    onShowNextPage() {
      if ((this.currentPage + 1) > this.pagesCounter) {
        return;
      }
      this.$emit('goForward');
    },
    singlePagePaginationClasses() {
      return [
        { class: 'base-pagination__to-prev-page-button', handler: 'onShowPrevPage' },
        { class: 'base-pagination__go-to-page-button', handler: 'onGoToPage', page: 1 },
        { class: 'base-pagination__to-next-page-button', handler: 'onShowNextPage' },
      ];
    },
    firstFourPagesShowedClasses() {
      const classes = [
        { class: 'base-pagination__to-prev-page-button', handler: 'onShowPrevPage' },
      ];
      for (let counter = 1; counter < 5; counter += 1) {
        classes.push({
          class: 'base-pagination__go-to-page-button',
          page: counter,
          handler: 'onGoToPage',
        });
      }
      classes.push(
        { class: 'base-pagination__dots', handler: 'onShowNextPage' },
        { class: 'base-pagination__go-to-page-button', page: this.pagesCounter, handler: 'onGoToPage' },
        { class: 'base-pagination__to-next-page-button', handler: 'onShowNextPage' },
      );
      return classes;
    },
    lastFourPagesShowedClasses() {
      const classes = [
        { class: 'base-pagination__to-prev-page-button', handler: 'onShowPrevPage' },
        { class: 'base-pagination__go-to-page-button', page: 1, handler: 'onGoToPage' },
        { class: 'base-pagination__dots', handler: 'onShowPrevPage' },
      ];
      for (let counter = this.pagesCounter - 3; counter <= this.pagesCounter; counter += 1) {
        classes.push({
          class: 'base-pagination__go-to-page-button',
          page: counter,
          handler: 'onGoToPage',
        });
      }
      classes.push({ class: 'base-pagination__to-next-page-button', handler: 'onShowNextPage' });
      return classes;
    },
    lessThenSixPagesPaginationClasses() {
      const classes = [
        { class: 'base-pagination__to-prev-page-button', handler: 'onShowPrevPage' },
      ];
      for (let counter = 1; counter < this.pagesCounter + 1; counter += 1) {
        classes.push({
          class: 'base-pagination__go-to-page-button',
          page: counter,
          handler: 'onGoToPage',
        });
      }
      classes.push(
        { class: 'base-pagination__to-next-page-button', handler: 'onShowNextPage' },
      );
      return classes;
    },
    twoPagesShowedClasses() {
      const classes = [
        { class: 'base-pagination__to-prev-page-button', handler: 'onShowPrevPage' },
        { class: 'base-pagination__go-to-page-button', page: 1, handler: 'onGoToPage' },
        { class: 'base-pagination__dots', handler: 'onShowPrevPage' },
      ];
      for (let counter = this.currentPage; counter < this.currentPage + 2; counter += 1) {
        classes.push({
          class: 'base-pagination__go-to-page-button',
          page: counter,
          handler: 'onGoToPage',
        });
      }
      classes.push(
        { class: 'base-pagination__dots', handler: 'onShowNextPage' },
        { class: 'base-pagination__go-to-page-button', page: this.pagesCounter, handler: 'onGoToPage' },
        { class: 'base-pagination__to-next-page-button', handler: 'onShowNextPage' },
      );
      return classes;
    },
  },
  computed: {
    generateRenderData() {
      let classes = null;
      debugger;
      if (this.pagesCounter === 1) {
        classes = this.singlePagePaginationClasses();
      } else if (this.pagesCounter < 7) {
        classes = this.lessThenSixPagesPaginationClasses();
      } else if (this.currentPage < 4) {
        classes = this.firstFourPagesShowedClasses();
      } else if (this.currentPage > this.pagesCounter - 4) {
        debugger;
        classes = this.lastFourPagesShowedClasses();
      } else {
        classes = this.twoPagesShowedClasses();
      }
      return classes;
    },
  },
};
</script>

<style scoped>
.base-pagination {
  display: flex;
  justify-content: center;
  flex-direction: row;
  padding-left: 0px;
  list-style-type: none;;
}

.base-pagination__go-to-page-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 34px;
  backdrop-filter: blur(10px);
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #4D5163;
}

.base-pagination__go-to-page-button_active {
  border-radius: 5px;
  background: rgba(48, 52, 70, 0.07);
  backdrop-filter: blur(10px);
  color: #303446;
}

.base-pagination__to-prev-page-button, .base-pagination__to-next-page-button {
  width: 19px;
  height: 34px;
  background-position: center;
  background-repeat: no-repeat;
}

.base-pagination__to-prev-page-button {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='5' height='9' viewBox='0 0 5 9' fill='none'%3E%3Cpath d='M5 0.755245C5 0.534965 4.91018 0.346154 4.79042 0.22028C4.64072 0.0629371 4.46108 8.2532e-09 4.28144 0C4.07186 -9.62873e-09 3.89222 0.062937 3.77245 0.22028L0.209581 3.96503C0.0598803 4.09091 9.16107e-09 4.27972 0 4.5C-7.85235e-09 4.68881 0.0598802 4.87762 0.209581 5.03497L3.77245 8.77972C3.89222 8.90559 4.07186 9 4.28144 9C4.46108 9 4.64072 8.90559 4.79042 8.77972C4.91018 8.62238 5 8.43357 5 8.24476V0.755245Z' fill='%23303446'/%3E%3C/svg%3E");
}

.base-pagination__to-next-page-button {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='5' height='9' viewBox='0 0 5 9' fill='none'%3E%3Cpath d='M-8.87649e-07 8.24475C-9.06906e-07 8.46503 0.0898195 8.65385 0.20958 8.77972C0.359281 8.93706 0.538921 9 0.718562 9C0.928143 9 1.10778 8.93706 1.22754 8.77972L4.79042 5.03497C4.94012 4.90909 5 4.72028 5 4.5C5 4.31119 4.94012 4.12238 4.79042 3.96503L1.22755 0.220279C1.10778 0.0944048 0.928144 -3.55973e-07 0.718563 -3.74295e-07C0.538922 -3.9e-07 0.359281 0.0944048 0.209581 0.220279C0.0898202 0.377622 -2.16389e-07 0.566433 -2.32895e-07 0.755244L-8.87649e-07 8.24475Z' fill='%23303446'/%3E%3C/svg%3E");
}

.base-pagination__dots {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin: 0px;
  width: 34px;
  height: 22px;
}

.base-pagination__dot {
  width: 3px;
  height: 3px;
  border-radius: 3px;
  background-color: #4D5163;
  margin-right: 1px;
}

.base-pagination__dot:last-child {
  margin-left: 0px;
}

p {
  margin-top: 0px;
  margin-bottom: 0px;
}

</style>
