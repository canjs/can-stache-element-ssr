import StacheElement from "can-stache-element"
import { ssgDefineElement } from "../../../client-helpers/ssg-helpers.js"

class TimeoutExample extends StacheElement {
  static view = `
        <p id="timeout-example">{{ this.label }}</p>
    `

  static props = {
    label: "before timeout",
  }

  connected() {
    setTimeout(() => {
      this.label = "after timeout"
    }, 500)
  }
}

ssgDefineElement("can-timeout-example", TimeoutExample)
