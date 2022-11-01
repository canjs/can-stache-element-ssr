import StacheElement from "can-stache-element"
import { ssgDefineElement } from "../../../client-helpers/ssg-helpers.js"

class NotFoundExample extends StacheElement {
  static view = `
    <h3>Not Found Route</h3>
    <img src="/tests/app/assets/not-found-image.png">
  `
}

ssgDefineElement("can-not-found-example", NotFoundExample)
