const steal = require("steal")
const setupGlobals = require("./setup-globals")
const { outputFile, readJson } = require("fs-extra")
const getFilepath = require("./util/get-filepath")
const argv = require("optimist").argv
const path = require("path")
const getEnvironment = require("./flags/get-ssg-environment")
const { getEnvConfiguration } = require("../client-helpers/environment-helpers")
const stripMainScript = require("./util/strip-main-script")

// Get url from argv
const url = argv.url || "http://127.0.0.1:8080"

// Get ssg configuration based on environment
const envConfiguration = getEnvConfiguration(getEnvironment())

// Throw if build takes too long
const timeout = setTimeout(() => {
  throw new Error("timed out ):")
}, 5000).unref()

/**
 * Wait for process to become idle (no async tasks are pending)
 *
 * This is when it is safe to scrape `JSDOM` document
 */
process.once("beforeExit", (code) => {
  clearTimeout(timeout)

  // TODO: should we consider code? code === 0?
  scrapeDocument()
})

// Strip steal / production bundle from entry point html file
const { captureMain, rootCode } = stripMainScript(envConfiguration.entryPoint)

main()

/**
 * Strips main script from SPA application
 *
 * Gets up globals (`window`, `location`, etc) for `JSDOM` environment
 *
 * Then populates `JSDOM` document with SPA application
 */
async function main() {
  // Setup JSDOM and global.window, global.document, global.location
  setupGlobals(rootCode, url)

  populateDocument()
}

/**
 * Populates `JSDOM` document with SPA application
 */
async function populateDocument() {
  // The module with address http://0.0.0.0:4202/client-helpers/environment-helpers.js is being instantiated twice.
  // This happens when module identifiers normalize to different module names.
  if (envConfiguration.stealConfig) {
    const config = await readJson(envConfiguration.stealConfig)
    steal.config(config)
  }

  // Run client-side code and load <can-app>
  await steal.startup()
  // TODO: disable jsdom script tags?

  console.log("steal - done")
}

/**
 * Once async tasks are completed, scrap document into dist
 */
async function scrapeDocument() {
  // Write scrapped dom to dist
  let html = window.document.documentElement.outerHTML

  // Set Inert Prerendered flag
  html = html.replace(
    /(<head[^>]*>)/,
    `$1<script>
    globalThis.canStacheElementInertPrerendered = true;
    globalThis.canMooStache = true;
  </script>`,
  )

  const mainTag = envConfiguration.dist.mainTag || captureMain
  // Re-inject steal/main before closing of body tag
  // It's required that steal/main is injected at the end of body to avoid runtime errors involving `CustomElement`
  // source: https://stackoverflow.com/questions/43836886/failed-to-construct-customelement-error-when-javascript-file-is-placed-in-head
  html = html.replace("</body>", mainTag + "</body>")

  // Append `data-canjs-static-render` attribute to determine which `can-app` contains the static rendered stache elements
  html = html.replace(/(<can-app[^>]*)>/, "$1 data-canjs-static-render>")

  const staticPath = path.join("dist", envConfiguration.dist.basePath, envConfiguration.dist.static)

  await outputFile(path.join(staticPath, getFilepath(url, "index.html")), html)
}
