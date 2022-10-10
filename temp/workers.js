const { Worker, isMainThread, parentPort } = require("worker_threads");

const fs = require("fs");

if (isMainThread) {
    const w1 = new Worker(__filename); //.unref()
    w1.once("exit", () => {
        console.log("worker 1 exit");
    });
    w1.once("message", (data) => {
        console.log("PARENT GOT WORK", JSON.parse(data).work);
    });

    const w2 = new Worker(__filename); //.unref()
    w2.once("exit", () => {
        console.log("worker 2 exit");
    });
    w2.once("message", (data) => {
        console.log("PARENT GOT WORK", JSON.parse(data).work);
    });
} else {
    const random = Math.random();
    console.log(this);
    console.log("WOKER", random);
    // This output will be blocked by the for loop in the main thread.
    setTimeout(function () {
        console.log("WORK COMPLETED", 2000 * random);
    }, 2000 * random);
    process.once("beforeExit", () => {
        fs.writeFileSync(`dist/worker-${random}.md`, random);
        parentPort.postMessage(JSON.stringify({ work: random }));
        console.log(`EXIT: ${random}`);
    });
}
