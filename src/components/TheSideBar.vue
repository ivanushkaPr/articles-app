<template>
  <aside class="the-sidebar">
    <base-action-button @onButtonClicked="onDeleteCategories" text="Удалить все категории"/>
  </aside>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  methods: {
    onDeleteCategories() {
      this.addNewCategory([]);
      localStorage.setItem('categories', JSON.stringify(this.getCategories()));
    },
    ...mapActions(['addNewCategory']),
    ...mapGetters(['getCategories']),
  },
};
</script>

<style>
.the-sidebar {
  position: fixed;
  left: -242px;
  top: 40px;
  padding-left: 24px;
  transition-property: left;
  transition-duration: 0.3s;
}

.the-sidebar:hover {
  left: 0px;
}
</style>
