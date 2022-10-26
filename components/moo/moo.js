import StacheElement from "can-stache-element"
import "can-stache-route-helpers"
import { ssrDefineElement } from "../../jsdom-ssr/ssr-helpers"
import "./moo.css"

class MyMoo extends StacheElement {
  static view = `
        <h3>Moo</h3>
        <p>Cows go Moooo~~</p>
    `
}
console.log("progressive-moo loaded")

// customElements.define("progressive-moo", MyMoo)// <-- works
ssrDefineElement("progressive-moo", MyMoo) // <-- doesn't work ):
