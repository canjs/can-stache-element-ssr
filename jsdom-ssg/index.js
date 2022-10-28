const spawnBuildProcess = require("./spawn-build-process")
const { ensureDir, emptyDir, readJson } = require("fs-extra")
const stealTools = require("steal-tools")
const argv = require("optimist").argv

main()

async function main() {
  // Create production bundle as needed
  // Development doesn't require a build for ssg
  if (argv.prod) {
    await stealTools.build(
      {},
      {
        bundleSteal: true,
      },
    )
  }

  // Create dist directory
  await ensureDir("dist/ssg")

  // Clear it
  await emptyDir("dist/ssg")

  // Read paths to generate static pages
  const ssgSettings = await readJson("ssg.json")

  const routes = ssgSettings.routes

  for (const route of routes) {
    spawnBuildProcess(route, !!argv.prod)
  }
}
