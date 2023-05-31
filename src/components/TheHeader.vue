<template>
  <header class="header">
    <base-action-button class="mr-16px" text="Создать категорию"
                        :is-add-button="true"
    @onButtonClicked="onOpenModal"/>
    <base-input legend="Найти статью" type="search" v-model.trim="searchQuery"/>
  </header>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
    };
  },
  methods: {
    onOpenModal() {
      debugger;
      this.$store.commit('modal/open');
    },
  },
};
</script>

<style>

.header {
  display: flex;
  justify-content: space-between;
  max-width: 1236px;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  padding: 0px 40px;
  padding-top: 40px;
}

</style>
