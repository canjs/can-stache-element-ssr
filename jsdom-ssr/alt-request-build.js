const runAtIdle = require("./run-at-idle");
const init = require("./global-init");
const { writeFile } = require('fs-extra');

// Prevent program from closing unexpectly
// call `process.exit();` to end program when needed
process.stdin.resume();

// Get url from args
const args = process.argv.slice(2);
const url = args[0] || 'http://127.0.0.1:5501/index.html#!tasks';

// Setup creating dist once all async code is finished
runAtIdle(wrapUp);

// Setup jsdom
const body = '{{ body }}';

const html = `<!doctype html>
<title>CanJS and StealJS</title>
<body>${body}</body>`;

init(html.replace(body, ''), url);
// Setup jsdom END

// Run client-side code
require('../client');

// Add to jsdom document
document.body.appendChild(document.createElement('my-app'));

async function wrapUp() {
    // Write scrapped html to dist
    await writeFile(`dist/${getFilename(url)}.html`, html.replace(body, document.body.innerHTML));

    process.exit();
}

/**
 * Create filename based on url
 */
function getFilename(url) {
    const [host, ...rest] = url.split('/');
    return rest.join('_').replace(/[^a-zA-Z0-9 ]/g, '_');
}
