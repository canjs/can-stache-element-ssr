const steal = require("steal")
const setupGlobals = require("./setup-globals")
const { outputFile, existsSync, readFileSync } = require("fs-extra")
const getFilepath = require("./util/get-filepath")
const argv = require("optimist").argv
const path = require("path")
const getEnvironment = require("./flags/get-ssg-environment")
const { getEnvConfiguration } = require("../client-helpers/environment-helpers")

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
let captureMain = ""
let rootCode = ""
// TODO: should improve this
// Remove any script where its last attribute is main
const stealRegex = /<script.*?\s+main(\s*=".*")?\s*><\/script>/

main()

/**
 * Strips main script from SPA application
 *
 * Gets up globals (`window`, `location`, etc) for `JSDOM` environment
 *
 * Then populates `JSDOM` document with SPA application
 */
async function main() {
  const entryPoint = envConfiguration.entryPoint

  if (existsSync(envConfiguration.entryPoint)) {
    rootCode = readFileSync(entryPoint, { encoding: "utf8", flag: "r" }) // project"s index.html / production.html
      .replace(stealRegex, (_, mainTag) => {
        captureMain = mainTag
        return "" // remove steal script tag (re-injected before exit)
      })

    if (!/^<!doctype/i.test(rootCode)) {
      rootCode = "<!doctype html>" + rootCode
    }

    if (rootCode.indexOf(`<can-app`) === -1) {
      if (rootCode.indexOf("</body") !== -1) {
        rootCode = rootCode.replace("</body", `<can-app></can-app></body`)
      } else {
        rootCode += `<can-app></can-app>`
      }
    }
  } else {
    rootCode = `<!doctype html><title>CanJS and StealJS</title><can-app></can-app>`
  }

  // Setup JSDOM and global.window, global.document, global.location
  setupGlobals(rootCode, url)

  populateDocument()
}

/**
 * Populates `JSDOM` document with SPA application
 */
async function populateDocument() {
  // Run client-side code
  await steal.startup() // loads canjs app
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

  captureMain = envConfiguration.dist.mainTag || captureMain || '<script src="/node_modules/steal/steal.js" main></script>'
  console.log(captureMain)
  // Re-inject steal before closing of body tag
  // It's required that steal is injected at the end of body to avoid runtime errors involving `CustomElement`
  // source: https://stackoverflow.com/questions/43836886/failed-to-construct-customelement-error-when-javascript-file-is-placed-in-head
  html = html.replace("</body>", captureMain + "</body>")

  // Append `data-canjs-static-render` attribute to determine which `can-app` contains the static rendered stache elements
  html = html.replace(/(<can-app[^>]*)>/, "$1 data-canjs-static-render>")

  const staticPath = path.join("dist", envConfiguration.dist.basePath, envConfiguration.dist.static)

  await outputFile(path.join(staticPath, getFilepath(url, "index.html")), html)
}
