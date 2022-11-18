const { ensureDir, emptyDir, copy, writeFile, readFile } = require("fs-extra")
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

  const promises = []

  promises.push(generateSpaEntryPoint())
  promises.push(copyAssets())

  await Promise.all(promises)

  // Do SPA build if there's a prebuild property for environment
  if (envConfiguration.prebuild) {
    await spawn("node", envConfiguration.prebuild.split(" "))
  }

  await generateStaticPages()

  // Do SPA build if there's a postbuild property for environment
  if (envConfiguration.postbuild) {
    await spawn("node", envConfiguration.postbuild.split(" "))
  }
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
  const promises = []

  for (const assetPath of ssgConfiguration.assets) {
    const assetsDistPathInDist = path.join(baseAssetsDistPath, assetPath)

    promises.push(copy(assetPath, assetsDistPathInDist))
  }

  await Promise.all(promises)
}

/**
 * Generate static pages
 */
async function generateStaticPages() {
  // Read paths to generate static pages
  const routes = ssgConfiguration.routes

  // Generate static pages
  const promises = []

  for (const route of routes) {
    promises.push(spawnBuildProcess(`http://localhost:8080${path.join("/", route)}`))
  }

  await Promise.all(promises)
}

/**
 * Generate SPA entry point, commonly an index.html
 */
async function generateSpaEntryPoint() {
  const entryPointPath = path.join(distDir, envConfiguration.dist.entryPoint || "index.html")

  // If there is a mainTag defined, override steal/main script from original entryPoint
  if (envConfiguration.dist.mainTag) {
    const rootCode = stripMainScript(envConfiguration.entryPoint).rootCode

    await writeFile(entryPointPath, rootCode.replace("</body>", envConfiguration.dist.mainTag + "</body>"))
    return
  }

  const rootCode = await readFile(envConfiguration.entryPoint)

  await writeFile(entryPointPath, rootCode)
}
