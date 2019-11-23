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
let server = new server_1.Server();
server.start(8000);
//# sourceMappingURL=app.js.map