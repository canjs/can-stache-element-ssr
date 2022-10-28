const { Worker, isMainThread, parentPort } = require("worker_threads")
const argv = require("optimist").argv

async function onExit(worker, callback) {
  return new Promise((resolve) => {
    worker.once("exit", () => {
      resolve(callback())
    })
  })
}

const fs = require("fs")
console.log(__filename)
if (isMainThread) {
  const promises = []

  const w1 = new Worker(__filename, {
    argv: ["--moo", "cow"],
  }) //.unref()

  promises.push(
    onExit(w1, () => {
      console.log("worker 2 exit")
    }),
  )
  // w1.once("exit", () => {
  //   console.log("worker 2 exit")
  // })
  w1.once("message", (data) => {
    console.log("PARENT GOT WORK", JSON.parse(data).work)
  })

  const w2 = new Worker(__filename, {
    argv: ["--foo", "bar"],
  }) //.unref()

  promises.push(
    onExit(w2, () => {
      console.log("worker 2 exit")
    }),
  )
  // w2.once("exit", () => {
  //   console.log("worker 2 exit")
  // })
  w2.once("message", (data) => {
    console.log("PARENT GOT WORK", JSON.parse(data).work)
  })

  Promise.all(promises).then(() => {
    console.log("all completed")
  })
} else {
  const random = Math.random()
  console.log("WORKER", random, argv.moo, argv.foo)

  // This output will be blocked by the for loop in the main thread.
  setTimeout(function () {
    console.log("WORK COMPLETED", 2000 * random)
  }, 2000 * random)

  process.once("beforeExit", () => {
    fs.writeFileSync(`dist/worker-${random}.md`, `${random}`)
    parentPort.postMessage(JSON.stringify({ work: random }))
    console.log(`EXIT: ${random}`)
  })
}

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
