// main.js
require('../client');

// kevin, justin

// export default function(request) {// <-- doesn't work ):
module.exports = function(request) {
  console.log('main.js default export - START', location.hash);

  // document.body.appendChild(document.createElement('my-app'));
  document.body.appendChild(document.createElement('my-routing-app'));

  // Note this doesn't show up on index.html, only for the ssr build
  appendSimpleCustomElement();

  // document.body.innerHTML = `
  // <my-app></my-app>
  // `;
  console.log('main.js default export - END', location.hash);
}

/**
 * Adds simple custom element that updates its innerHTML
 */
/**
 * Adds simple custom element that updates its innerHTML
 */
 function appendSimpleCustomElement() {
  class CustomElement extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `<p>Hello, World! from CustomElement</p>`;
    }
  }

  customElements.define("my-custom-element", CustomElement);

  document.body.appendChild(document.createElement('my-custom-element'));
}
