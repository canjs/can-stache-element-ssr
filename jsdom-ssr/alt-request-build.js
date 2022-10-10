const steal = require("steal");
const setupWindow = require("./setup-window");
const { writeFile } = require('fs-extra');

// Get url from args
const args = process.argv.slice(2);
const url = args[0] || 'http://127.0.0.1:5501';

process.once("beforeExit", (code) => {
    // TODO: should we consider code? code === 0?
    wrapUp();
});

// Setup jsdom
const body = '{{ body }}';

const html = `<!doctype html>
<title>CanJS and StealJS</title>
<body>${body}</body>`;

setupWindow(html.replace(body, ''), url);
// Setup jsdom END

populateHtml();

async function populateHtml() {
    // Throw if build takes too long
    const timeout = setTimeout(() => {
        throw new Error('timed out ):');
    }, 5000);

    // Run client-side code
    await steal.startup({
        main: "~/client",
        babelOptions: {
            plugins: ["transform-class-properties"],
        },
        plugins: ["can"],
    });

    console.log("steal - done");

    // Add to jsdom document
    document.body.appendChild(document.createElement('my-app'));
    clearTimeout(timeout);
}

/**
 * Once async tasks are completed, scrap dom into dist
 */
async function wrapUp() {
    // Write scrapped dom to dist
    await writeFile(`dist/${getFilename(url)}.html`, html.replace(body, document.body.innerHTML));
}

/**
 * Create filename based on url
 */
function getFilename(url) {
    const [, ...rest] = url.replace('http://', '').replace('https://', '').split('/');
    return rest.join('_').replace(/[^a-zA-Z0-9 ]/g, '_') || 'index';
}
