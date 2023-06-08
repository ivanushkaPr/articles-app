<template>
<section class="base-select"
         v-click-outside="onCloseDropdown">
  <label class="base-select__label">
    <legend class="base-select__legend" :class="{
      'base-select__legend_decrease-legend': focused | isNotEmpty | isInputNotCorrect
    }"> {{legend}} </legend>
    <input @focus="onFocus"
           @blur="onBlur"
           class="base-select__input"
           :class="{'base-select__input_error': isInputNotCorrect}"
           :value="value"
           @input="onInput"
           ref="self"
           type="text"/>
    <button class="base-select__button"
            type="button"
            @click="onInputClicked"
            :class="{'base-select__button_rotated': isOpened}"></button>
  </label>
  <div v-show="isOpened" class="base-select__dropdown">
    <p v-for="(option, index) in options"
       class="base-select__option"
       :class="{'base-select__option_highlighted': optionHighlightedIndex === index}"
       @click.stop="() => onOptionClicked(option)"
       v-bind:key="option + index">
      {{option}}
    </p>
  </div>
  <p v-if="isInputNotCorrect" class="base-select__error-message"> {{errorMessage}} </p>
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
      this.onCloseDropdown();
    },
    onInput(event) {
      this.$emit('input', event.target.value);
    },
    onOptionClicked(optionName) {
      this.$emit('input', optionName);
      this.onCloseDropdown();
    },
    onInputClicked() {
      this.isOpened = !this.isOpened;
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
      } else if (this.focused) {
        this.isOpened = true;
      }
    },
    error(newError, oldError) {
      if (newError && this.isOpened) {
        this.isOpened = false;
      } else if (!newError && oldError && !this.isOpened) {
        this.isOpened = true;
      }
    },
  },
};
</script>

<style>
.base-select {
  position: relative;
}

.base-select__label {
  position: relative;
  display: flex;
  flex-grow: 1;
}
.base-select__legend {
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
.base-select__legend_decrease-legend {
  top: 3px;
  left: 10px;
  font-size: 10px;
}
.base-select__input {
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
.base-select__input:hover, .base-input__legend:hover ~ .base-select__input{
  border-color: #BFC3D5;
}
.base-select__input:focus {
  border-color: #BFC3D5;
  outline: none;
}
.base-select__button {
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

.base-select__button_rotated {
  transform: rotate(-180deg);
}

.base-select__dropdown {
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

.base-select__dropdown::-webkit-scrollbar {
  width: 16px;
  height: 8px;
  background: linear-gradient(180deg, rgba(255,255,255,1) 0%,
  rgba(255,255,255,1) 72px, rgba(248,248,248,1) 72px,
  rgba(248,248,248,1) 100%);
}
.base-select__dropdown::-webkit-scrollbar-thumb {
  height: 56px;
  border-radius: 8px;
  border: 4px solid transparent;
  background-clip: content-box;
  background-color: hsl(0,0%,67%);
}
.base-select__option {
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
.base-select__option:last-child {
  margin-botton: 0px;
}

.base-select__option:hover {
  background: rgba(48, 52, 70, 0.03);
  border-radius: 5px;
}

.base-select__input_error {
  border-color: hsla(4, 87%, 55%, 1);
}

.base-select__error-message {
  margin-top: 4px;
  margin-bottom: 0px;
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: hsla(4, 87%, 55%, 1);
}

.base-select__option_highlighted {
  background: rgba(48, 52, 70, 0.03);
  border-radius: 5px;
}
</style>
