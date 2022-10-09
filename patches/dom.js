/**
 * Replace `node_modules/can-zone-jsdom/lib/dom.js:10`
 * 
 * Search for `// Patch` for code changes
*/
const JSDOM = require("jsdom").JSDOM;
const once = require("once");
const url = require("url");
const zoneRegister = require("can-zone/register");
const raf = require("raf");

module.exports = function(request, pageHTML){
	return function(data){
		const window = new JSDOM(pageHTML).window;
        // Patch START
		delete window.location;// <-- window.location cannot be set (likely readonly)
		// Patch END
        window.location = url.parse(request.url, true);
		if(!window.location.protocol) {
			window.location.protocol = "http:";
		}

		if(request.headers && request.headers["accept-language"]) {
			window.navigator.language = request.headers["accept-language"];
		}

		window.requestAnimationFrame = raf;

		return {
			globals: {
				HTMLElement: window.HTMLElement,
				NodeFilter: window.NodeFilter,
				customElements: window.customElements,
				window: window,
				document: window.document,
				location: window.location
			},
			created: function(){
				data.window = window;
				data.document = window.document;
				data.request = request;
				registerNode(window);
			},
			ended: function(){
				data.html = window.document.documentElement.outerHTML;
			}
		};
	};
};

// Calls to can-zone/register so that Node.prototype.addEventListener is wrapped.
// This only needs to happen once, ever.
var registerNode = once(function(window) {
	var oldNode = global.Node;
	global.Node = window.Node;
	zoneRegister();
	global.Node = oldNode;
});
