const express = require("express")
const path = require("path")
const { existsSync } = require("fs-extra")
const argv = require("optimist").argv

const app = express()

const ssrDist = "dist/ssr"

const sendFileOr404 = (req, res, dest) => {
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
      sendFileOr404(req, res, path.join(__dirname, reqPath.replace("/prod", "")))
    } else {
      sendFileOr404(req, res, path.join(__dirname, reqPath))
    }
  } else if (reqPath.indexOf("/dev") === 0 || argv.dev) {
    // it's not a file, it's a directory's index.html file to load

    // If it's dev mode, Serve root index html file, can-route handles it from there
    res.sendFile(path.join(__dirname, "/index.html"))
  } else if (reqPath.indexOf("/prod") === 0 || argv.prod) {
    // it's not a file, it's a directory's index.html file to load

    // If it's prod mode, Serve root production html file, can-route handles it from there
    res.sendFile(path.join(__dirname, "/production.html"))
  } else {
    // it's still a directory but it didn't start with /dev, so serve from the static dist folder
    sendFileOr404(req, res, path.join(__dirname, ssrDist, reqPath, "/index.html"))
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
