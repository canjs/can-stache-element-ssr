# can-stache-element-ssr

Depends on `can-zone-jsdom` that uses `jsdom@^19.0.0` which is the latest version of jsdom that supports `node@^12`

### Environment

node: v12.22.11

npm: v6.14.16

#### Installing dependencies:
Run `npm i`

Replace `node_modules/done-ssr/zones/canjs/route.js` with `route.js`

### Build

build: `npm run build`

generates `dist/output.html` <-- static html

`index.html` <-- host for actual application

### Debugging

Open chrome with url: `chrome://inspect/` --> `Open dedicated DevTools for Node`

then run `npm run build:debug`

Or debug using vscode:

`RUN AND DEBUG` -> `Launch Program`