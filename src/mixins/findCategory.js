export default {
  methods: {
    findCategory(categories, name) {
      return this.iterateCategories(categories, name);
    },
    iterateCategories(categories, name, parent) {
      let target = null;
      for (let counter = 0; counter < categories.length; counter += 1) {
        const category = categories[counter];
        if (category.name === name) {
          target = { category, parent };
          break;
        }

        if (category.children.length > 0) {
          target = this.iterateCategories(category.children, name, category);
        }
      }

      return target;
    },
  },
};
