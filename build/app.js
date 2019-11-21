"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Startup {
    static main() {
        console.log('Hello World');
        return 0;
    }
}
Startup.main();
const path_1 = require("path");
const builder_1 = require("./builder");
const DIR_OUT = path_1.join(__dirname, '..', 'dist');
const DIR_SEARCH = path_1.join(__dirname, '..', 'components');
const DIR_ROOT = path_1.join(__dirname, "..", "components", "demo.component");
builder_1.buildWatch(DIR_OUT, DIR_SEARCH, DIR_ROOT);
//# sourceMappingURL=app.js.map