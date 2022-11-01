import StacheElement from "can-stache-element"
import route from "can-route"
import { ssgDefineElement } from "../../../client-helpers/ssg-helpers.js"

class ProgressiveLoadingExample extends StacheElement {
  static view = `
      <div>
        <a id="nested-root" href="{{ routeUrl(nestedPage='root') }}">Root</a>
        <a id="nested-timeout" href="{{ routeUrl(nestedPage='nested-timeout') }}">Nested Timeout</a>
        <a id="nested-request" href="{{ routeUrl(nestedPage='nested-request') }}">Nested Request</a>
      </div>
      <p id="nested-page-tracker">The current nestedPage is {{ this.routeData.nestedPage }}.</p>
      {{# if(this.componentToShow.isPending) }}
          <h2>Nested Route Loading...</h2>
      {{/ if }}
      {{# if(this.componentToShow.isRejected) }}
        <h2>Rejected {{ componentToShow.reason }}</h2>
      {{/ if }}
      {{# if(this.componentToShow.isResolved) }}
        {{ componentToShow.value }}
      {{/ if }}
    `

  static props = {
    routeData: {
      get default() {
        return route.data
      },
    },
  }

  get componentToShow() {
    if (!this.routeData.nestedPage || this.routeData.nestedPage === "root") {
      const root = document.createElement("h4")
      root.innerHTML = "Nested Root Route"
      return Promise.resolve(root)
    }

    switch (this.routeData.nestedPage) {
      case "nested-request":
        return steal
          .import(`can-stache-element-ssr/tests/app/progressive-loading-example/nested-request-example/nested-request-example`)
          .then(() => {
            return document.createElement("can-nested-request-example")
          })
      case "nested-timeout":
        return steal
          .import(`can-stache-element-ssr/tests/app/progressive-loading-example/nested-timeout-example/nested-timeout-example`)
          .then(() => {
            return document.createElement("can-nested-timeout-example")
          })
      default:
        const unknown = document.createElement("h4")
        unknown.innerHTML = "Nested Unknown Route"
        return Promise.resolve(unknown)
    }
  }
}

ssgDefineElement("can-progressive-loading-example", ProgressiveLoadingExample)
