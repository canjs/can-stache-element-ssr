const build = require('./alt-build');
const { ensureDirSync, emptyDirSync } = require("fs-extra");
// const { Worker, isMainThread, parentPort } = require('worker_threads');
const path = require('path');

// // Prevent program from closing unexpectly
// // call `process.exit();` to end program when needed
// process.stdin.resume();

// const altRequestBuild = path.join(__dirname, 'alt-request-build.js');

main();

async function main() {
    // Create dist directory
    await ensureDirSync('dist');
    // Clear it
    await emptyDirSync('dist');

    const routes = [
        'http://127.0.0.1:5501',
        'http://127.0.0.1:5501/index.html#!tasks',
        'http://127.0.0.1:5501/index.html#!this-page-does-not-exist',
    ];

    // for (const route of routes) {
    //     const worker = new Worker(altRequestBuild, {
    //         argv: [route]
    //     });
    //     worker.once("exit", () => {
    //         console.log("worker exit", route);
    //     });
    //     // Listen for messages from the worker and print them.
    //     // worker.on('message', (msg) => {
    //     //     console.log(msg);
    //     //     if (i === routes.length) {
    //     //         process.exit();
    //     //     }
    //     // });
    // }

    // if (isMainThread) {
        
    // } else {
    //     i++;
    //     console.log("not parent thread", i);
    //     // This code is executed in the worker and not in the main thread.
        
    //     // Send a message to the main thread.
    //     parentPort.postMessage('Hello world!');
    // }

    for (const route of routes) {
        build(route);
    }

    // build('http://127.0.0.1:5501');
    // build('http://127.0.0.1:5501/index.html#!tasks');
    // build('http://127.0.0.1:5501/index.html#!this-page-does-not-exist');
}
