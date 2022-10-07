// build.js
const { createWriteStream } = require("fs");
const ssr = require("done-ssr");
const dom = require("can-zone-jsdom");
const path = require('path');

const render = ssr(
    {},
    {
        // domZone: (request) => {
        //     console.log("build.js - dom-zone");
        //     return dom(request, {
        //         root: __dirname + '/build',
        //         html: "index.html",
        //     });
        // },
    },
);

// source: https://nodejs.org/en/knowledge/advanced/streams/how-to-use-fs-create-write-stream/


const output = createWriteStream("output.html");

// ... use render like normal.
render({
    url: "http://localhost:8080",
}).pipe(output);

/**
 * NodeFilter is not defined
    at getNodesWithTreeWalker (/Users/markthompson/Documents/github/bitovi/canjs-playground/can-stache-element-ssr/node_modules/done-ssr/node_modules/can-dom-mutate/-util.js:127:3)
 * 
 */
