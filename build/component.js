"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const parser_1 = require("./utils/parser");
const path_1 = require("path");
/**
 * A Single File Component.
 */
class Component {
    constructor(filepath) {
        this.load(filepath);
    }
    load(filepath) {
        this.file = fs_1.readFileSync(filepath, "utf8");
        this.name = path_1.parse(filepath).name;
        let a = parser_1.parseHTML(this.file);
        this.template = {
            dom: a.getElementsByTagName("template")[0],
            body: a.getElementsByTagName("template")[0].innerHTML
        };
        this.style = {
            dom: a.getElementsByTagName("style")[0],
            body: a.getElementsByTagName("style")[0].innerHTML
        };
        this.script = {
            dom: a.getElementsByTagName("script")[0],
            body: a.getElementsByTagName("script")[0].innerHTML
        };
    }
    /**
     * Build template, style, and scripts to directory
     * @param buildPath the directory to build to
     */
    build(buildPath, includePath) {
        let result = "";
        let buildSet = new Set();
        buildSet.add(this.name);
        // build mustache to dist/mustache folder
        let mustachePath = path_1.join(buildPath, "mustache", this.name + ".mustache");
        fs_1.writeFileSync(mustachePath, this.template.body);
        // build style to dist/style folder
        let stylePath = path_1.join(buildPath, "style", this.name + ".css");
        fs_1.writeFileSync(stylePath, this.style.body);
        // build script to dist/style folder
        let scriptPath = path_1.join(buildPath, "script", this.name + ".js");
        fs_1.writeFileSync(scriptPath, this.script.body);
        // build all referenced files as well
        let r = this.template.dom.getAttribute("include");
        if (r) {
            let referencedComponents = this.template.dom.getAttribute("include").split(",");
            console.log(referencedComponents);
            referencedComponents.forEach(name => {
                console.log(`Building component "${name}".`);
                let refPath = path_1.join(includePath, name + ".component");
                console.log("includePath", includePath);
                console.log("refPath", refPath);
                let c = new Component(refPath);
                console.log("SHOULD NT HAPPED", c);
                let smallSet = c.build(buildPath, includePath);
                smallSet.forEach((s) => {
                    buildSet.add(s);
                });
            });
        }
        return buildSet;
    }
}
exports.Component = Component;
//# sourceMappingURL=component.js.map