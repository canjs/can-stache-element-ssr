const url = require("url");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/**
 * A lot of logic stolen from `node_modules/can-zone-jsdom/lib/dom.js`
 */
module.exports = function (html, requestUrl) {
    const dom = new JSDOM(html);

    delete dom.window.location;
    dom.window.location = url.parse(requestUrl, true);

    if(!dom.window.location.protocol) {
        dom.window.location.protocol = "http:";
    }

    // if(request.headers && request.headers["accept-language"]) {
    //     dom.navigator.language = request.headers["accept-language"];
    // }

    global.window = dom.window;
    global.HTMLElement = dom.window.HTMLElement;
    global.NodeFilter = dom.window.NodeFilter;
    global.customElements = dom.window.customElements;
    global.document = dom.window.document;
    global.location = dom.window.location;
    global.Node = window.Node;
}