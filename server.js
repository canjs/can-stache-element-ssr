const express = require("express")
const path = require("path")
const { existsSync } = require("fs-extra")
const argv = require("optimist").argv

const app = express()

const ssrDist = "dist/ssr"

const sendFileOr404 = (req, res, reqPath) => {
  // Fixes issues where when in a nested route,
  // dist is expected to be relative to that path
  // instead of the root of the project
  // ex "/progressive-loading/dist/bundles/can-stache-element-ssr/main.css"
  // Issue only affects prod
  if (reqPath.includes("dist/bundles")) {
    console.log(reqPath)
    reqPath = /^.*(dist\/bundles.*)/.exec(reqPath)[1]
    console.log(reqPath)
  }

  const dest = path.join(__dirname, reqPath)

  if (existsSync(dest)) {
    res.sendFile(dest)
  } else {
    res.status(404)
    res.sendFile(path.join(__dirname, ssrDist, "/404/index.html"))
  }
}

app.get("/*", function (req, res) {
  const reqPath = req.path

  if (reqPath.indexOf(".") !== -1) {
    // pointing straight to a file? Serve the file
    if (reqPath.startsWith("/prod")) {
      sendFileOr404(req, res, reqPath.replace("/prod", ""))
    } else {
      sendFileOr404(req, res, reqPath)
    }
  } else if (reqPath.indexOf("/dev") === 0 || argv.dev) {
    // it's not a file, it's a directory's index.html file to load

    // If it's dev mode, Serve root index html file, can-route handles it from there
    res.sendFile(path.join(__dirname, "/index.html"))
  } else if (reqPath.indexOf("/prod") === 0 || argv.prod) {
    // If it's prod mode, Serve root production html file, can-route handles it from there
    res.sendFile(path.join(__dirname, "/production.html"))
  } else {
    // it's still a directory but it didn't start with /dev or /prod, so serve from the static dist/ssr folder
    sendFileOr404(req, res, path.join(ssrDist, reqPath, "/index.html"))
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
