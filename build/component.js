"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const current_parser_1 = require("./dom/current-parser");
const path_1 = require("path");
const file_1 = require("./utils/file");
const sass = require('sass');
const finders_1 = require("./dom/finders");
const DOM = require("./dom/node");
const template_1 = require("./template");
const traversal_1 = require("./dom/traversal");
/**
 * A Single File Component.
 */
class Component {
    /**
     * Create a new component instance from filepath.
     * @param filepath path to a valid .component file
     */
    constructor(filepath) {
        this.load(filepath);
    }
    load(filepath) {
        let file = fs_1.readFileSync(filepath, "utf8");
        this.name = path_1.parse(filepath).name;
        let dom = current_parser_1.parseHTML(file);
        this.template = finders_1.getElementsByTagName(dom, "template")[0];
        this.style = finders_1.getElementsByTagName(dom, "style")[0];
        this.script = finders_1.getElementsByTagName(dom, "script")[0];
        this.styleString = this.style.innerHTML;
        this.scriptString = this.script.innerHTML;
    }
    // Use the template methods to do this shit
    assemble(data, dirSearch) {
        this.data = data;
        let buildSet = new Set();
        buildSet.add(this.name);
        let built = new Set();
        if (this.template.hasAttribute("include")) {
            let includes = this.template.getAttribute("include");
            let referencedComponents = includes.split(",").map(item => {
                // TODO: this doesn't seem to work
                return item.trim().toLowerCase();
            });
            referencedComponents.forEach(name => {
                let refPath = path_1.join(dirSearch, name + ".component");
                let c = new Component(refPath);
                c.assemble(data, dirSearch);
                built.add(c);
                buildSet.add(name);
                // this.cache.add
            });
        }
        traversal_1.mutation(this.template, (n) => {
            if (n.kind === DOM.NodeType.Element) {
                let tag = n.tagName.toLowerCase();
                // console.log("tag:", tag)
                if (buildSet.has(tag)) {
                    return true;
                }
                if (tag == "script") {
                    console.log("SCRIPT", n);
                }
            }
            return false;
        }, (n) => {
            // TODO: slots!
            let componentToInsert = findComponent(built, n.tagName);
            // Compile styles and scripts
            let style = componentToInsert.styleString;
            let script = componentToInsert.scriptString;
            this.styleString += componentToInsert.styleString;
            this.scriptString += componentToInsert.scriptString;
            for (let child of componentToInsert.template.children) {
                n.appendChild(child);
            }
        }, (n) => {
            if (n.isElement) {
                // TODO: handle templating on elements
            }
            if (n.isText) {
                // template.load(n.data, data)
                console.log("ENTER");
                let t = new template_1.TemplateParser(n.data);
                t.load(n.data, data);
                n.data = t.advance();
            }
            if (n.isComment) {
                // TODO: do we need templating on comments?
            }
            // console.log("here we template!", n.tagName, ":", n.data, ":")
        });
        return buildSet;
    }
    /**
     * Build template, style, and scripts to buildPath
     * @param buildPath the directory to build to
     */
    build(buildPath, includePath) {
        let result = "";
        this.buildSet = new Set();
        this.buildSet.add(this.name);
        // newDir(join(buildPath, "njk"))
        file_1.newDir(path_1.join(buildPath, "style"));
        file_1.newDir(path_1.join(buildPath, "script"));
        // let mustachePath = join(buildPath, "njk", this.name + ".njk")
        // writeFileSync(mustachePath, this.template.innerHTML)
        // build style to dist/style folder
        let stylePath = path_1.join(buildPath, "style", this.name + ".css");
        let css = compileStyles(this.style);
        fs_1.writeFileSync(stylePath, this.style.innerHTML);
        // build script to dist/script folder
        let scriptPath = path_1.join(buildPath, "script", this.name + ".js");
        fs_1.writeFileSync(scriptPath, this.script.innerHTML);
        // build all referenced files as well
        let r = this.template.getAttribute("include");
        console.log(`included in ${this.name}:`, r);
        if (r) {
            let referencedComponents = this.template.getAttribute("include").split(",");
            referencedComponents.forEach(name => {
                // console.log(`Building component "${name}".`)
                let refPath = path_1.join(includePath, name + ".component");
                // console.log("includePath", includePath)
                // console.log("refPath", refPath)
                let c = new Component(refPath);
                let smallSet = c.build(buildPath, includePath);
                smallSet.forEach((s) => {
                    this.buildSet.add(s);
                });
            });
        }
        return this.buildSet;
    }
}
exports.Component = Component;
function findComponent(built, name) {
    let result = null;
    for (let c of built) {
        if (c.name.toLowerCase() == name.toLowerCase()) {
            result = c;
            break;
        }
    }
    return result;
}
/**
* Compile styles using the correct preprocessor.
* @param {Node} style the DOM Node
*/
function compileStyles(style) {
    let styleLang = style.getAttribute("lang") || "css";
    let styleResult;
    switch (styleLang) {
        case "scss":
            styleResult = sass.renderSync({
                data: style.innerHTML
            }).css.toString();
            break;
        case "less":
            // TODO: implement less
            break;
        default:
            styleResult = style.innerHTML;
            break;
    }
    return styleResult;
}
//# sourceMappingURL=component.js.map