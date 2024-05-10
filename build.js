import { create, getCategories } from './tools/tools.js';
import austria from './src/austria.js';

const categories = getCategories(austria);
categories.forEach((category) => {
  create(
    austria.filter((val) => val.category.indexOf(category) > -1),
    `austria-${category}`
  );
});

// const sports = austria.filter(
//   (val, ind) => val.category.indexOf('sports') > -1
// );
// create(sports, 'austria-sports');
