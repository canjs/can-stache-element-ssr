const { ensureDir, emptyDir, copy, readFile, writeFile } = require("fs-extra")
const path = require("path")
const spawnBuildProcess = require("./spawn-build-process")
const { getEnvConfiguration, getSggConfiguration } = require("../client-helpers/environment-helpers")
const spawn = require("./util/spawn-promise")
const getEnvironment = require("./flags/get-ssg-environment")

// Get ssg settings based on environment
const envConfiguration = getEnvConfiguration(getEnvironment())

main()

async function main() {
  // Create and clear dist directory for static pages
  const distPath = path.join("dist", envConfiguration.dist.basePath)

  await ensureDir(distPath)
  await emptyDir(distPath)

  // Do SPA build if there's a build property for environment
  if (envConfiguration.build) {
    await spawn("node", envConfiguration.build.split(" "))
  }

  // Create and clear dist directory for static pages
  const staticPath = path.join("dist", envConfiguration.dist.basePath, envConfiguration.dist.static)

  await ensureDir(staticPath)
  await emptyDir(staticPath)

  // Read paths to generate static pages
  const ssgConfiguration = getSggConfiguration()

  const routes = ssgConfiguration.routes

  // Generate static pages
  for (const route of routes) {
    spawnBuildProcess(route)
  }

  // Copy assets
  const baseAssetsDistPath = envConfiguration.dist.assets
    ? path.join("dist", envConfiguration.dist.basePath, envConfiguration.dist.assets)
    : distPath

  for (const assetPath of ssgConfiguration.assets) {
    const assetsDistPathInDist = path.join(baseAssetsDistPath, assetPath)

    await copy(assetPath, assetsDistPathInDist)
  }

  if (envConfiguration.dist.entryPoint) {
    const entryPointPath = path.join("dist", envConfiguration.dist.basePath, envConfiguration.dist.entryPoint)

    const entryPoint = await readFile(envConfiguration.entryPoint)
    await writeFile(entryPointPath, entryPoint)
  }
}
