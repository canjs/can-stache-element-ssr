const { ensureDir, emptyDir, copy, readFile, writeFile } = require("fs-extra")
const path = require("path")
const spawnBuildProcess = require("./spawn-build-process")
const { getEnvConfiguration, getSggConfiguration } = require("../client-helpers/environment-helpers")
const spawn = require("./spawn-promise")
const getEnvironment = require("./get-environment")

// Get ssg settings based on environment
const envConfiguration = getEnvConfiguration(getEnvironment())

main()

async function main() {
  // Create and clear dist directory for static pages
  await ensureDir(envConfiguration.dist.basePath)
  await emptyDir(envConfiguration.dist.basePath)

  // Do SPA build if there's a build property for environment
  if (envConfiguration.build) {
    await spawn("node", envConfiguration.build.split(" "))
  }

  // Create and clear dist directory for static pages
  const staticPath = path.join(envConfiguration.dist.basePath, envConfiguration.dist.static)
  await ensureDir(staticPath)
  await emptyDir(staticPath)

  // await ensureDir("dist/ssg")
  // await emptyDir("dist/ssg")

  // Read paths to generate static pages
  const ssgConfiguration = getSggConfiguration()

  const routes = ssgConfiguration.routes

  // Generate static pages
  for (const route of routes) {
    spawnBuildProcess(route)
  }

  // Copy assets
  const baseAssetsDistPath = envConfiguration.dist.assets
    ? path.join(envConfiguration.dist.basePath, envConfiguration.dist.assets)
    : envConfiguration.dist.basePath

  for (const assetPath of ssgConfiguration.assets) {
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

  if (envConfiguration.dist.entryPoint) {
    const entryPointDistPath = path.join(envConfiguration.dist.basePath, envConfiguration.dist.entryPoint)

    const entryPoint = await readFile(envConfiguration.entryPoint)
    await writeFile(entryPointDistPath, entryPoint)
  }
}
