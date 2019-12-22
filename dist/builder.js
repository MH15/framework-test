"use strict";
/**
 * Builder module.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("./component");
const path_1 = require("path");
const fs_1 = require("fs");
const Mustache = require("mustache");
const nunjucks = require("nunjucks");
const ejs = require("ejs");
const chokidar = require("chokidar");
function buildAll(component, dirOut, dirInclude) {
    let buildSet = component.build(dirOut, dirInclude);
    let includes = {};
    let joinedStyles = "";
    let joinedScripts = "";
    for (let entry of buildSet) {
        includes[entry] = fs_1.readFileSync(path_1.join(dirOut, "njk", entry + ".njk"), "utf8");
        joinedStyles += fs_1.readFileSync(path_1.join(dirOut, "style", entry + ".css"), "utf8");
        joinedScripts += fs_1.readFileSync(path_1.join(dirOut, "script", entry + ".js"), "utf8");
    }
    // let rendered = Mustache.render(readFileSync(join(dirOut, "mustache", component.name + ".mustache"), "utf8"), {}, includes)
    let filename = path_1.join(dirOut, "njk", component.name + ".njk");
    // let rendered = ejs.render(readFileSync(filename, "utf8"), {
    //     filename: filename
    // })
    nunjucks.configure(path_1.join(dirOut, "njk"));
    let file = fs_1.readFileSync(filename, "utf8");
    let rendered = nunjucks.renderString(file);
    let develop = `<html><head><title>Test</title></head><body>${rendered}<style>${joinedStyles}</style><script>${joinedScripts}</script></body></html>`;
    fs_1.writeFileSync(path_1.join(dirOut, "develop", "temp.html"), develop);
    component.buildSet = buildSet;
    return buildSet;
}
exports.buildAll = buildAll;
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
            root.load(pathRoot);
            buildSetInitial = buildAll(root, dirOut, dirInclude);
        }
        wss.send('reload');
    });
}
exports.buildWatch = buildWatch;
function combine(component, dirOut, dirSearch) {
    let includes = {};
    let joinedStyles = "";
    let joinedScripts = "";
    for (let entry of component.buildSet) {
        includes[entry] = fs_1.readFileSync(path_1.join(dirOut, "njk", entry + ".njk"), "utf8");
        joinedStyles += fs_1.readFileSync(path_1.join(dirOut, "style", entry + ".css"), "utf8");
        joinedScripts += fs_1.readFileSync(path_1.join(dirOut, "script", entry + ".js"), "utf8");
    }
    // let rendered = Mustache.render(readFileSync(join(dirOut, "mustache", component.name + ".mustache"), "utf8"), {}, includes)
    let filename = path_1.join(dirOut, "njk", component.name + ".njk");
    nunjucks.configure(path_1.join(dirOut, "njk"));
    let file = fs_1.readFileSync(filename, "utf8");
    let rendered = nunjucks.renderString(file);
    let develop = `<html><head><title>${component.name}</title></head><body>${rendered}<style>${joinedStyles}</style><script>${joinedScripts}</script></body></html>`;
    return develop;
}
exports.combine = combine;
//# sourceMappingURL=builder.js.map