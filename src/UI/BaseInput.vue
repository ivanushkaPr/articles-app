<template>
  <div class="base-input">
    <label class="base-input__label">
      <legend class="base-input__legend" :class="{
      'base-input__legend_decrease-legend': focused | isNotEmpty | isInputNotCorrect
    }"> {{legend}} </legend>
      <input @focus="onFocus"
             @blur="onBlur"
             class="base-input__input"
             :class="{
               'base-input__input_loupe_icon': isSearchInput,
               'base-input__input_error': isInputNotCorrect,
             }"
             :value="value"
             @input="onInput"
             ref="self"
             type="text"/>
    </label>
    <p v-if="isInputNotCorrect" class="base-input__error-message"> {{ errorMessage }} </p>
  </div>
</template>

<script>

export default {
  props: {
    legend: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    error: {
      type: Boolean,
      required: false,
      default: false,
    },
    errorMessage: {
      type: String,
      required: false,
      default: 'Ошибка',
    },
    type: {
      type: String,
      required: false,
      default: '',
      validator(value) {
        return ['search', 'select', ''].indexOf(value) !== -1;
      },
    },
  },
  data() {
    return {
      focused: false,
    };
  },
  methods: {
    onFocus() {
      this.focused = true;
    },
    onBlur() {
      this.focused = false;
    },
    onInput(event) {
      this.$emit('input', event.target.value);
    },
    onButtonClicked(event) {
      this.$emit('select-button-clicked', event);
    },
  },
  computed: {
    isNotEmpty() {
      return this.value !== '';
    },
    isInputNotCorrect() {
      return this.error;
    },
    isSearchInput() {
      return this.type === 'search';
    },
  },
};
</script>

<style scoped>
  .base-input {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .base-input__label {
    position: relative;
    display: flex;
  }
  .base-input__legend {
    position: absolute;
    top: 10px;
    left: 12px;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: #A0A6BF;
    transition-duration: 0.3s;
    transition-property: border-color, top, font-size;
  }
  .base-input__legend_decrease-legend {
    top: 3px;
    left: 10px;
    font-size: 10px;
  }
  .base-input__input {
    flex-grow: 1;
    border: 1px solid #D9DDE6;
    border-radius: 4px;
    padding: 18px 12px 4px 12px;
    box-sizing: border-box;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: #303446;
  }
  .base-input__input:hover {
    border-color: #BFC3D5;
  }
  .base-input__input:focus {
    border-color: #BFC3D5;
    outline: none;
  }
  .base-input__input_loupe_icon {
    background-image: url("data:image/svg+xml,%3Csvg width='17' height='16' viewBox='0 0 17 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.75 14.7188C16.0625 15.0312 16.0625 15.5 15.75 15.7812C15.625 15.9375 15.4375 16 15.25 16C15.0312 16 14.8438 15.9375 14.6875 15.7812L10.5 11.5938C9.375 12.5 7.96875 13 6.46875 13C2.90625 13 0 10.0938 0 6.5C0 2.9375 2.875 0 6.46875 0C10.0312 0 12.9688 2.9375 12.9688 6.5C12.9688 8.03125 12.4688 9.4375 11.5625 10.5312L15.75 14.7188ZM1.5 6.5C1.5 9.28125 3.71875 11.5 6.5 11.5C9.25 11.5 11.5 9.28125 11.5 6.5C11.5 3.75 9.25 1.5 6.5 1.5C3.71875 1.5 1.5 3.75 1.5 6.5Z' fill='%23A0A6BF'/%3E%3C/svg%3E%0A");
    background-repeat: no-repeat;
    background-position: top 50% right 20px;
  }

  .base-input .base-input__input_error {
    border-color: hsla(4, 87%, 55%, 1);
  }

  .base-input__error-message {
    margin-top: 4px;
    margin-bottom: 0px;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: hsla(4, 87%, 55%, 1);
  }
</style>
