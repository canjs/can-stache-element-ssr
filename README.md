# can-stache-element-ssr

ssr solution for CanJS 6 custom elements

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
$ node -v # v18.10.0
$ npm -v # 8.19.2
```

#### Installing dependencies:

```bash
$ npm install
```

> TODO: Clean up patches and create issues / PRs as needed

~~For every file in `patches`, replace dependency in `node_modules`, instructions are at the top of each file~~ (when trying to use `npm run build`, there's no need for these patches now)

### Serve

```bash
$ npm run serve
```

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

#### Debugging spawn processes

There will be times when you'll want to debug `scrape.js` which is executed through a spawn process. Debugging can be difficult if you use the existing debug npm scripts / vscode debugger. To get around this, you can just execute `scrape.js` directly:

```bash
$ node --inspect-brk jsdom-ssr/scrape.js http://127.0.0.1:8080/index.html
```

### Challenges
1. `can-zone-jsdom` currently uses `JSDOM@^11` and custom elements aren't supported until `JSDOM@^16`. And because `can-zone-jsdom` gets warnings for `node@^14`, the latest supported version of `JSDOM` we can use with `can-zone-jsdom` is `JSDOM@^19`.

2. `jsdom` doesn't not support web components being defined in multiple documents:
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

3. The above issue makes using `can-zone-jsdom` problematic as well since the same class must be reused, but each page is rendered using a different `JSDOM` instance.

### Technical Decisions

1. `can-zone-jsdom` isn't currently being used for two reasons:
    1. `Challenges #3` (listed above)
    2. We want to move away from using zones on the server side for performance (solution is listed below at `Technical Decisions 3`)

2. We will have to reinitialize CanJS application and use a new `JSDOM` instance for each page. See challenges above `Challenges #2 and #3` (listed above)

3. To avoid having to use zones, we will initialize CanJS application and render each page and rely on:
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
        -   [movetoDocument](https://github.com/donejs/autorender/blob/master/src/template.txt#L226) -  this is what actually moves the CanJS app
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

6. Provide SPA <> SRA navigation for production / development
    - JS+CSS Dev + SPA
    - JS+CSS Prod + SRA
    - [JS+CSS Dev, JS+CSS Prod]
    - [SPA, SRA]

7. Progressive loading
    - Loading the application in split up chunks as needed

8. Application build push state

9. Launch built versions of the files

10. Production stuff for stealjs, etc

11. can-simple-dom (optional)
    -   Replace JSDOM
