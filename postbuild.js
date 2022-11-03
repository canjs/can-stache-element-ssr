const path = require("path")
const { getEnvConfiguration, getSggConfiguration, getEnvAssets } = require("./client-helpers/environment-helpers")
const { copy } = require("fs-extra")
const getEnvironment = require("./jsdom-ssg/flags/get-ssg-environment")

const environment = getEnvironment()
const ssgConfiguration = getSggConfiguration()
const envConfiguration = getEnvConfiguration("prod")

const distDir = path.join("dist", envConfiguration.dist.basePath)

main()

async function main() {
  const promises = []

  const routes = ssgConfiguration.routes

  const staticPath = path.join(distDir, envConfiguration.dist.static)
  const bundlePath = path.join(distDir, "dist/bundles")

  for (const route of routes) {
    const staticBundlePath = path.join(staticPath, route, "dist/bundles")
    promises.push(copy(bundlePath, staticBundlePath))
  }

  const baseAssetsDistPath = envConfiguration.dist.assets ? path.join(distDir, envConfiguration.dist.assets) : distDir
  const baseStaticAssetsDistPath = envConfiguration.dist.assets ? path.join(staticPath, envConfiguration.dist.assets) : staticPath

  const assets = getEnvAssets(environment)

  for (const assetPath of assets) {
    const assetsDistPathInDist = path.join(baseAssetsDistPath, assetPath)
    const staticAssetsDistPathInDist = path.join(baseStaticAssetsDistPath, assetPath)

    promises.push(copy(assetsDistPathInDist, staticAssetsDistPathInDist))
  }

  await Promise.all(promises)
}
