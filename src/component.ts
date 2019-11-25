
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs"
import { parseHTML } from './utils/parser';

import { join, parse } from "path";
const sass = require('node-sass')



interface ComponentElement {
    dom: HTMLElement,
    body: string,
    css?: string
}


/**
 * A Single File Component.
 */
class Component {
    public name: string
    private file: string
    public template: ComponentElement
    public style: ComponentElement
    public script: ComponentElement
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
        let a = parseHTML(this.file)
        this.template = {
            dom: a.getElementsByTagName("template")[0],
            body: a.getElementsByTagName("template")[0].innerHTML
        }
        this.style = {
            dom: a.getElementsByTagName("style")[0],
            body: a.getElementsByTagName("style")[0].innerHTML,
            css: ""
        }
        this.script = {
            dom: a.getElementsByTagName("script")[0],
            body: a.getElementsByTagName("script")[0].innerHTML
        }
    }

    /**
     * Build template, style, and scripts to buildPath
     * @param buildPath the directory to build to
     */
    public build(buildPath: string, includePath: string): Set<string> {
        let result = ""
        this.buildSet = new Set<string>()
        this.buildSet.add(this.name)
        newDir(join(buildPath, "mustache"))
        newDir(join(buildPath, "style"))
        newDir(join(buildPath, "script"))

        // build mustache to dist/mustache folder
        let mustachePath = join(buildPath, "mustache", this.name + ".mustache")
        writeFileSync(mustachePath, this.template.body)

        // build style to dist/style folder
        let stylePath = join(buildPath, "style", this.name + ".css")
        this.style.css = compileStyles(this.style)
        writeFileSync(stylePath, this.style.css)

        // build script to dist/style folder
        let scriptPath = join(buildPath, "script", this.name + ".js")
        writeFileSync(scriptPath, this.script.body)


        // build all referenced files as well
        let r = this.template.dom.getAttribute("include")
        if (r) {
            let referencedComponents = this.template.dom.getAttribute("include").split(",")
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


function newDir(dir: string) {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}

/**
* Compile styles using the correct preprocessor.
* @param {Node} style the DOM Node
*/
function compileStyles(style: ComponentElement): string {
    let styleLang = style.dom.getAttribute("lang") || "css"
    let styleResult;
    switch (styleLang) {
        case "scss":
            styleResult = sass.renderSync({
                data: style.body
            }).css.toString()
            break
        case "less":
            // TODO: implement less
            break
        default:
            styleResult = style.body
            break
    }
    return styleResult
}

export { Component }
