/**
 * Experimenting with async_hooks
 */
const async_hooks = require("async_hooks")
const fs = require("fs")
const { fd } = process.stdout

function delay(t, v) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t)
  })
}

/**
 * @deprecated
 */
let counter = 0

const ids = {}

const ah = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    counter += 1
    ids[asyncId] = true
    const eid = async_hooks.executionAsyncId()
    fs.writeSync(
      fd,
      `${type}(${asyncId}):` + ` trigger: ${triggerAsyncId} execution: ${eid} counter: ${counter} ids: ${Object.keys(ids).length}\n`,
    )
  },
  // before(asyncId) {
  //     fs.writeSync(fd, `before:  ${asyncId}\n`);
  // },
  // after(asyncId) {
  //     fs.writeSync(fd, `after:  ${asyncId}\n`);
  // },
  destroy(asyncId) {
    delete ids[asyncId]

    counter -= 1
    fs.writeSync(fd, `destroy:  ${asyncId} counter: ${counter} ids: ${Object.keys(ids).length}\n`)
    // if (!counter) {
    if (!Object.keys(ids).length) {
      onIdle()
    }
  },
  promiseResolve(asyncId) {
    delete ids[asyncId]

    counter -= 1
    fs.writeSync(fd, `promiseResolve:  ${asyncId} counter: ${counter} ids: ${Object.keys(ids).length}\n`)
    // if (!counter) {
    if (!Object.keys(ids).length) {
      onIdle()
    }
  },
})
ah.enable()

function onIdle() {
  ah.disable()
  // fs.writeSync(fd, "~~~finished~~~");
  console.log("~~~finished~~~")
}

setTimeout(() => {
  console.log("did another thing")
}, 400)

// setInterval(() => {
//     console.log('did a thing');
// }).unref();

delay(500)
// delay(1000);

// console.log("Before setTimeout", async_hooks.executionAsyncId());

// setTimeout(() => {
//     console.log("Inside setTimeout", async_hooks.executionAsyncId());

//     setTimeout(() => {
//         console.log("Nested Inside setTimeout", async_hooks.executionAsyncId());
//     }, 1000);
// }, 1000);

// console.log("After setTimeout", async_hooks.executionAsyncId());

// setTimeout(() => {
//     console.log("test");
// });

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
