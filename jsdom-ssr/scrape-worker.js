const steal = require("steal")
const setupGlobals = require("./setup-globals")
const { outputFile, existsSync, readFileSync } = require("fs-extra")
const getFilepath = require("../util/get-filepath")
const argv = require("optimist").argv
const { parentPort } = require("worker_threads")

// Get url from argv
const id = argv.id
// Generate prod vs dev scapes
const prod = argv.prod || false
// Setup entry point based on prod
const entryPoint = prod ? "production.html" : "index.html"

if (id !== 0 && !id) {
  console.error("Unexpected missing worker thread id")
  throw new Error("Unexpected missing worker thread id")
}

let mode = ""
let url = ""

function setMode(_) {
  mode = _
  // console.log(`${id} - ${mode}`)
}

setMode("WAITING")
waitForMessage()

function waitForMessage() {
  parentPort.once("message", (message) => {
    url = message

    if (!url) {
      mode = "FINISH"
      return
    }

    generate()
  })
}

/**
 * Wait for process to become idle (no async tasks are pending)
 *
 * This is when it is safe to scrape document
 */
process.on("beforeExit", (code) => {
  if (mode === "GENERATING") {
    scrapeDocument()
    return
  }

  if (mode !== "WAITING" && mode !== "FINISH") {
    console.error("Unexpected exit from worker thread")
    throw new Error("Unexpected exit from worker thread")
  }

  while (mode === "WAITING") {}
})

async function populateDocument() {
  // Run client-side code
  await steal.clone().startup() // loads canjs app
  // TODO: disable jsdom script tags?
}

// Strip steal / production bundle from entry point html file
let captureSteal = ""
let rootCode = ""
let stealRegex = ""

async function generate() {
  if (!url) {
    console.error("Unexpected missing url")
    throw new Error("Unexpected missing url")
  }

  setMode("GENERATING")
  console.log(url)

  if (existsSync(entryPoint)) {
    if (prod) {
      // TODO: Create a better regex for production script
      stealRegex = /(<script[^>]*main\.js.*?>.*?<\/script>)/i
    } else {
      stealRegex = /(<script[^>]*steal\/steal.*?>.*?<\/script>)/i
    }

    rootCode = readFileSync(entryPoint, { encoding: "utf8", flag: "r" }) // project"s index.html / production.html
      .replace(stealRegex, (_, stealTag) => {
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

    if (prod) {
      captureSteal = `<script src="/dist/bundles/can-stache-element-ssr/main.js" main></script>`
    } else {
      captureSteal = `<script src="/node_modules/steal/steal.js" main></script>`
    }
  }

  // Setup JSDOM and global.window, global.document, global.location
  setupGlobals(rootCode, url)

  await populateDocument()
}

/**
 * Once async tasks are completed, scrap document into dist
 */
async function scrapeDocument() {
  setMode("SCRAPING")
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

  // Re-inject steal before closing of body tag
  // It's required that steal is injected at the end of body to avoid runtime errors involving `CustomElement`
  // source: https://stackoverflow.com/questions/43836886/failed-to-construct-customelement-error-when-javascript-file-is-placed-in-head
  html = html.replace("</body>", captureSteal + "</body>")

  html = html.replace(/(<canjs-app[^>]*)>/, "$1 data-canjs-static-render>")
  // html = html.replace("</body>", injectHydrateInZoneWithCache + "</body>")

  await outputFile(`dist/ssr/${getFilepath(url, "index.html")}`, html)

  parentPort.postMessage(url)
  setMode("WAITING")
  waitForMessage()
}
