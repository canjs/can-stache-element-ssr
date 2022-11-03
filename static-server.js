const express = require("express")
const path = require("path")
const argv = require("optimist").argv
const { getEnvConfiguration } = require("./client-helpers/environment-helpers")
const environment = require("./jsdom-ssg/flags/get-ssg-environment")()

const app = express()
const envConfiguration = getEnvConfiguration(environment)
const basePath = path.join("dist", envConfiguration.dist.basePath)

/**
 * This fix requires a change in `can-route`:
 * 
  node_modules/can-route/src/deparam.js
  ```javascript
  function canRoute_deparam(url) {
    url = toURLFragment(url);
    console.log('canRoute_deparam', url)// progressive-loading/moo/
    if (url.charAt(url.length - 1) === '/') {
      url = url.slice(0, -1)// Temp fix, remove trailing "/"
    }
    console.log('canRoute_deparam', url)// progressive-loading/moo
  }
  ```

  Don't forget to rebuild after you make change in `node_modules`
 */

app.use(express.static(path.join(__dirname, basePath, envConfiguration.dist.static)))
app.use("*", express.static(path.join(__dirname, basePath, envConfiguration.dist.static, "404")))

app.listen(argv.port || 8080, function () {
  console.log("Example app listening on port ", argv.port || 8080)
})
