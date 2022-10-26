import StacheElement from "can-stache-element"
import { ssrDefineElement } from "../../jsdom-ssr/ssr-helpers"
import "./cow.css"

class MyCow extends StacheElement {
  static view = `
    <h3>Cow</h3>
    <p>Top 5 animal in the world is Cow</p>
  `
}

ssrDefineElement("progressive-cow", MyCow)
