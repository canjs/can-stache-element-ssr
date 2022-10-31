const argv = require("optimist").argv

module.exports = function () {
  const serverMode = process.env.SERVER_MODE || argv.serverMode || "ssg"
  process.env.SERVER_MODE = serverMode
  return serverMode
}
