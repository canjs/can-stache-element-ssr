// main.js
console.log('main.js is imported~');
// import { StacheElement } from "can";
// import view from "./app.stache";

// dom.js
// v12.22.11 for node
// kevin, justin

// Temp fix for -util.js is found at root for `node_modules/done-ssr/node_modules/can-dom-mutate/-util.js`
// Temp fix for can-zone-jsdom dependency `node_modules/can-zone-jsdom/package.json ^16.7.0`
// Delete package-lock.json and `npm i`
module.exports = function(request) {
  class CustomElement extends window.HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
  
      // write element functionality in here
    }

    connectedCallback() {
      this.innerHTML = `<h1>Hello, World!</h1>`;
    }
  }

  console.log('main.js default export');

  window.customElements.define("my-custom-element", CustomElement);

  // Mock simple html
  // Simple div
  document.body.appendChild(document.createElement('div'));
  // Custom element
  document.body.appendChild(document.createElement('my-custom-element'));
}
