// main.js
console.log('main.js is imported~');

const StacheElement = require("can-stache-element");
// import { StacheElement } from "can";
const view = require("./app.stache");
// import view from "./app.stache";

class MyStacheElement extends StacheElement {
  static view = view;

  static props = {
    message: "Stache is cool"
  };
}

customElements.define("my-stache-element", MyStacheElement);

// Extend Component to define a custom element
class MyCounter extends StacheElement {
  static view = `
      Count: <span>{{ this.count }}</span>
      <button on:click='this.increment()'>+1</button>
  `;

  static props = {
      count: 0
  };

  increment() {
      this.count++;
  }
}

customElements.define("my-counter", MyCounter);

class MyApp extends StacheElement {
  static view = `
  Hello {{ this.name }}!
  <my-stache-element></my-stache-element>
  `;

  static props = {
    name: "world"
  };

  /**
   * as long as you call super.connectedCallback() there's no error in cleanup
   */
  // connectedCallback() {
  //   super.connectedCallback();

  //   console.log('MyApp - connectedCallback');
  //   console.log(this.innerHTML);
  //   this.name = "connectedCallback";
  //   console.log(this.innerHTML);
  // }

  connected() {
    console.log('MyApp - connected');
    this.name = "canjs";
    this.appendChild(document.createElement('my-counter'));
  }
}

customElements.define("my-app", MyApp);

// dom.js
// v12.22.11 for node
// kevin, justin

// chrome://inspect/
// --inspect-brk


// Temp fix for -util.js is found at root for `node_modules/done-ssr/node_modules/can-dom-mutate/-util.js`
// export default function(request) {
module.exports = function(request) {
  console.log('main.js default export');

  addMyCustomElement();

  // CanJS
  document.body.appendChild(document.createElement('my-app'));

  // document.body.innerHTML = `
  // <my-app></my-app>
  // `;
}

/**
 * Adds simple custom element that updates its innerHTML
 */
function addMyCustomElement() {
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

  // connectedCallback

  customElements.define("my-custom-element", CustomElement);

  document.body.appendChild(document.createElement('my-custom-element'));
}