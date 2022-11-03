const express = require("express")
const path = require("path")
// const { existsSync } = require("fs-extra")
// const { getEnvironments, getEnvConfiguration } = require("./client-helpers/environment-helpers")
const argv = require("optimist").argv
const app = express()
// const defaultEnvironment = require("./jsdom-ssg/flags/get-ssg-environment")()
// const serverMode = require("./jsdom-ssg/flags/get-server-mode")()

app.use(express.static(path.join(__dirname, "dist/prod/static")))
// app.use('*', express.static(path.join(__dirname, 'dist/prod/static/404')));

// app.use(express.static(path.join(__dirname, 'test')));
// app.use('*', express.static(path.join(__dirname, 'test/404')));

app.listen(argv.port || 8080, function () {
  console.log("Example app listening on port " + (argv.port || 8080))
})
