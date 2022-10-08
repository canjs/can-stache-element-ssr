// main.js
console.log('main.js is imported~');
// import { StacheElement } from "can";
// import view from "./app.stache";

// dom.js
// v12.22.11 for node
// kevin, justin

// Temp fix for -util.js is found at root for `node_modules/done-ssr/node_modules/can-dom-mutate/-util.js`
module.exports = function(request) {
  class CustomElement extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
  
      // write element functionality in here
    }

    connectedCallback() {
      this.innerHTML = `<h1>Hello, World!</h1>`;
    }
  }

  // class MyApp extends StacheElement {
  //   static view = `Hello {{ this.name }}!`;
  
  //   static props = {
  //     name: "world"
  //   };
  // }
  
  // customElements.define("my-app", MyApp);

  console.log('main.js default export');

  customElements.define("my-custom-element", CustomElement);

  // Mock simple html
  // Simple div
  document.body.appendChild(document.createElement('div'));
  // Custom element
  document.body.appendChild(document.createElement('my-custom-element'));
  // CanJS
  // document.body.appendChild(document.createElement('my-app'));
}
