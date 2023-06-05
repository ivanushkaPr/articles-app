<template>
  <section v-click-outside="onCloseDropdown" class="base-multi-select">
    <label class="base-multi-select__label">
      <legend class="base-multi-select__legend" :class="{
      'base-multi-select__legend_decrease-legend': focused | isNotEmpty | isInputNotCorrect
    }"> {{legend}} </legend>
      <input @focus="onFocus"
             @blur="onBlur"
             class="base-multi-select__input"
             :class="{'base-input__input_error': isInputNotCorrect}"
             :value="value"
             @input="onInput"
             @keydown.enter.exact.prevent="onEnterPressed"
             ref="self"
             type="text"/>
      <button class="base-multi-select__button"
              type="button"
              :class="{'base-multi-select__button_rotated': isOpened}"
              @click="onInputClicked"></button>
    </label>
    <div v-show="isOpened" class="base-multi-select__dropdown">
      <p v-for="(option, index) in options"
         class="base-multi-select__option "
         @click="() => onOptionClicked(option)"
         :class="{'base-multi-select__option_highlighted ': optionHighlightedIndex === index}"
         v-bind:key="option + index">
        {{option}}
      </p>
    </div>
    <p v-if="isInputNotCorrect" class="base-multi-select__error-message"> {{errorMessage}} </p>

    <div class="base-multiselect__selected-options">
      <div class="base-multiselect__selected-option mr-16px"
           v-for="(option, index) in selectedOptions"
           :key="option + index"
           @click="onDeleteOption(option)">
        <button class="base-multiselect__delete-button mr-12px" type="button"></button>
        <p class="base-multiselect__selected-option-name">  {{ option }} </p>
      </div>
    </div>
  </section>
</template>

<script>
import vClickOutside from 'v-click-outside';

export default {
  directives: {
    clickOutside: vClickOutside.directive,
  },
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
    options: {
      type: Array,
      required: true,
    },
    selectedOptions: {
      type: Array,
      required: true,
    },
    optionHighlightedIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isOpened: false,
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
    onEnterPressed(event) {
      this.$emit('option-selected', event.target.value);
      this.onCloseDropdown();
    },
    onOptionClicked(optionName) {
      this.$emit('option-selected', optionName);
      this.onCloseDropdown();
    },
    onInputClicked() {
      this.isOpened = !this.isOpened;
    },
    onDeleteOption(optionName) {
      this.$emit('option-deleted', optionName);
    },
    onCloseDropdown() {
      this.isOpened = false;
    },
  },
  computed: {
    isNotEmpty() {
      return this.value !== '';
    },
    isInputNotCorrect() {
      return this.error;
    },
  },
  watch: {
    value(newValue) {
      if (newValue === '') {
        this.isOpened = false;
      } else {
        this.isOpened = true;
      }
    },
  },
};
</script>

<style>
.base-multi-select {
  position: relative;
}

.base-multi-select__label {
  position: relative;
  display: flex;
  flex-grow: 1;
}
.base-multi-select__legend {
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
.base-multi-select__legend_decrease-legend {
  top: 3px;
  left: 10px;
  font-size: 10px;
}

.base-multi-select__input {
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
.base-multi-select__input:hover, .base-input__legend:hover ~ .base-multi-select__input{
  border-color: #BFC3D5;
}
.base-multi-select__input:focus {
  border-color: #BFC3D5;
  outline: none;
}
.base-multi-select__button {
  border: none;
  width: 46px;
  height: 46px;
  position: absolute;
  right: 0;
  background-color: transparent;

  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18.5 10.5625L12.5312 16.2812C12.3438 16.4375 12.1562 16.5 12 16.5C11.8125 16.5 11.625 16.4375 11.4688 16.3125L5.46875 10.5625C5.15625 10.2812 5.15625 9.78125 5.4375 9.5C5.71875 9.1875 6.21875 9.1875 6.5 9.46875L12 14.7188L17.4688 9.46875C17.75 9.1875 18.25 9.1875 18.5312 9.5C18.8125 9.78125 18.8125 10.2812 18.5 10.5625Z' fill='%23A0A6BF'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: center center;
  transition-property: transform;
  transition-duration: 0.3s;
}

.base-multi-select__button_rotated {
  transform: rotate(-180deg);
}

.base-multi-select__dropdown {
  position: absolute;
  top: 56px;
  z-index: 1;
  width: 100%;
  height: 164px;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.07);
  border-radius: 5px;
  margin-top: 1px;
  padding: 8px 9px;
  box-sizing: border-box;
  background-color: white;
  overflow-y: scroll;
}

.base-multi-select__dropdown::-webkit-scrollbar {
  width: 16px;
  height: 8px;
  background: linear-gradient(180deg, rgba(255,255,255,1) 0%,
  rgba(255,255,255,1) 72px, rgba(248,248,248,1) 72px,
  rgba(248,248,248,1) 100%);
}
.base-multi-select__dropdown::-webkit-scrollbar-thumb {
  height: 56px;
  border-radius: 8px;
  border: 4px solid transparent;
  background-clip: content-box;
  background-color: hsl(0,0%,67%);
}
.base-multi-select__option {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #4D5163;
  margin-top: 0px;
  margin-bottom: 4px;
  padding: 6px 8px;
}
.base-multi-select__option:last-child {
  margin-botton: 0px;
}

.base-multi-select__option:hover, .base-multi-select__option_highlighted {
  background: rgba(48, 52, 70, 0.03);
  border-radius: 5px;
}

.base-multi-select .base-multi-select__input_error {
  border-color: hsla(4, 87%, 55%, 1);
}

.base-multi-select__error-message {
  margin-top: 4px;
  margin-bottom: 0px;
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: hsla(4, 87%, 55%, 1);
}

.base-multiselect__selected-options {
  display: flex;
  flex-wrap: wrap;
}

.base-multiselect__selected-option {
  display: flex;
  align-items: center;
  margin-top: 16px;
}

.base-multiselect__delete-button {
  width: 24px;
  height: 24px;
  padding: 4px 5px;
  border: none;
  border-radius: 3px;
  background-color: #ED5252;
  background-image: url("data:image/svg+xml,%3Csvg width='14' height='16' viewBox='0 0 14 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.25 2.5C13.6562 2.5 14 2.84375 14 3.25C14 3.6875 13.6562 4 13.25 4H12.875L12.125 14.1562C12.0312 15.2188 11.1875 16 10.125 16H3.84375C2.78125 16 1.9375 15.2188 1.84375 14.1562L1.09375 4H0.75C0.3125 4 0 3.6875 0 3.25C0 2.84375 0.3125 2.5 0.75 2.5H2.90625L4.0625 0.78125C4.375 0.3125 4.9375 0 5.53125 0H8.4375C9.03125 0 9.59375 0.3125 9.90625 0.78125L11.0625 2.5H13.25ZM5.53125 1.5C5.4375 1.5 5.34375 1.5625 5.3125 1.625L4.71875 2.5H9.25L8.65625 1.625C8.625 1.5625 8.53125 1.5 8.4375 1.5H5.53125ZM11.375 4H2.59375L3.34375 14.0625C3.375 14.3125 3.59375 14.5 3.84375 14.5H10.125C10.375 14.5 10.5938 14.3125 10.625 14.0625L11.375 4Z' fill='white'/%3E%3C/svg%3E%0A");
  background-position: center center;
  background-repeat: no-repeat;
}

.base-multiselect__delete-button:hover {
  background-color: #F06C6C;
}

.base-multiselect__delete-button:active {
  background-color: #D54A4A;
}

.base-multiselect__delete-button:disabled {
  background-color: #F0F1F2;
}

.base-multiselect__selected-option-name {
  margin: 0px;
}

</style>
