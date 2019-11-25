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
    let buildSet = component.build(dirOut, dirInclude);
    let includes = {};
    let joinedStyles = "";
    let joinedScripts = "";
    for (let entry of buildSet) {
        includes[entry] = fs_1.readFileSync(path_1.join(dirOut, "mustache", entry + ".mustache"), "utf8");
        joinedStyles += fs_1.readFileSync(path_1.join(dirOut, "style", entry + ".css"), "utf8");
        joinedScripts += fs_1.readFileSync(path_1.join(dirOut, "script", entry + ".js"), "utf8");
    }
    let rendered = Mustache.render(fs_1.readFileSync(path_1.join(dirOut, "mustache", component.name + ".mustache"), "utf8"), {}, includes);
    let develop = `<html><head><title>Test</title></head><body>${rendered}<style>${joinedStyles}</style><script>${joinedScripts}</script></body></html>`;
    fs_1.writeFileSync(path_1.join(dirOut, "develop", "temp.html"), develop);
    component.buildSet = buildSet;
    return buildSet;
}
exports.buildAll = buildAll;
function combine(component, dirOut, dirSearch) {
    let includes = {};
    let joinedStyles = "";
    let joinedScripts = "";
    for (let entry of component.buildSet) {
        includes[entry] = fs_1.readFileSync(path_1.join(dirOut, "mustache", entry + ".mustache"), "utf8");
        joinedStyles += fs_1.readFileSync(path_1.join(dirOut, "style", entry + ".css"), "utf8");
        joinedScripts += fs_1.readFileSync(path_1.join(dirOut, "script", entry + ".js"), "utf8");
    }
    let rendered = Mustache.render(fs_1.readFileSync(path_1.join(dirOut, "mustache", component.name + ".mustache"), "utf8"), {}, includes);
    let develop = `<html><head><title>Test</title></head><body>${rendered}<style>${joinedStyles}</style><script>${joinedScripts}</script></body></html>`;
    return develop;
}
exports.combine = combine;
/**
 * Watch for changes in any of the component files. If the component that has
 * changed included by the component under build, build all included components.
 * @param dirOut the directory to save intermediate files to
 * @param dirInclude the directory to search for included components in
 * @param pathRoot the path to the component
 */
function buildWatch(dirOut, dirInclude, pathRoot, wss) {
    let root = new component_1.Component(pathRoot);
    let buildSetInitial = buildAll(root, dirOut, dirInclude);
    chokidar.watch(dirInclude, {
        ignoreInitial: true
    }).on('all', (event, path) => {
        if (buildSetInitial.has(path_1.parse(path).name)) {
            console.log("BEFORE");
            root.load(pathRoot);
            console.log("AFTER");
            buildSetInitial = buildAll(root, dirOut, dirInclude);
        }
        console.log(wss);
        wss.send('reload');
    });
}
exports.buildWatch = buildWatch;
//# sourceMappingURL=builder.js.map