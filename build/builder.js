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
    let develop = `<html><head><title>Test</title></head><body>${rendered}<style>${joinedStyles}</style><script>${joinedScripts}</script></body></html>`;
    fs_1.writeFileSync(path_1.join(dirOut, "develop", "index.html"), develop);
    return buildSet;
}
/**
 * Watch for changes in any of the component files. If the component that has
 * changed included by the component under build, build all included components.
 * @param dirOut the directory to save intermediate files to
 * @param dirInclude the directory to search for included components in
 * @param pathRoot the path to the component
 */
function buildWatch(dirOut, dirInclude, pathRoot) {
    let root = new component_1.Component(pathRoot);
    let buildSetInitial = buildAll(root, dirOut, dirInclude);
    chokidar.watch(dirInclude, {
        ignoreInitial: true
    }).on('all', (event, path) => {
        // TODO: run builder whenever any item in buildSet is changed
        if (buildSetInitial.has(path_1.parse(path).name)) {
            root.load(pathRoot);
            buildSetInitial = buildAll(root, dirOut, dirInclude);
        }
        console.log(event, path);
    });
}
exports.buildWatch = buildWatch;
//# sourceMappingURL=builder.js.map