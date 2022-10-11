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

1. Figure out dist structure, ask everyone on how to go about query params

2. escaping characters, etc

3. NodeJs Worker threads

4. routing examples

5. reattachment

6. complex network request use fetch
    1. store all api requests -> responses

    2.  provide this as cache from server to client

    3.  TODO: Justin provide info CanJS

7. progressive loading

8. application build push state

9. launch built versions of the files

10. production stuff for stealjs, etc

11. can-simple-dom
