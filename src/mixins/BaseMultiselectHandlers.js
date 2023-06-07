export default {
  methods: {
    onArticlesInputChange(value) {
      this.lastAction = 'inputChange';
      this.searchQuery = value;
      this.$v.searchQuery.$touch();
    },
    onArticleSelected(value) {
      debugger;
      this.lastAction = 'optionAdded';
      this.searchQuery = value;
      this.$v.searchQuery.$touch();

      if (!this.$v.searchQuery.$error && value !== '') {
        this.articlesSelectedOptions.push(value);
        this.articlesSelectedOptions.sort();
        this.searchQuery = '';
      }
    },
    onArticleUnselected(value) {
      this.lastAction = 'optionAdded';
      const selectedOptionIndex = this.articlesSelectedOptions.indexOf(value);
      this.articlesSelectedOptions.splice(selectedOptionIndex, 1);
    },
    getCategoryNames(categories, storage) {
      return categories.reduce((acc, cur) => {
        acc.push(cur.name);
        if (cur.children.length) {
          this.getCategoryNames(cur.children, acc);
        }
        return acc;
      }, storage);
    },
  },
  computed: {
    firstArticleThatContainsQuery() {
      if (!this.searchQuery) {
        return -1;
      }
      return this.articlesOptions.findIndex((article) => article.includes(this.searchQuery));
    },
  },
  watch: {

  },
};
