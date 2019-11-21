/**
 * Builder module.
 */

import { Component } from './component';
import { join, parse } from "path";
import { readFileSync } from 'fs';

const Mustache = require("mustache")
import * as chokidar from "chokidar"


function buildAll(component: Component, dirOut: string, dirInclude: string): Set<string> {
    // Build component files
    let buildSet = component.build(dirOut, dirInclude)

    // Combine and serve

    let includes = {}
    let joinedStyles = ""
    let joinedScripts = ""
    for (let entry of buildSet) {
        includes[entry] = readFileSync(join(dirOut, "mustache", entry + ".mustache"), "utf8")
        joinedStyles += readFileSync(join(dirOut, "style", entry + ".css"), "utf8")
        joinedScripts += readFileSync(join(dirOut, "script", entry + ".js"), "utf8")
    }
    let rendered = Mustache.render(readFileSync(join(dirOut, "mustache", "demo.mustache"), "utf8"), {}, includes)
    console.log(rendered, joinedStyles, joinedScripts)
    return buildSet
}


export function buildWatch(dirOut: string, dirInclude: string, dirRoot: string) {

    let root = new Component(dirRoot)


    let buildSetInitial = buildAll(root, dirOut, dirInclude)

    chokidar.watch(dirInclude, {
        ignoreInitial: true
    }).on('all', (event, path) => {
        // TODO: run builder whenever any item in buildSet is changed
        if (buildSetInitial.has(parse(path).name)) {
            root.load(dirRoot)
            buildSetInitial = buildAll(root, dirOut, dirInclude)
        }
        console.log(event, path);
    });

}