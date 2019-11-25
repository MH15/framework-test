/**
 * Builder module.
 */

import { Component } from './component';
import { join, parse } from "path";
import { readFileSync, writeFileSync } from 'fs';

const Mustache = require("mustache")
import * as chokidar from "chokidar"
import { WebSocketController } from './server/live-server';


export function buildAll(component: Component, dirOut: string, dirInclude: string): Set<string> {
    let buildSet = component.build(dirOut, dirInclude)
    let includes = {}
    let joinedStyles = ""
    let joinedScripts = ""
    for (let entry of buildSet) {
        includes[entry] = readFileSync(join(dirOut, "mustache", entry + ".mustache"), "utf8")
        joinedStyles += readFileSync(join(dirOut, "style", entry + ".css"), "utf8")
        joinedScripts += readFileSync(join(dirOut, "script", entry + ".js"), "utf8")
    }
    let rendered = Mustache.render(readFileSync(join(dirOut, "mustache", component.name + ".mustache"), "utf8"), {}, includes)

    let develop = `<html><head><title>Test</title></head><body>${rendered}<style>${joinedStyles}</style><script>${joinedScripts}</script></body></html>`
    writeFileSync(join(dirOut, "develop", "temp.html"), develop)
    component.buildSet = buildSet
    return buildSet
}

export function combine(component: Component, dirOut: string, dirSearch: string): string {
    let includes = {}
    let joinedStyles = ""
    let joinedScripts = ""
    for (let entry of component.buildSet) {
        includes[entry] = readFileSync(join(dirOut, "mustache", entry + ".mustache"), "utf8")
        joinedStyles += readFileSync(join(dirOut, "style", entry + ".css"), "utf8")
        joinedScripts += readFileSync(join(dirOut, "script", entry + ".js"), "utf8")
    }
    let rendered = Mustache.render(readFileSync(join(dirOut, "mustache", component.name + ".mustache"), "utf8"), {}, includes)

    let develop = `<html><head><title>Test</title></head><body>${rendered}<style>${joinedStyles}</style><script>${joinedScripts}</script></body></html>`

    return develop
}

/**
 * Watch for changes in any of the component files. If the component that has
 * changed included by the component under build, build all included components.
 * @param dirOut the directory to save intermediate files to
 * @param dirInclude the directory to search for included components in 
 * @param pathRoot the path to the component
 */
export function buildWatch(dirOut: string, dirInclude: string, pathRoot: string, wss: WebSocket) {
    let root = new Component(pathRoot)

    let buildSetInitial = buildAll(root, dirOut, dirInclude)

    chokidar.watch(dirInclude, {
        ignoreInitial: true
    }).on('all', (event, path) => {
        if (buildSetInitial.has(parse(path).name)) {
            root.load(pathRoot)
            buildSetInitial = buildAll(root, dirOut, dirInclude)
        }
        wss.send('reload')
    });

}