import StacheElement from "can-stache-element"
import { ssgDefineElement } from "../../../../client-helpers/ssg-helpers.js"

class NestedTimeoutExample extends StacheElement {
  static view = `
        <p id="nested-timeout-example">{{ this.label }}</p>
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

ssgDefineElement("can-nested-timeout-example", NestedTimeoutExample)
