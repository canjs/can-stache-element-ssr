const build = require('./alt-build');
const { ensureDirSync, emptyDirSync } = require("fs-extra");

main();

async function main() {
    // Create dist directory
    await ensureDirSync('dist');
    // Clear it
    await emptyDirSync('dist');

    build('http://127.0.0.1:5501');
    build('http://127.0.0.1:5501/index.html#!tasks');
    build('http://127.0.0.1:5501/index.html#!this-page-does-not-exist');
}
