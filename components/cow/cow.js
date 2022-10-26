import StacheElement from "can-stache-element"
import "can-stache-route-helpers"
import { ssrDefineElement } from "../../jsdom-ssr/ssr-helpers"
import "./cow.css"

class MyCow extends StacheElement {
  static view = `
        <h3>Cow</h3>
        <p>Top 5 animal in the world is Cow</p>
    `
}

// customElements.define("progressive-cow", MyCow)
ssrDefineElement("progressive-cow", MyCow)
