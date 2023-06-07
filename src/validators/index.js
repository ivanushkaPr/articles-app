import { helpers } from 'vuelidate/lib/validators';

export function isNotEmpty(value) {
  return value !== '';
}

export function checkCategoryExistence(categoryData, editedValue) {
  return function (value) {
    debugger;
    let result = null;
    return !this[categoryData].some((option) => {
      if (editedValue && option === editedValue) {
        result = false;
      } else {
        result = option === value;
      }
      return result;
    });
  };
}

export function checkParentExistence(value) {
  return !helpers.req(value) || !!this.parentOptions.some((option) => option === value);
}

export function isOptionStartWithQuery(value) {
  const isEmpty = !helpers.req(value);
  const isOptionStartsWithQuery = this.articlesOptions.some((option) => option.startsWith(value));
  return isEmpty || isOptionStartsWithQuery;
}

export function isArticleExists(value) {
  const result = !!this.articlesOptions.some(((article) => article === value));
  return !helpers.req(value) || result;
}

export function isArticleSelected(value) {
  const result = this.articlesSelectedOptions.some((article) => article === value);
  return !helpers.req(value) || result !== true;
}

export function isAtLeastOneArticleSelected() {
  debugger;
  return this.articlesSelectedOptions.length > 0;
}
