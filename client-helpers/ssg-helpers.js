import Zone from "can-zone"
import xhrZone from "can-zone/xhr"
import RoutePushstate from "can-route-pushstate"
import { getEnvironments } from "../client-helpers/environment-helpers"

const sharedZone = new Zone({ plugins: [xhrZone] })
export const ssgDefineElement = (...args) => {
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

/**
 * Configures `can-route` to use pushstate to change the
 * window's pathname instead of the hash
 *
 * Also sets `can-route`'s root to environment based on location's pathname. This is used to switch to SPA mode while serving SSG
 */
export const prepareRouting = (route) => {
  route.urlData = new RoutePushstate()

  const root = window.location.pathname.split("/")[1]

  const environments = getEnvironments()

  const matchedEnvironment = environments.find((environment) => root === environment)

  if (matchedEnvironment) {
    route.urlData.root += `${matchedEnvironment}/`
  }
}

export const ssgEnd = () => {
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
        const staticapp = document.querySelector("can-app")
        const temp = document.createElement("div")
        temp.innerHTML = "<can-app></can-app>" // TODO: scrape static attrs from page too
        const liveapp = temp.querySelector("can-app")
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
