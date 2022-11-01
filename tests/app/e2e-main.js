// import type from "can-type"
import StacheElement from "can-stache-element"
// import route from "can-route"
// import "can-stache-route-helpers"
// import view from "./app.stache"
import { ssgDefineElement, ssgEnd, prepareRouting } from "../../../client-helpers/ssg-helpers.js"

class MyApp extends StacheElement {
  static view = `
      <h1>Hello {{ this.name }}</h1>
    `

  static props = {
    name: "Playwright",
  }

  connected() {}
}

ssgDefineElement("can-app", MyApp)

ssgEnd()

console.log("e2e-main.js")
