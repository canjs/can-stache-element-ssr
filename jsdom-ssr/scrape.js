const steal = require("steal")
const setupGlobals = require("./setup-globals")
const { outputFile, existsSync, readFileSync } = require("fs-extra")

// Get url from args
const args = process.argv.slice(2)
const url = args[0] || "http://127.0.0.1:8080"

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

// Setup JSDOM and global.window, global.document, global.location
let captureSteal = ""
let rootCode = ""

if (existsSync("index.html")) {
  rootCode = readFileSync("index.html", { encoding: "utf8", flag: "r" }) // project"s index.html
    .replace(/(<script[^>]*steal\/steal.*?>.*?<\/script>)/i, (_, stealTag) => {
      captureSteal = stealTag
      return "" // remove steal script tag (re-injected before exit)
    })

  if (!/^<!doctype/i.test(rootCode)) {
    rootCode = "<!doctype html>" + rootCode
  }

  if (rootCode.indexOf("<canjs-app") === -1) {
    if (rootCode.indexOf("</body") !== -1) {
      rootCode = rootCode.replace("</body", "<canjs-app></canjs-app></body")
    } else {
      rootCode += "<canjs-app></canjs-app>"
    }
  }
} else {
  rootCode = `<!doctype html><title>CanJS and StealJS</title><canjs-app></canjs-app>`
  captureSteal = `<script src="/node_modules/steal/steal.js" main></script>`
}

setupGlobals(rootCode, url)

async function populateDocument() {
  // Run client-side code
  await steal.startup() // loads canjs app
  // TODO: disable jsdom script tags?

  console.log("steal - done")
}

populateDocument()

/**
 * Once async tasks are completed, scrap document into dist
 */
async function scrapeDocument() {
  // Write scrapped dom to dist
  let html = window.document.documentElement.outerHTML

  // re-inject steal before closing of head tag
  html = html.replace(/(<head[^>]*>)/, "$1<script>globalThis.canStacheElementInertPrerendered = true;</script>")
  html = html.replace("</head>", captureSteal + "</head>")
  html = html.replace(/(<canjs-app[^>]*)>/, "$1 data-canjs-static-render>")

  await outputFile(`dist/${getFilename(url)}.html`, html)
}

/**
 * Create filename based on url
 *
 * TODO: consider query params (or confirm that they aren't a part of requirements)
 */
function getFilename(url) {
  const path = url
    .replace(/https?:\/\//, "")
    .replace(/[^a-zA-Z0-9 /]/g, "_")
    .replace(/^[^/]*?(\/|$)/, "")

  // return path || "index"

  // TODO: Create nested paths while supporting loading steal.js from node_modules
  return `${path}/index`.replace(/^\//, "")
}
