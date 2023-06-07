<template>
  <button class="base-action-button"
  :class="{
    'base-action-button_add-icon': isAddButton,
    'base-action-button_bg': bg,
  }"
  @click="(e) => $emit('onButtonClicked', e)" :disabled="disabled">
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
    isAddButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style scoped>
  .base-action-button {
    padding: 10px 24px;
    border: none;
    border-radius: 3px;
    background-color: #ED5252;

    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #FFFFFF;

    transition-property: background-color;
    transition-duration: 0.3s;
  }

  .base-action-button_bg {
    padding-left: 142.66px;
    padding-right: 142.66px;
  }

  .base-action-button:hover {
    background-color: #F06C6C;
  }

  .base-action-button:active {
    background-color: #D54A4A;
  }

  .base-action-button:disabled {
    background-color: #F0F1F2;
  }

  .base-action-button_add-icon {
    background-repeat: no-repeat;
    background-position: 191px 15px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'%3E%3Cpath d='M13.5 7C13.5 7.4375 13.1562 7.75 12.75 7.75H7.75V12.75C7.75 13.1875 7.40625 13.5312 7 13.5312C6.5625 13.5312 6.25 13.1875 6.25 12.75V7.75H1.25C0.8125 7.75 0.5 7.4375 0.5 7.03125C0.5 6.59375 0.8125 6.25 1.25 6.25H6.25V1.25C6.25 0.84375 6.5625 0.53125 7 0.53125C7.40625 0.53125 7.75 0.84375 7.75 1.25V6.25H12.75C13.1562 6.25 13.5 6.59375 13.5 7Z' fill='white'/%3E%3C/svg%3E");
    padding: 10px 48px 12px 16px;
  }
</style>
