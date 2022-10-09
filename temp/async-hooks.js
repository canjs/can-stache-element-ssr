/**
 * Experimenting with async_hooks
 */
const async_hooks = require("async_hooks");
const fs = require("fs");
const { fd } = process.stdout;

let counter = 0;

const ah = async_hooks
    .createHook({
        init(asyncId, type, triggerAsyncId) {
            counter += 1;
            const eid = async_hooks.executionAsyncId();
            fs.writeSync(fd, `${type}(${asyncId}):` + ` trigger: ${triggerAsyncId} execution: ${eid}\nInit counter: ${counter}\n`);
        },
        before(asyncId) {
            fs.writeSync(fd, `before:  ${asyncId}\n`);
        },
        after(asyncId) {
            fs.writeSync(fd, `after:  ${asyncId}\n`);
        },
        destroy(asyncId) {
            counter -= 1;
            fs.writeSync(fd, `destroy:  ${asyncId}\nDestroy counter: ${counter}\n`);
            if (!counter) {
                test();
            }
        },
    })
ah.enable();

function test() {
    ah.disable();
    // fs.writeSync(fd, "~~~finished~~~");
    console.log("~~~finished~~~");
};

// Use steal 
// Use steal in node to import app
// 

console.log("Before setTimeout", async_hooks.executionAsyncId());


setTimeout(() => {
    console.log("Inside setTimeout", async_hooks.executionAsyncId());

    setTimeout(() => {
        console.log("Nested Inside setTimeout", async_hooks.executionAsyncId());
    }, 1000);
}, 1000);

console.log("After setTimeout", async_hooks.executionAsyncId());

setTimeout(() => {
    console.log("test");
});



// 0.
// jsdom doesn't not support web components being defined in multiple documents
// insert error message
// we will have to reinitialize the canjs application + new jsdom instance for each page
// 
// 0.5
// "everything done" callback instead of implementing it using async_hooks
// process on exit
// 
// 1.
// new jsdom
// import canjs application with stealjs (steal import)
// at finish -> innerHTML into file
//
// 2.
// next step options
// routing examples
// reattachment
// complex network request use fetch
//      store all api requests -> responses
//      provide this as cache from server to client
// web workers
// can-simple-dom
