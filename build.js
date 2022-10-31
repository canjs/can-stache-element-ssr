const stealTools = require("steal-tools")
const path = require("path")
const { getEnvConfiguration } = require("./client-helpers/environment-helpers")

stealTools.build(
  {},
  {
    bundleSteal: true,
    dest: path.join("dist", getEnvConfiguration("prod").dist.basePath),
  },
)
