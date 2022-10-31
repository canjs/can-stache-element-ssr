const { readJsonSync } = require("fs-extra")
const environment = require("./get-environment")() // Stores current environment

module.exports = function () {
  console.log("env settings loaded", environment)

  const settings = readJsonSync("ssg.json")

  return settings.environments[environment]
}
