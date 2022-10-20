const StacheElement = require('can-stache-element')
const view = require('../app.stache')

class MyStacheElement extends StacheElement {
  static view = view

  static props = {
    message: 'Stache is cool',
  }
}

customElements.define('my-stache-element', MyStacheElement)
document.body.append(document.createElement('my-stache-element'))
console.log('body', document.body.innerHTML)
