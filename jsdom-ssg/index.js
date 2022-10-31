const { ensureDir, emptyDir, copy, writeFile } = require("fs-extra")
const path = require("path")
const spawnBuildProcess = require("./spawn-build-process")
const { getEnvConfiguration, getSggConfiguration } = require("../client-helpers/environment-helpers")
const spawn = require("./util/spawn-promise")
const getEnvironment = require("./flags/get-ssg-environment")
const stripMainScript = require("./util/strip-main-script")

// Get general ssg configuration
const ssgConfiguration = getSggConfiguration()

// Get ssg configuration based on environment
const envConfiguration = getEnvConfiguration(getEnvironment())

// Get root of dist based on environment
const distDir = path.join("dist", envConfiguration.dist.basePath)

main()

/**
 * Builds static pages for application
 */
async function main() {
  await clearDist()

  // Do SPA build if there's a prebuild property for environment
  if (envConfiguration.prebuild) {
    await spawn("node", envConfiguration.prebuild.split(" "))
  }

  generateStaticPages()
  copyAssets()
  generateSpaEntryPoint()
}

/**
 * Create and clear dist directory
 */
async function clearDist() {
  await ensureDir(distDir)
  await emptyDir(distDir)
}

/**
 * Copy assets to dist
 */
async function copyAssets() {
  const baseAssetsDistPath = envConfiguration.dist.assets ? path.join(distDir, envConfiguration.dist.assets) : distDir

  for (const assetPath of ssgConfiguration.assets) {
    const assetsDistPathInDist = path.join(baseAssetsDistPath, assetPath)

    await copy(assetPath, assetsDistPathInDist)
  }
}

/**
 * Generate static pages
 */
async function generateStaticPages() {
  // Create and clear dist directory for static pages
  const staticPath = path.join(distDir, envConfiguration.dist.static)

  await ensureDir(staticPath)
  await emptyDir(staticPath)

  // Read paths to generate static pages
  const routes = ssgConfiguration.routes

  // Generate static pages
  const promises = []

  for (const route of routes) {
    promises.push(spawnBuildProcess(route))
  }

  await Promise.all(promises)
}

/**
 * Generate SPA entry point, commonly an index.html
 */
async function generateSpaEntryPoint() {
  const entryPointPath = path.join(distDir, envConfiguration.dist.entryPoint || "index.html")

  const rootCode = stripMainScript(envConfiguration.entryPoint).rootCode.replace("</body>", envConfiguration.dist.mainTag + "</body>")

  await writeFile(entryPointPath, rootCode)
}
