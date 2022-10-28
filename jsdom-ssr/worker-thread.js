const { Worker, isMainThread, parentPort } = require("worker_threads")
const path = require("path")
const argv = require("optimist").argv

// async function onExit(worker, callback) {
//   return new Promise((resolve) => {
//     worker.once("exit", () => {
//       resolve(callback && callback())
//     })
//   })
// }

const baseUrl = "http://127.0.0.1:8080/index.html"

module.exports = function (id, prod = false) {
  const args = ["--id", id]

  if (prod) {
    args.push("--prod", "true")
  }

  const worker = new Worker(path.join(__dirname, "scrape-worker.js"), {
    argv: args,
  })

  return worker

  // return onExit(worker)
}
