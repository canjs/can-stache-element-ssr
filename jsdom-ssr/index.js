const pLimit = require("p-limit")

const spawnBuildProcess = require("./spawn-build-process")

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

  const limit = pLimit(32)

  const pool = routes.map((route) =>
    limit(function () {
      return spawnBuildProcess(route, !!argv.prod)
    }),
  )

  const completed = await Promise.all(pool)

  console.log(`Finished: ${completed.length}`)
}

// Time things:
// npm i -D gnomon
// npm run build | gnomon

// At 400,  155.3191s with all processes -> crash...
// pool of 32 -> 95.6140s
// pool of 32 -> 118.9888s (while watching something on youtube)
