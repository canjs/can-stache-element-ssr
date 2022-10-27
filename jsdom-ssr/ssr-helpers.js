import Zone from "can-zone"
import xhrZone from "can-zone/xhr"

const sharedZone = new Zone({ plugins: [xhrZone] })
export const ssrDefineElement = (...args) => {
  sharedZone.run(() => customElements.define(...args))
}

/**
 * @deprecated You should be able to just use `steal.import` directly
 *
 * Gonna keep this here for now in case it turns out not to be true
 */
export const stealImport = (stealPath, callback) => {
  return new Promise((resolve) => {
    sharedZone.run(() => {
      return steal.import(stealPath).then((data) => {
        resolve(callback())
      })
    })
  })
}

export const ssrEnd = () => {
  sharedZone
    .run(() => {})
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
        delete globalThis.canMooStache
        const { staticapp, liveapp } = data.result
        staticapp.remove()
        liveapp.style.display = ""
      })
  }
}
