import icons from 'url:../../img/icons.svg';
export default class View {
  _data;
  reder(data) {
    this._data = data;
    const markUp = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markUp = `
  <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
  renderError(message = this._errorMessage) {
    const markUp = `<div class="error">
          <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
          </div>
            <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
  renderMessage(message = this._successMessage) {
    const markUp = `<div class="Message">
          <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
          </div>
            <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
}
