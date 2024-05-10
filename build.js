import { create, getCategories } from './tools/tools.js';
import austria from './src/austria.js';
import germany from './src/germany.js';

// AUSTRIA
const categoriesAT = getCategories(austria);
categoriesAT.forEach((category) => {
  create(
    austria.filter((val) => val.category.indexOf(category) > -1),
    category,
    `austria-${category}`
  );
});

// GERMANY
const categoriesDE = getCategories(germany);
categoriesDE.forEach((category) => {
  create(
    germany.filter((val) => val.category.indexOf(category) > -1),
    category,
    `germany-${category}`
  );
});
