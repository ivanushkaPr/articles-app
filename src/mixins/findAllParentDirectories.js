export default {
  methods: {
    findAllParentDirectories(categories, id) {
      return categories.reduce((acc, category) => {
        if (category.articlesIds.indexOf(id) !== -1) {
          acc.push(category.name);
        }

        if (category.children.length > 0) {
          acc.push(...this.findAllParentDirectories(category.children, id));
        }
        return acc;
      }, []);
    },
  },
};
