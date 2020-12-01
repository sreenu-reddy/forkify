import { async } from 'regenerator-runtime';
import { API_URl, RES_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './helper.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URl}${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      servings: recipe.servings,
      cookingtime: recipe.cooking_time,
    };
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(`${err} 💥`);
    throw err;
  }
};

// Search results
export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URl}/?search=${query}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

// implementing pagination
export const getResultsPerPage = function (page = state.search.page) {
  state.search.page = page;
  const startOfPage = (page - 1) * state.search.resultsPerPage;
  const endOfPage = page * state.search.resultsPerPage;

  return state.search.results.slice(startOfPage, endOfPage);
};

export const updateServing = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServing / state.recipe.servings);
  });
  state.recipe.servings = newServing;
};

const addLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // add a bookmark

  state.bookmarks.push(recipe);

  // check current page as a bookmark

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  addLocalStorage();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(e => e.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  addLocalStorage();
};

export const UploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            `Wrong ingredients format! please use correct ingredient format:)`
          );
        const [quantity, price, description] = ingArr;
        return { quantity: quantity ? +quantity : null, price, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingtime,
      servings: newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);

  console.log(storage);
};
init();
