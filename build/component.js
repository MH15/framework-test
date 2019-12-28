"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const current_parser_1 = require("./dom/current-parser");
const path_1 = require("path");
const file_1 = require("./utils/file");
const sass = require('node-sass');
const finders_1 = require("./dom/finders");
const nunjucks = require("nunjucks");
const template_1 = require("./template");
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
        this.file = fs_1.readFileSync(filepath, "utf8");
        this.name = path_1.parse(filepath).name;
        let dom = current_parser_1.parseHTML(this.file);
        this.template = finders_1.getElementsByTagName(dom, "template")[0];
        this.style = finders_1.getElementsByTagName(dom, "style")[0];
        this.script = finders_1.getElementsByTagName(dom, "script")[0];
    }
    // Use the template methods to do this shit
    assemble() {
        console.log("assemble");
        if (this.template.hasAttribute("include")) {
            let includes = this.template.getAttribute("include");
            console.log("included:", includes);
            let referencedComponents = includes.split(",").map((item) => {
                return item.trim().toLowerCase();
            });
            let buildSet = new Set(referencedComponents);
            template_1.templateRender(this.template, buildSet);
        }
    }
    /**
     * Build template, style, and scripts to buildPath
     * @param buildPath the directory to build to
     */
    build(buildPath, includePath) {
        let result = "";
        this.buildSet = new Set();
        this.buildSet.add(this.name);
        // newDir(join(buildPath, "ejs"))
        // newDir(join(buildPath, "njk"))
        file_1.newDir(path_1.join(buildPath, "style"));
        file_1.newDir(path_1.join(buildPath, "script"));
        // build mustache to dist/ejs folder
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