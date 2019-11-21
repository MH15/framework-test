"use strict";
/**
 * Builder module.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("./component");
const path_1 = require("path");
const fs_1 = require("fs");
const Mustache = require("mustache");
const chokidar = require("chokidar");
function buildAll(component, dirOut, dirInclude) {
    // Build component files
    let buildSet = component.build(dirOut, dirInclude);
    // Combine and serve
    let includes = {};
    let joinedStyles = "";
    let joinedScripts = "";
    for (let entry of buildSet) {
        includes[entry] = fs_1.readFileSync(path_1.join(dirOut, "mustache", entry + ".mustache"), "utf8");
        joinedStyles += fs_1.readFileSync(path_1.join(dirOut, "style", entry + ".css"), "utf8");
        joinedScripts += fs_1.readFileSync(path_1.join(dirOut, "script", entry + ".js"), "utf8");
    }
    let rendered = Mustache.render(fs_1.readFileSync(path_1.join(dirOut, "mustache", "demo.mustache"), "utf8"), {}, includes);
    console.log(rendered, joinedStyles, joinedScripts);
    return buildSet;
}
function buildWatch(dirOut, dirInclude, dirRoot) {
    let root = new component_1.Component(dirRoot);
    let buildSetInitial = buildAll(root, dirOut, dirInclude);
    chokidar.watch(dirInclude, {
        ignoreInitial: true
    }).on('all', (event, path) => {
        // TODO: run builder whenever any item in buildSet is changed
        if (buildSetInitial.has(path_1.parse(path).name)) {
            root.load(dirRoot);
            buildSetInitial = buildAll(root, dirOut, dirInclude);
        }
        console.log(event, path);
    });
}
exports.buildWatch = buildWatch;
//# sourceMappingURL=builder.js.map