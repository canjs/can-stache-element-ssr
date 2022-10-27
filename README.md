# can-stache-element-ssr

ssr solution for CanJS 6 custom stache elements

```
/dist/bundles - prod SPA
/dist/ssr - generated static files
/jsdom-ssr - ssr logic
/patches - temporary files that are used to override files in node_modules
/temp - random js that showcases ideas for implementions
/index.html - dev SPA
/main.js - client side code that generates CanJS 6 components
/ssg.json - static files configuration (includes routes)
```

### Limitations

Using `setInterval` will cause the build progress for static pages to hang. For more information look into Technical Decisions #3 involving 
```javascript
process.once("beforeExit", (code) => {
   // ...
})
```
### Environment

```bash
$ node -v # 14.20.0
$ npm -v # 6.14.17
```

#### Installing dependencies:

```bash
$ npm install
```

### Build

```bash
$ npm run build # Generates dev static pages
```

```bash
$ npm run build-prod # Generates prod static pages
```

generates `dist/ssr` <-- static html files

### Serve

To serve in static mode where built files from /dist are used by defualt

```bash
$ npm run serve
```

To serve in dev mode where built files from /dist are not used (except dist/404/index.html as needed)

```bash
$ npm run serve-dev
```

To serve in prod mode where built files from /dist are not used (except dist/404/index.html as needed)

```bash
$ npm run serve-prod
```

Both commands run server.js in the project root and serves any file a request directly points at.

If that file doesn't exist, it serves dist/404/index.html

- http://localhost:8080/main.js -> serves the main.js file
- http://localhost:8080/jane.ori -> serves dist/404/index.html with status 404
- http://localhost:8080/dist/404/index.html -> serves dist/404/index.html with status 200

For directories,

#### In SPA `npm run serve-dev` mode

Always serve the root /index.html

main.js sets the can-route page data to the first /slug/ in the path so the correct page loads

- http://localhost:8080/ -> serves /index.html + page is "home"
- http://localhost:8080/tasks -> serves /index.html + page is "tasks"
- http://localhost:8080/asdf -> serves /index.html (with status 200) + page is "asdf" (shows 404 page)

#### In SPA `npm run serve-prod` mode

Functions like `npm run serve-dev` mode with 3 changes:

1. Requires running `npm run build-prod` first to work as expected

2. Always serve the root /production.html

3. /dist/bundles/can-stache-element-ssr/main.js sets the can-route page data to the first /slug/ in the path so the correct page loads

#### In static `npm run serve` mode

If the request points at a directory, it will prepend "/dist" to the request path and serve the index.html in that folder. If the path or its index.html file doesn't exist, it serves dist/404/index.html

can-route data "page" is set to the first /slug/ or to "home" if on the root

- http://localhost:8080/ -> serves dist/index.html + page is "home"
- http://localhost:8080/tasks -> serves dist/tasks/index.html + page is "tasks"
- http://localhost:8080/asdf -> serves dist/404/index.html (with status 404) + page is "asdf" (shows 404 page)

#### In either mode

If you prepend /dev to the request path, it serves root /index.html file.
If you prepend /prod to the request path, it serves root /production.html file.

main.js sets the can-route page data to the first /slug/ after /dev so the correct page loads in dev/spa mode.
can-route then automatically uses pushstate to remove the "dev" sentenil value in the url quietly.

- http://localhost:8080/dev/ -> serves /index.html + page is "home"
- http://localhost:8080/dev/tasks -> serves /index.html + page is "tasks"
- http://localhost:8080/dev/asdf -> serves /index.html (with status 200) + page is "asdf" (shows 404 page)

#### Also in either mode

You can go directly to the built index.html file to load the built one, main.js and can-route update it to the correct "page" on hydrate and the url silently changes to the correct path

- http://localhost:8080/dist/tasks/index.html -> serves dist/tasks/index.html + page is "tasks"

### Debugging

#### vscode

Or debug using vscode:

`RUN AND DEBUG` -> `Launch Program`

Alter config to run `"${workspaceFolder}/can-zone-jsdom/build.js"` or `"${workspaceFolder}/jsdom-ssr/ssr.js"`

#### chrome inspector

Open chrome with url: `chrome://inspect/` --> `Open dedicated DevTools for Node`

```bash
$ npm run build-debug
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
   const { window } = new JSDOM(`<!DOCTYPE html>`)
   const document = window.document

   class MyElement extends window.HTMLElement {
     /** ... */
   }

   window.customElements.define("my-element", MyElement)
   document.body.append(doc.createElement("my-element")) // This is okay

   // Attempting to use `MyElement` again for a different window / document

   const { window: window2 } = new JSDOM(`<!DOCTYPE html>`)
   const document2 = window2.document

   window2.customElements.define("my-element", MyElement)
   document2.body.append(doc2.createElement("my-element")) // This throws

   // ! Error: Uncaught [NotSupportedError: Unexpected element owner document.]
   ```

3. The above issue makes using `can-zone-jsdom` problematic as well since the same class must be reused, but each page is rendered using a different `JSDOM` instance.

4. `steal-tools` doesn't support Node v18, the highest version of Node we can use is Node v14. This is the minimum version to use the latest version of `JSDOM`.

### Technical Decisions

1. `can-zone-jsdom` isn't currently being used for two reasons:

   1. `Challenges #3` (listed above)
   2. We want to move away from using zones on the server side for performance (solution is listed below at `Technical Decisions 3`)

2. We will have to reinitialize CanJS application and use a new `JSDOM` instance for each page. See challenges above `Challenges #2 and #3` (listed above)

3. To avoid having to use zones, we will initialize CanJS application and render each page and rely on:
   ```javascript
   process.once("beforeExit", (code) => {
     // TODO: scape document
   })
   ```
   to know when application is stable and can be scraped
4. TODO: explain why we're injecting steal and production bundle at the end of body tag

### Roadmap

List of tasks in order of most important to least important

1. Reattachment
   - Improve zones to handle web components on the frontend (!)
   - ConnectedCallback() <-- sync vs async > if it is async, then we have to make sure their connected hooks (...)
   - Handle updating / setting document title like `done-autorender` [template.txt](https://github.com/donejs/autorender/blob/master/src/template.txt)
     - [movetoDocument](https://github.com/donejs/autorender/blob/master/src/template.txt#L226) - this is what actually moves the CanJS app
     - [renderInZone](https://github.com/donejs/autorender/blob/master/src/template.txt#L298)
2. Figure out dist structure, ask everyone on how to go about query params

   - Escaping characters, etc

3. NodeJs Worker threads

   - improvement in performance instead of spawning processes

4. Build a more robust application

   - Routing examples
   - Complex network request use fetch

5. Provide this as cache from server to client 1. Store all api requests -> responses 2. Cached xhr assets for post initial page > cached s3 assests - `XHR_CACHE` originally in [can-zone](https://github.com/canjs/can-zone/blob/master/lib/zones/xhr.js)
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
    - Replace JSDOM
