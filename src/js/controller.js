import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/pagination.js';

// polyfilling
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const { async } = require('q');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //  update results view to mark selected search result
    resultsView.update(model.getResultsPerPage());

    // loading recipe
    await model.loadRecipe(id);

    // rendering recipe
    recipeView.render(model.state.recipe);

    // controlServing();
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResult(query);
    // resultsView.reder(model.state.search.results);
    resultsView.render(model.getResultsPerPage(1));

    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlPagination = function (gotoPage) {
  resultsView.render(model.getResultsPerPage(gotoPage));

  paginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  // update the serving (in state)
  model.updateServing(newServing);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

  // update the recipe view
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServing);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  // controlServing();
};
init();
