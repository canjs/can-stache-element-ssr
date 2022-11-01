import StacheElement from "can-stache-element"
import route from "can-route"
import "can-stache-route-helpers"
import { prepareRouting, ssgDefineElement } from "../../../client-helpers/ssg-helpers.js"
import "../css-example/css-example"
import "../not-found-example/not-found-example"

prepareRouting(route)

route.register("{page}", { page: "home" })
route.register("css-example", { page: "css-example" })

route.start()

class RouteExample extends StacheElement {
  static view = `
      <div>
        <a id="home" href="{{ routeUrl(page='home') }}">Home</a>
        <a id="css" href="{{ routeUrl(page='css') }}">Css</a>
        <a id="not-found" href="{{ routeUrl(page='unknown') }}">404</a>
        <!--<a id="home" href="{{ routeUrl(page='progressive-loading') }}">Progressive Loading</a>-->
      </div>
      <p id="page-tracker">The current page is {{ this.routeData.page }}.</p>
      {{ this.componentToShow }}
    `

  static props = {
    routeData: {
      get default() {
        return route.data
      },
    },
  }

  get componentToShow() {
    console.log("route.data.page", this.routeData.page)

    switch (this.routeData.page) {
      case "home":
        const home = document.createElement("h3")
        home.innerHTML = "Home Route"
        return home
      case "css":
        return document.createElement("can-css-example")
      default:
        return document.createElement("can-not-found-example")
    }
  }
}

ssgDefineElement("can-route-example", RouteExample)
