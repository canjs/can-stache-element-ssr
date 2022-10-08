// main.js
const StacheElement = require("can-stache-element");
// const {StacheElement} = require("can");
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
  // TODO: https://canjs.com/doc/guides/html.html#Stachetemplatesandbindings
  // {{# is(this.count, 1) }} Count is 1 {{ else }} Count is not 1 {{/ if }}
  // should end with {{/ is }}
  // {{# is(this.count, 1) }} Count is 1 {{ else }} Count is not 1 {{/ is }}

  static view = `
      <div>Count: <span>{{ this.count }}</span><button on:click='this.increment()'>+1</button></div>
      <div>Count using if: {{# if(this.count) }} Count not 0 {{ else }} Count is 0 {{/ if }}</div>
      <div>Count using is: {{# is(this.count, 1) }} Count is 1 {{ else }} Count is not 1 {{/ is }}</div>
      <div>Count using for: {{# for(item of this.items) }} {{ item.name }} {{/ for }}</div>
  `;

  static props = {
      count: 0,
      // TODO: example for using `for` isn't working as expected
      items: [{ name: 'some-item' }, { name: 'some-next-item' }]
  };

  increment() {
      this.count++;
  }
}

customElements.define("my-counter", MyCounter);

class MyApp extends StacheElement {
  static view = `
  <h1>Hello {{ this.name }}!</h1>
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
    // TODO: this works for ssr, but doesn't for index.html
    // index.html doesn't show this element
    // but dist/output.html does show this element
    this.appendChild(document.createElement('my-counter'));
  }
}

customElements.define("my-app", MyApp);


// kevin, justin

// export default function(request) {// <-- doesn't work ):
module.exports = function(request) {
  console.log('main.js default export - START');

  appendSimpleCustomElement();

  document.body.appendChild(document.createElement('my-app'));

  // document.body.innerHTML = `
  // <my-app></my-app>
  // `;
  console.log('main.js default export - END');
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
