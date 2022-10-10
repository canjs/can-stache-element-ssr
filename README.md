# can-stache-element-ssr

Depends on `can-zone-jsdom` that uses `jsdom@^19.0.0` which is the latest version of jsdom that supports `node@^12`.

Also have a custom ssr strategy using `jsdom` and `async_hooks`.

### Environment

```bash
$ node -v // v12.22.11
$ npm -v // 6.14.16
```

These are the specific version required for `can-zone-jsdom` to function properly with `jsdom` to support custom elements.

#### Installing dependencies:

```bash
$ npm install
```

> TODO: Clean up patches and create issues / PRs as needed

~~For every file in `patches`, replace dependency in `node_modules`, instructions are at the top of each file~~ (when trying to use `npm run build`, there's no need for these patches now)

### Client

`index.html` <-- host for actual application

`main.js` <-- Defining custom / CanJS elements

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

TODO
