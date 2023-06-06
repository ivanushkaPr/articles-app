export default {
  methods: {
    countArticles(categories) {
      return categories.reduce((acc, category) => {
        let counter = category.articlesIds.length;
        if (category.children.length > 0) {
          counter += this.countArticles(category.children);
        }
        return counter + acc;
      }, 0);
    },
  },
};
