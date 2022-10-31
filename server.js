const express = require("express")
const path = require("path")
const { existsSync, readJsonSync } = require("fs-extra")
const argv = require("optimist").argv
const ssgSettings = readJsonSync("ssg.json")
const app = express()
const defaultEnvironment = require("./jsdom-ssg/get-environment")()
let serverMode = require("./jsdom-ssg/get-server-mode")()

/**
 * 
 * 
"mainTag": "<script src=\"/bundles/can-stache-element-ssr/main.js\" main></script>",
"basePath": "dist/prod",
"static": "static",
"assets": "",
"entryPoint": "index.html"
 * 
 * 
 * 
 */

// Get ssg settings based on environment
// const envSettings = getEnvSettings()
let staticDir = "" // path.join(envSettings.dist.basePath, envSettings.dist.static)
let entryPointDir = "" // envSettings.serveFromDist ? path.join(envSettings.dist.basePath, envSettings.dist.entryPoint) : envSettings.entryPoint
let envSettings = null
setEnvDirs(defaultEnvironment)

const sendFileOr404 = (req, res, reqPath) => {
  console.log(reqPath)
  // Fixes issues where when in a nested route,
  // dist is expected to be relative to that path
  // instead of the root of the project
  // ex "/progressive-loading/dist/bundles/can-stache-element-ssr/main.css"
  // Issue only affects prod
  // if (reqPath.includes("dist/bundles")) {
  //   reqPath = /^.*(dist\/bundles.*)/.exec(reqPath)[1]
  // }

  // if (reqPath.includes(envSettings.dist.basePath)) {
  //   reqPath = [,reqPath.split(reqPath)].join('/')
  // }

  const dest = path.join(__dirname, reqPath)
  console.log(dest)

  if (existsSync(dest)) {
    res.sendFile(dest)
  } else {
    res.status(404)
    res.sendFile(path.join(__dirname, staticDir, "/404/index.html"))
  }
}

const environments = getEnvironments()

app.get("/*", function (req, res) {
  const reqPath = req.path
  console.log(reqPath)

  const overrideEnvironment = environments.find((env) => reqPath.startsWith(`/${env}`))
  if (overrideEnvironment) {
    setEnvDirs(overrideEnvironment)
    reqPath.replace(`/${overrideEnvironment}`, "")
    serverMode = "spa"
  }

  // Handle files that are local (node_modules, etc) by checking for file extensions (".")
  if (reqPath.indexOf(".") !== -1) {
    if (envSettings.serveFromDist) {
      // TODO: how do we go about handling "dist/prod/progressive-loading/dist/bundles/can-stache-element-ssr/main.css"
      sendFileOr404(req, res, path.join(envSettings.dist.basePath, reqPath.replace(/^.*\/dist\//, "")))
      return
    }

    sendFileOr404(req, res, reqPath)

    return
  }

  if (serverMode === "spa") {
    sendFileOr404(req, res, entryPointDir)
    return
  }

  if (serverMode === "ssg") {
    sendFileOr404(req, res, path.join(staticDir, reqPath, "index.html"))
    return
  }
})

// Handle 404 - Keep this as a last route
app.use(function (req, res, next) {
  res.status(404)
  res.send("404: File Not Found")
})

app.listen(argv.port || 8080, function () {
  console.log("Example app listening on port " + argv.port || 8080)
})

function setEnvDirs(environment) {
  const _envSettings = ssgSettings.environments[environment]

  if (!_envSettings) {
    throw new Error("Unexpected missing environment setting")
  }

  console.log("server environment:", environment)
  envSettings = _envSettings
  staticDir = path.join(envSettings.dist.basePath, envSettings.dist.static)
  entryPointDir = envSettings.serveFromDist ? path.join(envSettings.dist.basePath, envSettings.dist.entryPoint) : envSettings.entryPoint
}

function getEnvironments() {
  return Object.keys(ssgSettings.environments)
}
