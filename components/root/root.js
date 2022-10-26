import StacheElement from "can-stache-element"
import { ssrDefineElement } from "../../jsdom-ssr/ssr-helpers"
import route from "can-route"
import "can-stache-route-helpers"
// import "../moo/moo";
import "../cow/cow"
import "./root.css"

// route.register("progressive-loading/moo", { loadId: "moo", page: "moo" });
// route.register("progressive-loading/cow", { loadId: "cow", page: "cow" });

export class MyRoot extends StacheElement {
  static view = `
        <a href="{{ routeUrl(loadId='cow') }}">Cow</a> <a href="{{ routeUrl(loadId='moo') }}">Moo</a> <a href="{{ routeUrl(loadId='root') }}">Root</a>

        {{# if(this.comp.isPending) }}
            Loading...
        {{/ if }}
        {{# if(this.comp.isRejected) }}
            Rejected {{ comp.reason }}
        {{/ if }}
        {{# if(this.comp.isResolved) }}
            {{ comp.value }}
        {{/ if }}
    `

  static props = {
    routeData: {
      get default() {
        return route.data
      },
    },
  }

  get comp() {
    const loadId = this.routeData.loadId
    console.log("comp", loadId)

    if (!loadId || loadId === "root") {
      const root = document.createElement("h2")
      root.innerHTML = "Welcome Root"
      return Promise.resolve(root)
    }

    if (loadId === "moo") {
      // const root = document.createElement("h2");
      // root.innerHTML = "Welcome Moo";
      // return Promise.resolve(root);
      // return Promise.resolve(document.createElement('progressive-moo'));
      return steal.import(`can-stache-element-ssr/components/moo/moo`).then(() => {
        const div = document.createElement("div")
        const temp = document.createElement("progressive-moo")
        div.appendChild(temp)
        const span = document.createElement("span")
        span.innerText = "moocow"
        div.appendChild(span)
        return div
      })
    }

    if (loadId === "cow") {
      // const root = document.createElement("h2");
      // root.innerHTML = "Welcome Cow";
      // return Promise.resolve(root);
      return Promise.resolve(document.createElement("progressive-cow"))
    }

    const unknown = document.createElement("h2")
    unknown.innerHTML = "Progressive Loading 404"
    return Promise.resolve(unknown)

    // return steal.import(`myhub/${hash}/${hash}`).then(function(moduleOrPlugin){
    //     var plugin = typeof moduleOrPlugin === "function" ?
    //         moduleOrPlugin : moduleOrPlugin["default"];

    //     const ele = document.createElement('div');
    //     return plugin();
    // });
  }
}

// customElements.define("progressive-loading", MyRoot)
ssrDefineElement("progressive-loading", MyRoot)
