<template>
  <header class="header mb-48px">
    <base-action-button class="mr-16px" text="Создать категорию"
                        :is-add-button="true"
    @onButtonClicked="onOpenModal"/>
    <base-input legend="Найти статью" type="search"
                :class="{'mr-16px': getSearchQuery.length !== 0 }"
                @input="onInput"
                :value="getSearchQuery"/>
    <base-cancel-button v-if="getSearchQuery.length !== 0"
                        text="Сбросить фильтры"
                        @onButtonClicked="resetSearchQuery"
    />
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  methods: {
    ...mapActions(['updateSearchQuery']),
    onOpenModal() {
      this.$store.commit('modal/open');
    },
    onInput(value) {
      this.updateSearchQuery(value);
    },
    resetSearchQuery() {
      this.updateSearchQuery('');
    },
  },
  computed: {
    ...mapGetters(['getSearchQuery']),
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
