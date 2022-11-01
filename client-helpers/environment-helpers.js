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

/**
 * Returns routes for a given environment. If the environment doesn't have any routes,
 * it will return the general configuration's routes
 */
const getEnvRoutes = (env) => {
  const envConfiguration = getEnvConfiguration(env)

  if (envConfiguration.routes) {
    return envConfiguration.routes
  }

  return ssgConfiguration.routes || []
}

module.exports = { getSggConfiguration, getEnvConfiguration, getEnvironments, getEnvRoutes }
