import { async } from 'regenerator-runtime';
import { API_URl, RES_PER_PAGE } from './config.js';
import { getJSON } from './helper.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
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
    console.log(recipe);
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
