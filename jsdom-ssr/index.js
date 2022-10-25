const pLimit = require("p-limit")

const spawnBuildProcess = require("./spawn-build-process")
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
  const ssgSettings = await readJson("ssg-max.json")

  const routes = ssgSettings.routes

  // const limit = pLimit(40);

  // const pool = routes.map(route => limit(function(){
  //   // return spawnBuildProcess(route, !!argv.prod)
  //   return workerThread(route,!!argv.prod)
  // }));

  // const completed = await Promise.all(pool);

  // console.log(completed.length);

  for (const route of routes) {
    // spawnBuildProcess(route, !!argv.prod)
    workerThread(route, !!argv.prod)
  }
}

// Time things:
// npm i -D gnomon
// npm run build | gnomon
