const stealTools = require("steal-tools")
const path = require("path")
const { getEnvConfiguration } = require("./client-helpers/environment-helpers")

const envConfiguration = getEnvConfiguration("prod")

const distDir = path.join("dist", envConfiguration.dist.basePath)

main()

async function main() {
  await stealTools.build(
    {},
    {
      bundleSteal: true,
      dest: path.join(distDir, "dist"),
    },
  )
}
