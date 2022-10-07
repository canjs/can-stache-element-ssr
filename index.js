import nodeFilters from './node-filters';
console.log('index.js is imported~');
// index.js
// import { StacheElement } from "can";
// import view from "./app.stache";

// class MyApp extends StacheElement {
//   static view = view;

//   static props = {
//     message: {
//       default: "Hello World"
//     }
//   };
// };

// customElements.define("my-app", MyApp);
// dom.js
// v12.22.11 for node
// kevin, justin

// Temp fix for -util.js is found at root for `node_modules/done-ssr/node_modules/can-dom-mutate/-util.js`

module.exports = function() {
    console.log('index.js default export');
    
    // Polyfills
    nodeFilters(window, document);
    console.log(window.NodeFilter);

    //Mock simple html
    document.body.appendChild(document.createElement('div'));
}
