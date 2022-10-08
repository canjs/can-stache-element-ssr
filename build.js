// build.js
const { createWriteStream } = require("fs");
const ssr = require("done-ssr");
const dom = require("can-zone-jsdom");
const { ensureDirSync } = require("fs-extra");

const render = ssr(
    {},
    {
        domZone: (request) => {
            console.log("build.js - dom-zone");
            return dom(request, {
                root: __dirname + "/build",
                html: "index.html",
            });
        },
    },
);

// Create dist directory
ensureDirSync('dist');

// source: https://nodejs.org/en/knowledge/advanced/streams/how-to-use-fs-create-write-stream/
const output = createWriteStream("dist/output.html");

render({
    // Some mock url that doesn't matter
    url: "http://localhost:8080",
}).pipe(output);
