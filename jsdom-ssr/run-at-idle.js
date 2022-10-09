const async_hooks = require("async_hooks");
const fs = require("fs");
const { fd } = process.stdout;

/**
 * Runs callback once there are no more async logic
 * running result in nodejs being "idle".
 * 
 * Uses `async_hook` internally
 */
module.exports = function(cb) {
    let counter = 0;

    const hook = async_hooks.createHook({
        init(asyncId, type, triggerAsyncId) {
            counter += 1;
            // const eid = async_hooks.executionAsyncId();
            // fs.writeSync(fd, `${type}(${asyncId}):` + ` trigger: ${triggerAsyncId} execution: ${eid} counter: ${counter}\n`);
            // fs.writeSync(fd, `init:  ${counter}\n`);
        },
        destroy(asyncId) {
            counter -= 1;
            // fs.writeSync(fd, `destroy:  ${asyncId} counter: ${counter}\n`);
            // fs.writeSync(fd, `destroy:  ${counter}\n`);

            if (!counter) {
                // fs.writeSync(fd, `finished\n`);

                onCounterIsZero();
            }
        },
    });
    
    hook.enable();

    function onCounterIsZero() {
        hook.disable();
        cb();
    }
}
