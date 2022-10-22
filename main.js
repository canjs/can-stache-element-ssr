import globals from "can-globals"
import type from "can-type"
import StacheElement from "can-stache-element"
import route from "can-route"
import "can-stache-route-helpers"
import view from "./app.stache"
import Zone from "can-zone"
import { ObservableObject } from "can"

import RoutePushstate from "can-route-pushstate"
route.urlData = new RoutePushstate()

const oldisNode = globals.getKeyValue("isNode")
// hack to trick `can-route` to think this is a browser
// This is required for routing to work (without this, it will always 404)
globals.setKeyValue("isNode", false)

class MyRoutingApp extends StacheElement {
  static view = `
    {{ this.componentToShow }}
    <span>Routes: </span>
    <a href="{{ routeUrl(page='home') }}">Home</a>
    <a href="{{ routeUrl(page='tasks') }}">Tasks</a>
    <a href="{{ routeUrl(page='unknown') }}">404</a>
    <p>The current page is {{ this.routeData.page }}.</p>
  `

  static props = {
    routeData: {
      get default() {
        // set default page to the first slug, ignore "dev" sentinel
        const page = window.location.pathname.split("/").filter((slug) => slug && slug !== "dev")[0] || "home"
        route.register("{page}", { page: "home" })
        route.register("tasks/{taskId}", { page: "tasks" })
        route.start()
        route.data.page = page
        return route.data
      },
    },
  }

  get componentToShow() {
    console.log("componentToShow", this.routeData.page)

    switch (this.routeData.page) {
      case "home":
        const home = document.createElement("h2")
        home.innerHTML = "Home"
        return home
      case "tasks":
        const tasks = document.createElement("h2")
        tasks.innerHTML = "Tasks"
        return tasks
      default:
        const page404 = document.createElement("h2")
        page404.innerHTML = "Page Missing"
        return page404
    }
  }
}

customElements.define("my-routing-app", MyRoutingApp)

// class ValueFromInput extends StacheElement {
//     static view = `
//     <input value:from="count"/>
//   `

//     static props = {
//         count: {
//             // Makes count increase by 1 every
//             // second.
//             value(prop) {
//                 let count = prop.resolve(20)
//                 let timer = setInterval(() => {
//                     prop.resolve(++count)
//                 }, 1000)
//                 // Return a cleanup function
//                 // that is called when count
//                 // is longer used.
//                 return () => {
//                     clearTimeout(timer)
//                 }
//             },
//         },
//     }
// }
// customElements.define("my-value-from-input", ValueFromInput)

class ValueToInput extends StacheElement {
  static view = `
    <input value:to="this.count"/> Count: {{ this.count }}
  `

  static props = {
    count: type.convert(Number),
  }
}

customElements.define("my-value-to-input", ValueToInput)

class MyStacheElement extends StacheElement {
  static view = view

  static props = {
    message: "Stache is cool",
  }
}

customElements.define("my-stache-element", MyStacheElement)

// Extend Component to define a custom element
class MyCounter extends StacheElement {
  // TODO: https://canjs.com/doc/guides/html.html#Stachetemplatesandbindings
  // {{# is(this.count, 1) }} Count is 1 {{ else }} Count is not 1 {{/ if }}
  // should end with {{/ is }}
  // {{# is(this.count, 1) }} Count is 1 {{ else }} Count is not 1 {{/ is }}

  static view = `
    <div>Count: <span>{{ this.count }}</span><button on:click='this.increment()'>+1</button></div>
    <div>Count using if: {{# if(this.count) }} Count not 0 {{ else }} Count is 0 {{/ if }}</div>
    <div>Count using is: {{# is(this.count, 1) }} Count is 1 {{ else }} Count is not 1 {{/ is }}</div>
    <div>Count using for: {{# for(item of this.items) }} {{ item.name }} {{/ for }}</div>
  `

  static props = {
    count: 0,
    // TODO: example for using `for` isn't working as expected
    items: {
      get default() {
        return [{ name: "some-item" }, { name: "some-next-item" }]
      },
    },
  }

  increment() {
    this.count++
  }
}

customElements.define("my-counter", MyCounter)

class MyApp extends StacheElement {
  // <my-value-from-input></my-value-from-input><br>
  static view = `
    <h1>Hello {{ this.name }}!</h1>
    <my-stache-element></my-stache-element><br>
    <my-value-to-input></my-value-to-input><br>
    <my-routing-app></my-routing-app><br>
  `

  static props = {
    name: "world",
  }

  /**
   * as long as you call super.connectedCallback() there's no error in cleanup
   */
  // connectedCallback() {
  //   super.connectedCallback()

  //   console.log('MyApp - connectedCallback')
  //   console.log(this.innerHTML)
  //   this.name = "connectedCallback"
  //   console.log(this.innerHTML)
  // }

  constructor() {
    super()
    // standard lifecycle hooks need to do this so re-attachement/hydration works smoothly
    if (this.INERT_PRERENDERED) {
      return
    }
    console.log("constructing canjs-app")
    this.style.color = "lime"
    setTimeout(() => (this.style.color = "#552255"), 1000)
  }

  connected() {
    // non-standard lifecycle hooks won't run if this.INERT_PRERENDERED is true
    this.style.backgroundColor = "white"
    setTimeout(() => (this.style.backgroundColor = "violet"), 1000)
    console.log("MyApp - connected")
    this.name = "canjs"
    this.appendChild(document.createElement("my-counter"))
  }
}

customElements.define("canjs-app", MyApp)

// TODO: inject this instead
if (globalThis.canStacheElementInertPrerendered) {
  new Zone()
    .run(function () {
      delete globalThis.canStacheElementInertPrerendered
      const staticapp = document.querySelector("canjs-app")
      const temp = document.createElement("div")
      temp.innerHTML = "<canjs-app></canjs-app>" // TODO: scrape static attrs from page too
      const liveapp = temp.querySelector("canjs-app")
      liveapp.style.display = "none"
      staticapp.parentNode.insertBefore(liveapp, staticapp)

      return { staticapp, liveapp }
    })
    .then(function (data) {
      const { staticapp, liveapp } = data.result
      staticapp.remove()
      liveapp.style.display = ""
      console.log("it's alive!")
    })
}

console.log("href", window.location.href)

// restore `isNode` for globals
globals.setKeyValue("isNode", oldisNode)
