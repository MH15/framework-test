"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Startup {
    static main() {
        console.log('Hello World');
        return 0;
    }
}
const path_1 = require("path");
/**
 * Config
 */
const PROJECT = path_1.join(__dirname, "..");
const server_1 = require("./server/server");
const DIR_OUT = path_1.join(PROJECT, 'dist');
const DIR_SEARCH = path_1.join(PROJECT, 'components');
const DIR_ROOT = path_1.join(PROJECT, "components", "demo.component");
const routes = require(path_1.join(PROJECT, 'config', 'routes.json'));
// console.log(routes)
// buildWatch(DIR_OUT, DIR_SEARCH, DIR_ROOT)
class Framework {
    constructor(appRoot) {
        this.appRoot = appRoot;
    }
    // TODO: build
    // TODO: buildWatch
    serve(port) {
        let routes = require(path_1.join(this.appRoot, "config", "routes.json"));
        console.log("TIT");
        console.log(routes);
        this.server = new server_1.Server(path_1.join(this.appRoot, "controllers"), routes);
        this.server.start(port);
    }
}
module.exports = Framework;
//# sourceMappingURL=app.js.map