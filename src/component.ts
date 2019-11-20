
import { readFileSync, writeFileSync } from "fs"
import { parseHTML } from './utils/parser';

import { join, parse } from "path";
import { Stack } from "./utils/structures";



interface ComponentElement {
    dom: HTMLElement,
    body: string,
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

    constructor(filepath: string) {
        this.file = readFileSync(filepath, "utf8")
        this.name = parse(filepath).name
        let a = parseHTML(this.file)
        this.template = {
            dom: a.getElementsByTagName("template")[0],
            body: a.getElementsByTagName("template")[0].innerHTML
        }
        this.style = {
            dom: a.getElementsByTagName("style")[0],
            body: a.getElementsByTagName("style")[0].innerHTML
        }
        this.script = {
            dom: a.getElementsByTagName("script")[0],
            body: a.getElementsByTagName("script")[0].innerHTML
        }
    }

    /**
     * Build template, style, and scripts to directory
     * @param buildPath the directory to build to
     */
    public build(buildPath: string, includePath: string): Set<string> {
        let result = ""
        let buildItems = new Set<string>()
        buildItems.add(this.name)

        // build mustache to dist/mustache folder
        let mustachePath = join(buildPath, "mustache", this.name + ".mustache")
        writeFileSync(mustachePath, this.template.body)

        // build style to dist/style folder
        let stylePath = join(buildPath, "style", this.name + ".css")
        writeFileSync(stylePath, this.style.body)

        // build script to dist/style folder
        let scriptPath = join(buildPath, "script", this.name + ".js")
        writeFileSync(scriptPath, this.script.body)


        // build all referenced files as well
        let r = this.template.dom.getAttribute("include")
        if (r) {
            let referencedComponents = this.template.dom.getAttribute("include").split(",")
            console.log(referencedComponents)
            referencedComponents.forEach(name => {
                console.log(`Building component "${name}".`)
                let refPath = join(includePath, name + ".component")
                let c = new Component(refPath)
                let smallSet = c.build(buildPath, includePath)
                smallSet.forEach((s) => {
                    buildItems.add(s)
                })
            })
        }





        // do the ejs shit we did before
        return buildItems
    }
}


export { Component }
