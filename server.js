const express = require("express")
const path = require("path")
const { existsSync } = require("fs-extra")
const { getEnvironments, getEnvConfiguration } = require("./client-helpers/environment-helpers")
const argv = require("optimist").argv
const app = express()
const defaultEnvironment = require("./jsdom-ssg/get-environment")()
const serverMode = require("./jsdom-ssg/get-server-mode")()

// ssg settings based on environment
let staticDir = ""
let entryPointDir = ""
let envConfiguration = null

setEnvDirs(defaultEnvironment)

const sendFileOr404 = (req, res, reqPath) => {
  const dest = path.join(__dirname, reqPath)

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
  }

  // Handle files that are local (node_modules, etc) by checking for file extensions (".")
  if (reqPath.indexOf(".") !== -1) {
    if (envConfiguration.serveFromDist) {
      // TODO: how do we go about handling "dist/prod/progressive-loading/dist/bundles/can-stache-element-ssr/main.css"
      sendFileOr404(req, res, path.join(envConfiguration.dist.basePath, reqPath.replace(/^.*\/dist\//, "")))
      return
    }

    sendFileOr404(req, res, reqPath)

    return
  }

  if (overrideEnvironment || serverMode === "spa") {
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

/**
 * Gets environment configuration and overrides global configurations for server
 */
function setEnvDirs(environment) {
  const configuration = getEnvConfiguration(environment)

  console.log("server environment:", environment)
  envConfiguration = configuration
  staticDir = path.join(envConfiguration.dist.basePath, envConfiguration.dist.static)
  entryPointDir = envConfiguration.serveFromDist
    ? path.join(envConfiguration.dist.basePath, envConfiguration.dist.entryPoint)
    : envConfiguration.entryPoint
}
