
import { readFileSync, writeFileSync } from "fs"
import { parseHTML } from './utils/parser';


export class Component {
    private file: string
    public template: any
    public styles: HTMLElement[]
    public script: HTMLElement
    constructor(filepath: string) {
        this.file = readFileSync(filepath, "utf8")
        let a = parseHTML(this.file)
        this.template = a.querySelector("template")
        this.styles = a.querySelectorAll("style")
        this.script = a.querySelector("script")
    }

    public build(): string {
        // do the ejs shit we did before
        return "Sss"
    }
}