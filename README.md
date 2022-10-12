# can-stache-element-ssr

Depends on `jsdom@^19.0.0` which is the latest version of jsdom that supports `node@^12`.

```
/dist - generated static files
/jsdom-ssr - ssr logic
/patches - files that are used to override files in node_modules
/temp - random js that showcases ideas for implementions
/index.html - serve to view application (not used for ssr)
/main.js - client side code that generates CanJS 6 components
```

### Environment

```bash
$ node -v // v12.22.11
$ npm -v // 6.14.16
```

#### Installing dependencies:

```bash
$ npm install
```

> TODO: Clean up patches and create issues / PRs as needed

~~For every file in `patches`, replace dependency in `node_modules`, instructions are at the top of each file~~ (when trying to use `npm run build`, there's no need for these patches now)

### Build

```bash
$ npm run build
```

generates `dist` <-- static html

### Debugging

#### vscode

Or debug using vscode:

`RUN AND DEBUG` -> `Launch Program`

Alter config to run `"${workspaceFolder}/can-zone-jsdom/build.js"` or `"${workspaceFolder}/jsdom-ssr/ssr.js"`

#### chrome inspector

Open chrome with url: `chrome://inspect/` --> `Open dedicated DevTools for Node`

```bash
$ npm run build:debug
```
### Challenges

1. `jsdom` doesn't not support web components being defined in multiple documents:
    ```javascript
    const { window } = new JSDOM(`<!DOCTYPE html>`);
    const document = window.document;

    class MyElement extends window.HTMLElement {/** ... */ }

    window.customElements.define("my-element", MyElement);
    document.body.append(doc.createElement("my-element"));// This is okay

    // Attempting to use `MyElement` again for a different window / document

    const { window: window2 } = new JSDOM(`<!DOCTYPE html>`);
    const document2 = window2.document;

    window2.customElements.define("my-element", MyElement);
    document2.body.append(doc2.createElement("my-element"));// This throws

    // ! Error: Uncaught [NotSupportedError: Unexpected element owner document.]
    ```

2. The above issue makes using `can-zone-jsdom` problematic as well since the same class must be reused, but each page is rendered using a different `JSDOM` instance.

### Technical Decisions

1. We will have to reinitialize CanJS application and use a new `JSDOM` instance for each page. See challenges above (1 and 2)

2. To avoid having to use zones, we will initialize CanJS application and render each page and rely on:
    ```javascript
    process.once("beforeExit", (code) => {
        // TODO: scape document
    });
    ```
    to know when application is stable and can be scraped

### Roadmap

List of tasks in order of most important to least important

1. Reattachment
    -   Improve zones to handle web components on the frontend (!)
    -   ConnectedCallback() <-- sync vs async > if it is async, then we have to make sure their connected hooks (...)
    -   Handle updating / setting document title like `done-autorender` [template.txt](https://github.com/donejs/autorender/blob/master/src/template.txt)
        -   [movetoDocument](https://github.com/donejs/autorender/blob/master/src/template.txt#L226)
        -   [renderInZone](https://github.com/donejs/autorender/blob/master/src/template.txt#L298)
2. Figure out dist structure, ask everyone on how to go about query params
    -   Escaping characters, etc
3. NodeJs Worker threads
    -   improvement in performance instead of spawning processes
4. Build a more robust application
    -   Routing examples
    -   Complex network request use fetch
5. Provide this as cache from server to client
    1.  Store all api requests -> responses
    2.  Cached xhr assets for post initial page > cached s3 assests
    -   `XHR_CACHE` originally in [can-zone](https://github.com/canjs/can-zone/blob/master/lib/zones/xhr.js)
and [done-ssr](https://github.com/donejs/done-ssr/blob/master/zones/requests/xhr-cache.js)
6. Progressive loading

7. Application build push state

8. Launch built versions of the files

9. Production stuff for stealjs, etc

10. can-simple-dom (optional)
    -   Replace JSDOM
