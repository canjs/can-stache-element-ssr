const { spawn: __node_spawn__ } = require('child_process');
const path = require('path');

const baseUrl = "http://127.0.0.1:8080/index.html";

module.exports = async function(url = baseUrl) {
    return spawn("node", [path.join(__dirname, 'scrape.js'), url]);
}

/**
 * Promise wrapper for child_process.spawn
 */
async function spawn(command, args, options = {}, spawnCallback) {
    return new Promise((resolve, reject) => {
        const spawnInstance = __node_spawn__(command, [...args], {
            stdio: "inherit",
            ...options,
        });

        spawnCallback && spawnCallback(spawnInstance);

        let code;
        let error;

        const setCode = (_code) => {
            code = _code;
        };

        const setError = (_error) => {
            error = _error;
        };

        spawnInstance.on("exit", (exitCode) => {
            setCode(exitCode);
        });

        spawnInstance.on("error", (spawnError) => {
            setError(spawnError);
        });

        spawnInstance.on("close", (closeCode) => {
            setCode(closeCode);

            spawnInstance.stdin && spawnInstance.stdin.end();

            if (error) {
                return reject(error);
            }

            if (code === 1) {
                return reject("Unexpected spawn failed. Exit code 1");
            }

            return resolve(code);
        });
    });
}
