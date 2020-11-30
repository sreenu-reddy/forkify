import View from './View.js';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from '../config.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const gotoPage = +btn.dataset.goto;

      handler(gotoPage);
    });
  }
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // 1 page 1 and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return `
          <button data-goto=${
            this._data.page + 1
          } class="btn--inline pagination__btn--next">
            <span> page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    // 2 page 1 and there is no other page
    if (numPages === 1) {
      return ``;
    }
    // 3 other pages
    if (this._data.page < numPages) {
      return `<button data-goto=${
        this._data.page - 1
      } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>
          <button data-goto=${
            this._data.page + 1
          } class="btn--inline pagination__btn--next">
            <span> page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    // 4 on the last page
    if (this._data.page === numPages && numPages > 1) {
      return `<button data-goto=${
        this._data.page - 1
      } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>
          `;
    }
  }
}

export default new PaginationView();
