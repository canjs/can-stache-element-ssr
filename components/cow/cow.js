import StacheElement from "can-stache-element"
import { ssgDefineElement } from "../../jsdom-ssg/ssg-helpers"
import "./cow.css"

class Cow extends StacheElement {
  static view = `
    <h3>Cow</h3>
    <p>Top 5 animal in the world is Cow</p>
    <p>First: {{ first }}</p>
    <p>Second: {{ second }}</p>
  `

  static props = {
    first: "",
    second: "",
  }

  connected() {
    setTimeout(() => {
      this.first = "300 milliseconds have passed"
    }, 300)

    setTimeout(() => {
      this.second = "0.01 minutes have passed"
    }, 600)
  }
}

ssgDefineElement("progressive-cow", Cow)
