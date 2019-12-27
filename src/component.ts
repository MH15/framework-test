
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs"
import { parseHTML } from './utils/dom/current-parser'

import { join, parse } from "path"
import { newDir } from "./utils/file"
const sass = require('node-sass')

import { getElementsByTagName } from "./utils/dom/finders"

const nunjucks = require("nunjucks")

import * as DOM from "./utils/dom/dom"

interface ComponentElement {
    dom: DOM.Node,
    body: string,
    css?: string
}


/**
 * A Single File Component.
 */
class Component {
    public name: string
    private file: string
    public template: DOM.Node
    public style: DOM.Node
    public script: DOM.Node
    public buildSet: Set<string>

    /**
     * Create a new component instance from filepath.
     * @param filepath path to a valid .component file
     */
    constructor(filepath: string) {
        this.load(filepath)
    }

    public load(filepath: string): void {
        this.file = readFileSync(filepath, "utf8")
        this.name = parse(filepath).name
        let dom = parseHTML(this.file)

        this.template = getElementsByTagName(dom, "template")[0]
        this.style = getElementsByTagName(dom, "style")[0]
        this.script = getElementsByTagName(dom, "script")[0]

    }

    /**
     * Build template, style, and scripts to buildPath
     * @param buildPath the directory to build to
     */
    public build(buildPath: string, includePath: string): Set<string> {
        let result = ""
        this.buildSet = new Set<string>()
        this.buildSet.add(this.name)
        newDir(join(buildPath, "ejs"))
        newDir(join(buildPath, "njk"))
        newDir(join(buildPath, "style"))
        newDir(join(buildPath, "script"))

        // build mustache to dist/ejs folder
        let mustachePath = join(buildPath, "njk", this.name + ".njk")
        writeFileSync(mustachePath, this.template.innerHTML)

        // build style to dist/style folder
        let stylePath = join(buildPath, "style", this.name + ".css")
        let css = compileStyles(this.style)
        writeFileSync(stylePath, this.style.innerHTML)

        // build script to dist/script folder
        let scriptPath = join(buildPath, "script", this.name + ".js")
        writeFileSync(scriptPath, this.script.innerHTML)


        // build all referenced files as well
        let r = this.template.getAttribute("include")
        if (r) {
            let referencedComponents = this.template.getAttribute("include").split(",")
            referencedComponents.forEach(name => {
                // console.log(`Building component "${name}".`)
                let refPath = join(includePath, name + ".component")
                // console.log("includePath", includePath)
                // console.log("refPath", refPath)
                let c = new Component(refPath)
                let smallSet = c.build(buildPath, includePath)
                smallSet.forEach((s) => {
                    this.buildSet.add(s)
                })
            })
        }
        return this.buildSet
    }
}



/**
* Compile styles using the correct preprocessor.
* @param {Node} style the DOM Node
*/
function compileStyles(style: DOM.Node): string {
    let styleLang = style.getAttribute("lang") || "css"
    let styleResult
    switch (styleLang) {
        case "scss":
            styleResult = sass.renderSync({
                data: style.innerHTML
            }).css.toString()
            break
        case "less":
            // TODO: implement less
            break
        default:
            styleResult = style.innerHTML
            break
    }
    return styleResult
}

export { Component }
