import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import BookmarkView from './views/bookmarksView';
import paginationView from './views/pagination.js';
// import addRecipeView from './views/addRecipeView';

// polyfilling
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bookmarksView from './views/bookmarksView';

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
    // updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    // loading recipe
    await model.loadRecipe(id);

    // rendering recipe
    recipeView.render(model.state.recipe);

    // controlServing();
  } catch (err) {
    recipeView.renderError();
    console.error(err);
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

// controll a book mark

const controlAddBookmark = function () {
  // add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // update the bookmark
  recipeView.update(model.state.recipe);

  // render bookmarks

  BookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// const controlUpload = async function (newRecipe) {
//   try {
//     await model.UploadRecipe(newRecipe);
//   } catch (err) {
//     addRecipeView.renderError(err.message);
//   }
// };

const init = function () {
  bookmarksView.addhandlerBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  // addRecipeView.addHandlerUpload(controlUpload);

  controlServing();
};
init();
