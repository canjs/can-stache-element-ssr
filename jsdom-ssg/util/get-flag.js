const { readJsonSync } = require("fs-extra")
const argv = require("optimist").argv

/**
 * Check for flag value then once a value is found, it is set as a process env variable
 *
 * Order:
 * 1. process.env:
 * ```
 * SSG_ENVIRONMENT=prod node jsdom-ssg
 * ```
 *
 * 2. argument:
 * ```
 * node jsdom-ssg --environment prod
 * ```
 *
 * 3. ssgConfigurationProp:
 * ```
 * // ssg.json
 * { defaultEnv: "prod", ... }
 * ```
 */
module.exports = function (processEnv, argument, ssgConfigurationProp) {
  const value = process.env[processEnv] || argv[argument] || readJsonSync("ssg.json")[ssgConfigurationProp]
  process.env[processEnv] = value
  return value
}
