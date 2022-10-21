const express = require("express")
const path = require("path")
const { existsSync } = require("fs-extra")
const argv = require("optimist").argv

const app = express()

// app.set("views", [__dirname + "/dist", __dirname]);

app.use(express.static("/"))

const sendFileOr404 = (req, res, dest) => {
  if (existsSync(dest)) {
    res.sendFile(dest)
  } else {
    res.status(404)
    res.sendFile(path.join(__dirname, "/dist/404/index.html"))
  }
}

app.get("/*", function (req, res) {
  const reqPath = req.path

  if (reqPath.indexOf(".") !== -1) {
    // pointing straight to a file? Serve the file
    sendFileOr404(req, res, path.join(__dirname, reqPath))
  } else if (reqPath.indexOf("/dev") === 0) {
    // it's not a file, it's a directory's index.html file to load

    // If it's dev mode, Serve root index html file, can-route handles it from there
    res.sendFile(path.join(__dirname, "/index.html"))

    // if env.production
    // res.sendFile(path.join(__dirname, "/production.html"));
  } else {
    // it's still a directory but it didn't start with /dev, so serve from the static dist folder
    sendFileOr404(req, res, path.join(__dirname, "/dist", reqPath, "/index.html"))
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
