// @ts-check
const { devices } = require("@playwright/test")
const preset = require("./playwright.preset")

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  ...preset,
  testMatch: /tests\/app\/.+\.spec\.js/,
}

module.exports = config
