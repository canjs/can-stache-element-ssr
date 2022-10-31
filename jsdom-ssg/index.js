const { ensureDir, emptyDir, readJson, copy, readFile, writeFile, remove } = require("fs-extra")
const path = require("path")
const argv = require("optimist").argv
const spawnBuildProcess = require("./spawn-build-process")
const getEnvSettings = require("./get-env-settings")
const spawn = require("../util/spawn-promise")
// Get ssg settings based on environment
const envSettings = getEnvSettings()

main()

async function main() {
  // Create and clear dist directory for static pages
  await ensureDir(envSettings.dist.basePath)
  await emptyDir(envSettings.dist.basePath)

  // Do SPA build if there's a build property for environment
  if (envSettings.build) {
    await spawn("node", envSettings.build.split(" "))
  }

  // Create and clear dist directory for static pages
  const staticPath = path.join(envSettings.dist.basePath, envSettings.dist.static)
  await ensureDir(staticPath)
  await emptyDir(staticPath)

  // await ensureDir("dist/ssg")
  // await emptyDir("dist/ssg")

  // Read paths to generate static pages
  const ssgSettings = await readJson("ssg.json")

  const routes = ssgSettings.routes

  // Generate static pages
  for (const route of routes) {
    spawnBuildProcess(route)
  }

  // Copy assets
  const baseAssetsDistPath = envSettings.dist.assets
    ? path.join(envSettings.dist.basePath, envSettings.dist.assets)
    : envSettings.dist.basePath

  for (const assetPath of ssgSettings.assets) {
    const assetsDistPathInDist = path.join(baseAssetsDistPath, assetPath)

    await copy(assetPath, assetsDistPathInDist)
  }

  // await remove("dist/assets")
  // await copy("assets", "dist/assets")

  // TODO: when SPA production, we should read only from dist for everything
  // Copy production.html and rename to index.html
  // if (argv.prod) {
  //   const entryPoint = await readFile('production.html')
  //   await writeFile('dist/index.html', entryPoint)
  // }

  if (envSettings.dist.entryPoint) {
    const entryPointDistPath = path.join(envSettings.dist.basePath, envSettings.dist.entryPoint)

    const entryPoint = await readFile(envSettings.entryPoint)
    await writeFile(entryPointDistPath, entryPoint)
  }
}
