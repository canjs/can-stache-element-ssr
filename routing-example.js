// main.js
const type = require("can-type");
const StacheElement = require("can-stache-element");
// const {StacheElement} = require("can");
// import { StacheElement } from "can";
const view = require("./app.stache");
// import view from "./app.stache";

class ValueFromInput extends StacheElement {
  static view = `
    <input value:from="count"/>
  `;

  static props = {
    count: {
      // Makes count increase by 1 every
      // second.
      value(prop) {
        let count = prop.resolve(20);
        let timer = setInterval( () => {
          prop.resolve(++count);
        },1000);
        // Return a cleanup function
        // that is called when count
        // is longer used.
        return () => {
          clearTimeout(timer);
        };
      }
    }
  };
}
customElements.define("my-value-from-input", ValueFromInput);

class ValueToInput extends StacheElement {
  static view = `
    <input value:to="this.count"/> Count: {{ this.count }}
  `;

  static props = {
    count: type.convert(Number)
  };
}

customElements.define("my-value-to-input", ValueToInput);

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
  <my-value-to-input></my-value-to-input>
  <my-value-from-input></my-value-from-input>
  `;

  static props = {
    name: "world"
  };

  connected() {
    console.log('MyApp - connected');
    this.name = "canjs";
    this.appendChild(document.createElement('my-counter'));
  }
}

customElements.define("my-app", MyApp);

module.exports = function(request) {
  document.body.appendChild(document.createElement('my-app'));
}
