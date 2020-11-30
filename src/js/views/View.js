import icons from 'url:../../img/icons.svg';
export default class View {
  _data;
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markUp = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();
    this._data = data;
    const newMarkUp = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkUp);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      // text
      const curEl = currElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // attribute
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(el => {
          curEl.setAttribute(el.name, el.value);
        });
      }
    });
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
