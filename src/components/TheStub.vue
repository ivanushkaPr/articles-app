<template>
  <div class="the-stub">
    <h2 class="the-stub-headline"> Пока нет статей </h2>
    <p class="the-stub-text mb-16px"> Создайте свою первую  категорию и добавьте в неё статьи. </p>
    <base-action-button @onButtonClicked="onOpenModal" text="Создать категорию"
                        :is-add-button="true"/>
  </div>
</template>

<script>
export default {
  methods: {
    onOpenModal() {
      this.$store.commit('openAddCategoryModal');
    },
  },
};
</script>

<style scoped>
.the-stub {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 259px;
  margin: 144px auto;
}

.the-stub-headline {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #303446;
  margin-top: 0px;
  margin-bottom: 4px;
}

.the-stub-text {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  color: #6A6E7E;
  margin: 0px;
}

.mb-16px {
  margin-bottom: 16px;
}
</style>
