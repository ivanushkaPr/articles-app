export default [{
  name: 'Категория 1',
  articlesIds: [1, 2, 3, 4],
  children: [{
    name: 'Подкатегория 1',
    articlesIds: [4, 5, 6],
    children: [
      {
        name: 'Подкатегория подкатегории 1',
        articlesIds: [7, 8, 9],
        children: [],
      },
      {
        name: 'Подкатегория подкатегории 2',
        articlesIds: [7, 8, 9],
        children: [],
      },
    ],
  }, {
    name: 'Подкатегория 2',
    articlesIds: [4, 5, 6],
    children: [],
  }],
}, {
  name: 'Категория 2',
  articlesIds: [1, 2, 3, 4],
  children: [],
}, {
  name: 'Категория 3',
  articlesIds: [1, 2, 3, 4],
  children: [],
}, {
  name: 'Категория 4',
  articlesIds: [1, 2, 3, 4],
  children: [],
}];
