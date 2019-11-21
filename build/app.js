"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Startup {
    static main() {
        console.log('Hello World');
        return 0;
    }
}
Startup.main();
const component_1 = require("./component");
const path_1 = require("path");
const fs_1 = require("fs");
const Mustache = require("mustache");
const DIR_DIST = path_1.join(__dirname, '..', 'dist');
const DIR_SEARCH = path_1.join(__dirname, '..', 'components');
let component = new component_1.Component(path_1.join(__dirname, '..', 'components', 'demo.component'));
// console.log(component)
let buildSet = component.build(DIR_DIST, DIR_SEARCH);
console.log(buildSet);
let includes = {};
let joinedStyles = "";
let joinedScripts = "";
for (let entry of buildSet) {
    includes[entry] = fs_1.readFileSync(path_1.join(DIR_DIST, "mustache", entry + ".mustache"), "utf8");
    joinedStyles += fs_1.readFileSync(path_1.join(DIR_DIST, "style", entry + ".css"), "utf8");
    joinedScripts += fs_1.readFileSync(path_1.join(DIR_DIST, "script", entry + ".js"), "utf8");
}
// TODO: a helper function to use buildSet to pass all needed templates into the mustache
let rendered = Mustache.render(fs_1.readFileSync(path_1.join(DIR_DIST, "mustache", "demo.mustache"), "utf8"), {}, includes);
console.log(rendered);
