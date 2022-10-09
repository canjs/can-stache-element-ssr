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

For every file in `patches`, replace dependency in `node_modules`, instructions are at the top of each file

### Client

`index.html` <-- host for actual application

`client.js` <-- Defining custom / CanJS elements

### Build

#### can-zone-jsdom

Using `can-zone-jsdom`
```bash
$ npm run build
```

generates `dist` <-- static html

#### custom ssr using async_hook + jsdom

```bash
$ npm run build:alt
```

generates `dist` <-- static html

### Debugging

#### vscode

Or debug using vscode:

`RUN AND DEBUG` -> `Launch Program`

Alter config to run `"${workspaceFolder}/can-zone-jsdom/build.js"` or `"${workspaceFolder}/jsdom-ssr/ssr.js"`

#### chrome debugger

Open chrome with url: `chrome://inspect/` --> `Open dedicated DevTools for Node`

then run `npm run build:debug` or `npm run build:alt:debug`
