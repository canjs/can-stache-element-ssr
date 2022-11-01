const ssgConfiguration = require("../ssg.json")

// Make configuration immutable
Object.freeze(ssgConfiguration)

/**
 * Returns SSG configuration
 */
const getSggConfiguration = () => ssgConfiguration

/**
 * Returns environment configuration
 */
const getEnvConfiguration = (env) => {
  const configuration = getSggConfiguration().environments[env]

  if (!configuration) {
    throw new Error("Unexpected missing environment configuration")
  }

  return configuration
}

/**
 * Returns list of environments
 */
const getEnvironments = () => Object.keys(ssgConfiguration.environments)

module.exports = { getSggConfiguration, getEnvConfiguration, getEnvironments }
