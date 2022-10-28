const steal = require("steal")

steal.import("jsdom-ssr/some-file").then((mod) => {
  console.log(mod)
})
