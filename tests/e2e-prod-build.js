const stealTools = require("steal-tools")
const path = require("path")
const { readJsonSync } = require("fs-extra")
const { getEnvConfiguration } = require("../client-helpers/environment-helpers")

const envConfiguration = getEnvConfiguration("e2e-prod")

let config = {}

if (envConfiguration.stealConfig) {
  config = readJsonSync(envConfiguration.stealConfig)
}

// TODO: switch bundle to e2e bundles instead of temp app's
stealTools.build(config, {
  bundleSteal: true,
  dest: path.join("dist", envConfiguration.dist.basePath),
})
