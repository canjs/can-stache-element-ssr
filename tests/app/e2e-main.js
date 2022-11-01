// import type from "can-type"
import StacheElement from "can-stache-element"

import { ssgDefineElement, ssgEnd } from "../../../client-helpers/ssg-helpers.js"

import "./stache-example/stache-example"
import "./route-example/route-example"

class MyApp extends StacheElement {
  static view = `
      <h1>Hello {{ this.name }}</h1>

      <can-stache-example></can-stache-example>
      <can-route-example></can-route-example>
    `

  static props = {
    name: "Playwright",
  }

  connected() {}
}

ssgDefineElement("can-app", MyApp)

ssgEnd()
