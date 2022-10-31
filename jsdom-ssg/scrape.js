const steal = require("steal")
const setupGlobals = require("./setup-globals")
const { outputFile, existsSync, readFileSync } = require("fs-extra")
const getFilepath = require("./get-filepath")
const argv = require("optimist").argv
const path = require("path")
const getEnvironment = require("./get-environment")
const { getEnvConfiguration, getSggConfiguration } = require("../client-helpers/environment-helpers")

// Get url from argv
const url = argv.url || "http://127.0.0.1:8080"

// Get general ssg configuration
const ssgConfiguration = getSggConfiguration()

// Get ssg configuration based on environment
const envConfiguration = getEnvConfiguration(getEnvironment())

// Throw if build takes too long
const timeout = setTimeout(() => {
  throw new Error("timed out ):")
}, 5000).unref()

/**
 * Wait for process to become idle (no async tasks are pending)
 *
 * This is when it is safe to scrape document
 */
process.once("beforeExit", (code) => {
  clearTimeout(timeout)

  // TODO: should we consider code? code === 0?
  scrapeDocument()
})

// Strip steal / production bundle from entry point html file
let captureMain = ""
let rootCode = ""
// Remove any script where its last attribute is main
// TODO: should improve this
const stealRegex = /<script.*?\s+main(\s*=".*")?\s*><\/script>/

main()

async function main() {
  const entryPoint = envConfiguration.entryPoint
  const appSelector = ssgConfiguration.appSelector

  if (existsSync(envConfiguration.entryPoint)) {
    // TODO: better scrap script tags
    // if (prod) {
    //   // TODO: Create a better regex for production script
    //   stealRegex = /(<script[^>]*main\.js.*?>.*?<\/script>)/i
    // } else {
    //   stealRegex = /(<script[^>]*steal\/steal.*?>.*?<\/script>)/i
    // }

    rootCode = readFileSync(entryPoint, { encoding: "utf8", flag: "r" }) // project"s index.html / production.html
      .replace(stealRegex, (_, mainTag) => {
        captureMain = mainTag
        return "" // remove steal script tag (re-injected before exit)
      })

    if (!/^<!doctype/i.test(rootCode)) {
      rootCode = "<!doctype html>" + rootCode
    }

    if (rootCode.indexOf(`<${appSelector}`) === -1) {
      if (rootCode.indexOf("</body") !== -1) {
        rootCode = rootCode.replace("</body", `<${appSelector}></${appSelector}></body`)
      } else {
        rootCode += `<${appSelector}></${appSelector}>`
      }
    }
  } else {
    rootCode = `<!doctype html><title>CanJS and StealJS</title><${appSelector}></${appSelector}>`

    // if (prod) {
    //   captureMain = `<script src="/dist/bundles/can-stache-element-ssr/main.js" main></script>`
    // } else {
    //   captureMain = `<script src="/node_modules/steal/steal.js" main></script>`
    // }
  }

  // Setup JSDOM and global.window, global.document, global.location
  setupGlobals(rootCode, url)

  populateDocument()
}

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

  // TODO: how to use settings.appSelector with regex
  html = html.replace(/(<can-app[^>]*)>/, "$1 data-canjs-static-render>")
  // html = html.replace("</body>", injectHydrateInZoneWithCache + "</body>")

  // await outputFile(`dist/ssg/${getFilepath(url, "index.html")}`, html)
  const staticPath = path.join(envConfiguration.dist.basePath, envConfiguration.dist.static)

  await outputFile(path.join(staticPath, getFilepath(url, "index.html")), html)
}
