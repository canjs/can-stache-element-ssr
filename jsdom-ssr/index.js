const spawnBuildProcess = require("./spawn-build-process")
const { ensureDir, emptyDir, readJson, copy, readFile, writeFile, remove } = require("fs-extra")
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
  const ssgSettings = await readJson("ssg.json")

  const routes = ssgSettings.routes

  for (const route of routes) {
    spawnBuildProcess(route, !!argv.prod)
  }

  // Copy assets
  await remove("dist/assets")
  await copy("assets", "dist/assets")

  // TODO: when SPA production, we should read only from dist for everything
  // Copy production.html and rename to index.html
  // if (argv.prod) {
  //   const entryPoint = await readFile('production.html')
  //   await writeFile('dist/index.html', entryPoint)
  // }
}
