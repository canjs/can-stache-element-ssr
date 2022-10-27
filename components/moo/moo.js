import StacheElement from "can-stache-element"
import { ssrDefineElement } from "../../jsdom-ssr/ssr-helpers"
import "./moo.css"

class Moo extends StacheElement {
  static view = `
    <h3>Moo</h3>
    <p>Cows go Moooo~~</p>
    <p>First: {{ first }}</p>
    <p>Second: {{ second }}</p>
  `

  static props = {
    first: "",
    second: "",
  }

  connected() {
    if (this.INERT_PRERENDERED) {
      return
    }

    setTimeout(() => {
      xhrGet("https://dummyjson.com/products?limit=10&skip=10&select=title,price").then((jsonData) => {
        this.first = jsonData.products[0].title
      })
    }, 1)

    xhrGet("https://dummyjson.com/quotes").then((jsonData) => {
      this.second = jsonData.quotes[0].quote
    })
  }
}

ssrDefineElement("progressive-moo", Moo)

// Copied from main.js
function xhrGet(url) {
  return new Promise((res) => {
    const req = new XMLHttpRequest()
    req.onload = () => {
      if (req.readyState === req.DONE) {
        if (req.status === 200) {
          res(JSON.parse(req.responseText))
        }
      }
    }
    req.open("GET", url)
    req.send()
  })
}
