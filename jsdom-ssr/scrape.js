const steal = require("steal");
const setupGlobals = require("./setup-globals");
const { writeFile } = require('fs-extra');

// Get url from args
const args = process.argv.slice(2);
const url = args[0] || 'http://127.0.0.1:5501';

// Throw if build takes too long
const timeout = setTimeout(() => {
    throw new Error('timed out ):');
}, 5000).unref();

/**
 * Wait for process to become idle (no async tasks are pending)
 * 
 * This is when it is safe to scrape document
 */
process.once("beforeExit", (code) => {
    clearTimeout(timeout);

    // TODO: should we consider code? code === 0?
    scrapeDocument();
});

// Setup JSDOM and global.window, global.document, global.location
setupGlobals(`<!doctype html>
<title>CanJS and StealJS</title>`, url);

populateDocument();

async function populateDocument() {
    // Run client-side code
    await steal.startup();

    console.log("steal - done");

    // Add to jsdom document
    document.body.appendChild(document.createElement('my-app'));
}

/**
 * Once async tasks are completed, scrap document into dist
 */
async function scrapeDocument() {
    // Write scrapped dom to dist
    // window.document.documentElement.outerHTML;
    await writeFile(`dist/${getFilename(url)}.html`, window.document.documentElement.outerHTML);
}

/**
 * Create filename based on url
 *
 * TODO: create dist directory based on url path
 * TODO: consider query params
 */
function getFilename(url) {
    const [, ...rest] = url.replace('http://', '').replace('https://', '').split('/');
    return rest.join('_').replace(/[^a-zA-Z0-9 ]/g, '_') || 'index';
}
