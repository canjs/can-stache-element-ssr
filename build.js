const { readJsonSync } = require("fs-extra")
const stealTools = require("steal-tools")

const settings = readJsonSync("ssg.json")
stealTools.build(
  {},
  {
    bundleSteal: true,
    dest: settings.environments.prod.dist.basePath,
  },
)
