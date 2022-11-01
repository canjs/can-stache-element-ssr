import StacheElement from "can-stache-element"
import { ssgDefineElement } from "../../../client-helpers/ssg-helpers.js"

class CounterExample extends StacheElement {
  static view = `
        <p id="counter">{{ this.count }}<p><button id="counter-button" on:click='this.increment()'>+1</button>
    `

  static props = {
    count: 0,
  }

  increment() {
    this.count++
  }
}

ssgDefineElement("can-counter-example", CounterExample)
