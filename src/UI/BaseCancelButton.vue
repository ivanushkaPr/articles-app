<template>
  <button class="base-cancel-button" :class="{
    'base-cancel-button_bg': bg,
  }"
  type="button"
  @click="(e) => $emit('onButtonClicked', e)">
    {{text}}
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
      validator(text) {
        return text;
      },
    },
    bg: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style scoped>
.base-cancel-button {
  padding: 10px 24px;
  border: none;
  border-radius: 5px;
  background-color: rgba(10, 14, 32, 0.07);
  backdrop-filter: blur(10px);

  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  transition-property: background-color;
  transition-duration: 0.3s;
}

.base-cancel-button_bg {
  padding-left: 148.32px;
  padding-right: 148.32px;
}

.base-cancel-button:hover {
  background-color: rgba(10, 14, 32, 0.1);
}

.base-cancel-button:active {
  background-color: rgba(10, 14, 32, 0.15);
}

.base-cancel-button:disabled {
  background-color: #C5C7D0;
}

</style>
