const { createWriteStream } = require("fs");
const { ensureDirSync, emptyDirSync } = require("fs-extra");
const ssr = require("done-ssr");
const dom = require("can-zone-jsdom");
const path = require('path');

main();

async function main() {
    // Create dist directory
    await ensureDirSync('dist');
    // Clear it
    await emptyDirSync('dist');

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
    
    // source: https://nodejs.org/en/knowledge/advanced/streams/how-to-use-fs-create-write-stream/
    const homeOutput = createWriteStream("dist/home.html");
    
    render({
        url: "http://localhost:8080",
    }).pipe(homeOutput);
    
    const taskOutput = createWriteStream(path.join(__dirname, "dist/task.html"));
    
    render({
        url: "http://127.0.0.1:5501/index.html#!tasks",
    }).pipe(taskOutput);
    
    const unknownOutput = createWriteStream("dist/404.html");
    
    render({
        url: "http://127.0.0.1:5501/index.html#!this-page-does-not-exist",
    }).pipe(unknownOutput);
}
