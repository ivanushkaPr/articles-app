<template>
  <header class="header mb-48px">
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
  align-items: center;
  padding-top: 40px;
}

</style>
