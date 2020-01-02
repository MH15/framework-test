
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs"
import { parseHTML } from './dom/current-parser'

import { join, parse } from "path"
import { newDir } from "./utils/file"
const sass = require('sass')

import { getElementsByTagName } from "./dom/finders"


import * as DOM from "./dom/node"
import { TemplateParser } from './template'
import { mutation, multiMutation } from "./dom/traversal"


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

    // Source representations
    public template: DOM.Node
    public style: DOM.Node
    public script: DOM.Node
    public buildSet: Set<string>

    // Rendered representations
    public styleString: string
    public scriptString: string

    // Component data
    data: object



    /**
     * Create a new component instance from filepath.
     * @param filepath path to a valid .component file
     */
    constructor(filepath: string) {
        this.load(filepath)
    }

    public load(filepath: string): void {
        let file = readFileSync(filepath, "utf8")
        this.name = parse(filepath).name
        let dom = parseHTML(file)

        this.template = getElementsByTagName(dom, "template")[0]
        this.style = getElementsByTagName(dom, "style")[0]
        this.script = getElementsByTagName(dom, "script")[0]

        this.styleString = this.style.innerHTML
        this.scriptString = this.script.innerHTML

    }

    // Use the template methods to do this shit
    public assemble(data: object, dirSearch: string) {
        this.data = data

        let buildSet = new Set<string>()
        buildSet.add(this.name)
        let built = new Set<Component>()
        if (this.template.hasAttribute("include")) {
            let includes = this.template.getAttribute("include")
            let referencedComponents = includes.split(",").map(item => {
                // TODO: this doesn't seem to work
                return item.trim().toLowerCase()
            })
            referencedComponents.forEach(name => {
                let refPath = join(dirSearch, name + ".component")
                let c = new Component(refPath)
                c.assemble(data, dirSearch)
                built.add(c)

                buildSet.add(name)
                // this.cache.add
            })
        }

        mutation(this.template, (n) => {
            if (n.kind === DOM.NodeType.Element) {
                let tag = n.tagName.toLowerCase()
                // console.log("tag:", tag)
                if (buildSet.has(tag)) {
                    return true
                }

            }
            return false
        }, (n) => { // IF
            // TODO: slots!
            let componentToInsert = findComponent(built, n.tagName)

            // Compile styles and scripts
            let style = componentToInsert.styleString
            let script = componentToInsert.scriptString
            this.styleString += componentToInsert.styleString
            this.scriptString += componentToInsert.scriptString


            // Slots
            /**
             * Algorithm:
             * - Gather all slots in included template
             */

            let slots = componentToInsert.template.getElementsByTagName("slot")

            if (slots.length === 1) { // normal mode
                console.log("normal mode")
                // clear the slot's "fallback content"
                if (n.children.length > 0) {
                    slots[0].children = []
                }
                // copy all of n into the slot
                for (let child of n.children) {
                    slots[0].appendChild(child)
                }
                // clear all children of n
                n.children = []
                // copy all of componentToInsert into n.children
                for (let child of componentToInsert.template.children) {
                    n.appendChild(child)
                }
            } else if (slots.length > 1) { // named mode
                console.log("named mode")

            } else { // empty mode
                console.log("empty mode")
                // Quitely discard any child elements, then add the template
                n.children = []
                for (let child of componentToInsert.template.children) {
                    n.appendChild(child)
                }
            }

            // for (let child of componentToInsert.template.children) {
            //     n.appendChild(child)
            // }


        }, (n) => { // ELSE
            if (n.isElement) {
                // TODO: handle templating on elements
            }
            if (n.isText) {
                // template.load(n.data, data)
                let t = new TemplateParser(n.data)
                t.load(n.data, this.data)
                n.data = t.advance()

            }
            if (n.isComment) {
                // TODO: do we need templating on comments?
            }
            // console.log("here we template!", n.tagName, ":", n.data, ":")
        })

        return buildSet
    }


    /**
     * Build template, style, and scripts to buildPath
     * @param buildPath the directory to build to
     */
    public build(buildPath: string, includePath: string): Set<string> {
        let result = ""
        this.buildSet = new Set<string>()
        this.buildSet.add(this.name)
        // newDir(join(buildPath, "njk"))
        newDir(join(buildPath, "style"))
        newDir(join(buildPath, "script"))


        // build style to dist/style folder
        let stylePath = join(buildPath, "style", this.name + ".css")
        let css = compileStyles(this.style)
        writeFileSync(stylePath, this.style.innerHTML)

        // build script to dist/script folder
        let scriptPath = join(buildPath, "script", this.name + ".js")
        writeFileSync(scriptPath, this.script.innerHTML)


        // build all referenced files as well
        let r = this.template.getAttribute("include")
        console.log(`included in ${this.name}:`, r)
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


function findComponent(built: Set<Component>, name: string): Component | null {
    let result = null
    for (let c of built) {
        if (c.name.toLowerCase() == name.toLowerCase()) {
            result = c
            break
        }
    }
    return result
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
