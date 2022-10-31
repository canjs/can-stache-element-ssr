const { readJsonSync } = require("fs-extra")
const argv = require("optimist").argv

module.exports = function () {
  const env = process.env.SSG_ENVIRONMENT || argv.environment || readJsonSync("ssg.json").defaultEnv
  process.env.SSG_ENVIRONMENT = env
  return env
}
