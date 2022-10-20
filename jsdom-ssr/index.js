const spawnBuildProcess = require('./spawn-build-process');
const { ensureDirSync, emptyDirSync, readJsonSync } = require('fs-extra');
// const { Worker, isMainThread, parentPort } = require('worker_threads');
const path = require('path');

// const altRequestBuild = path.join(__dirname, 'alt-request-build.js');

main();

async function main() {
  // Create dist directory
  await ensureDirSync('dist');
  // Clear it
  await emptyDirSync('dist');

  const ssgSettings = readJsonSync('ssg.json');

  const routes = ssgSettings.routes;

  for (const route of routes) {
    spawnBuildProcess(route);
  }
}
