/**
 * Builder module.
 */

import { Component } from './component'
import { join, parse } from "path"
import { readFileSync, writeFileSync } from 'fs'



import * as chokidar from "chokidar"



/**
 * Watch for changes in any of the component files. If the component that has
 * changed included by the component under build, build all included components.
 * @param dirOut the directory to save intermediate files to
 * @param dirSearch the directory to search for included components in 
 * @param pathRoot the path to the component
 */
export function buildWatch(dataPath: string, dirOut: string, dirSearch: string, pathRoot: string, wss: WebSocket) {
    let root = new Component(pathRoot)

    let data = JSON.parse(readFileSync(dataPath, "utf8"))

    let buildSetInitial = root.assemble(data, dirSearch)
    write(root, dirOut)

    console.log("buildSet", buildSetInitial)

    chokidar.watch(dirSearch, {
        ignoreInitial: true
    }).on('all', (event, path) => {
        if (buildSetInitial.has(parse(path).name.toLowerCase())) {
            console.log("Changes made. Building...")
            root.load(pathRoot)

            data = JSON.parse(readFileSync(dataPath, "utf8"))
            buildSetInitial = root.assemble(data, dirSearch)
            // buildSetInitial = buildAll(root, dirOut, dirSearch)

            write(root, dirOut)
        }
        wss.send('reload')
    })
}

function write(component: Component, dirOut) {
    // console.log(component.template.innerHTML)

    let develop = combine(component)
    writeFileSync(join(dirOut, "develop", "temp.html"), develop)
}

// this is for the route render function
// export function combine(component: Component, dirOut: string, dirSearch: string): string {
//     let includes = {}
//     let joinedStyles = ""
//     let joinedScripts = ""
//     for (let entry of component.buildSet) {
//         includes[entry] = readFileSync(join(dirOut, "njk", entry + ".njk"), "utf8")
//         joinedStyles += readFileSync(join(dirOut, "style", entry + ".css"), "utf8")
//         joinedScripts += readFileSync(join(dirOut, "script", entry + ".js"), "utf8")
//     }
//     // let rendered = Mustache.render(readFileSync(join(dirOut, "mustache", component.name + ".mustache"), "utf8"), {}, includes)

//     let filename = join(dirOut, "njk", component.name + ".njk")

//     nunjucks.configure(join(dirOut, "njk"))
//     let file = readFileSync(filename, "utf8")
//     let rendered = nunjucks.renderString(file)
//     let develop = `<html><head><title>${component.name}</title></head><body>${rendered}<style>${joinedStyles}</style><script>${joinedScripts}</script></body></html>`

//     return develop
// }

export function combine(component: Component): string {
    let template = component.template.innerHTML
    console.log("rendered:", template)
    let styles = component.styleString
    let scripts = component.scriptString

    let develop = `<html><head>
    <title>${component.name}</title>
    <style>${styles}</style>
    </head>
    <body>${template}
    <script>${scripts}</script>
    </body></html>`
    return develop
}