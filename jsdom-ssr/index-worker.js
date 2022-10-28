const { isMainThread } = require("worker_threads")

const workerThread = require("./worker-thread")

const { ensureDir, emptyDir, readJson } = require("fs-extra")
const stealTools = require("steal-tools")
const argv = require("optimist").argv

main()

async function main() {
  // Create production bundle as needed
  // Development doesn't require a build for ssr
  if (argv.prod) {
    await stealTools.build(
      {},
      {
        bundleSteal: true,
      },
    )
  }

  // Create dist directory
  await ensureDir("dist/ssr")

  // Clear it
  await emptyDir("dist/ssr")

  // Read paths to generate static pages
  // const ssgSettings = await readJson("ssg.json")
  const ssgSettings = await readJson("ssg-max.json")

  const routes = ssgSettings.routes

  const initialLength = routes.length

  const workerCount = 32

  const workers = []

  for (let i = 0; i < Math.min(routes.length, workerCount); i++) {
    const worker = workerThread(i, !!argv.prod)
    worker.postMessage(routes.pop())

    worker.on("message", () => {
      const route = routes.pop()
      worker.postMessage(route)
    })

    workers.push(worker)
  }

  await Promise.all(workers.map((worker) => onExit(worker)))

  console.log(`Finished: ${initialLength - routes.length}`)
}

async function onExit(worker, callback) {
  return new Promise((resolve) => {
    worker.once("exit", () => {
      resolve(callback && callback())
    })
  })
}

// Time things:
// npm i -D gnomon
// npm run build | gnomon
// pool of 32 -> 71.0153s
// pool of 32 -> 90.5499s (while watching something on youtube)

// Invalid constructor, the constructor is not part of the custom element registry
// error comes from jsdom, file search node_modules
// 81.6880s
// Recreatable from 1 to 11
/**
 *     "http://127.0.0.1:8080/progressive-loading/cow",
    "http://127.0.0.1:8080/progressive-loading/moo"
 */

// 400 -> 84.0856s
