// import globals from "can-globals"
import Zone from "can-zone"
import xhrZone from "can-zone/xhr"

// const oldisNode = globals.getKeyValue("isNode")
// hack to trick `can-route` to think this is a browser
// This is required for routing to work (without this, it will always 404)
// globals.setKeyValue("isNode", false)

const ceQueue = []
export const ssrDefineElement = (...args) => ceQueue.push(args)

export const ssrEnd = () => {
  new Zone({
    plugins: [xhrZone],
  })
    .run(function () {
      ceQueue.forEach((args) => customElements.define(...args))
      ceQueue.length = 0
    })
    .then(function (data) {
      if (!globalThis.XHR_CACHE) {
        const temp = document.createElement("div")
        temp.innerHTML = `<script>${data.xhr}</script>`
        document.body.appendChild(temp.lastChild)
      }
    })

  if (globalThis.canStacheElementInertPrerendered) {
    new Zone({
      plugins: [xhrZone],
    })
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
        // console.log("it's alive!")
      })
  }

  // restore `isNode` for globals
  // globals.setKeyValue("isNode", oldisNode)
}
