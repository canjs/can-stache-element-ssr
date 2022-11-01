import StacheElement from "can-stache-element"
import { ssgDefineElement } from "../../../../client-helpers/ssg-helpers.js"

class NestedRequestExample extends StacheElement {
  static view = `
     <p id="nested-request-example">
        {{# if(this.request.isPending) }}
            before nested request
        {{/ if }}
        {{# if(this.request.isRejected) }}
            Rejected {{ this.request.reason }}
        {{/ if }}
        {{# if(this.request.isResolved) }}
            {{ this.request.value }}
        {{/ if }}
    </p>
    `

  get request() {
    return xhrGet("http://0.0.0.0:8080/tests/app/assets/mock-nested-response.json").then((res) => {
      return res.data
    })
  }
}

function xhrGet(url) {
  return new Promise((res) => {
    const req = new XMLHttpRequest()
    req.onload = () => {
      if (req.readyState === req.DONE) {
        if (req.status === 200) {
          // TODO: response comes in too fast for playwright without a delay,
          // it can't detect the label's original text
          setTimeout(() => {
            res(JSON.parse(req.responseText))
          }, 500)
        }
      }
    }
    req.open("GET", url)
    req.send()
  })
}

ssgDefineElement("can-nested-request-example", NestedRequestExample)
