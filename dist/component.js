"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const parser_1 = require("./utils/parser");
const path_1 = require("path");
const file_1 = require("./utils/file");
const sass = require('node-sass');
const nunjucks = require("nunjucks");
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
        let a = parser_1.parseHTML(this.file);
        this.template = {
            dom: a.getElementsByTagName("template")[0],
            body: a.getElementsByTagName("template")[0].innerHTML
        };
        this.style = {
            dom: a.getElementsByTagName("style")[0],
            body: a.getElementsByTagName("style")[0].innerHTML,
            css: ""
        };
        this.script = {
            dom: a.getElementsByTagName("script")[0],
            body: a.getElementsByTagName("script")[0].innerHTML
        };
    }
    /**
     * Build template, style, and scripts to buildPath
     * @param buildPath the directory to build to
     */
    build(buildPath, includePath) {
        let result = "";
        this.buildSet = new Set();
        this.buildSet.add(this.name);
        file_1.newDir(path_1.join(buildPath, "ejs"));
        file_1.newDir(path_1.join(buildPath, "njk"));
        file_1.newDir(path_1.join(buildPath, "style"));
        file_1.newDir(path_1.join(buildPath, "script"));
        // build mustache to dist/ejs folder
        let mustachePath = path_1.join(buildPath, "njk", this.name + ".njk");
        fs_1.writeFileSync(mustachePath, this.template.body);
        // build style to dist/style folder
        let stylePath = path_1.join(buildPath, "style", this.name + ".css");
        this.style.css = compileStyles(this.style);
        fs_1.writeFileSync(stylePath, this.style.css);
        // build script to dist/style folder
        let scriptPath = path_1.join(buildPath, "script", this.name + ".js");
        fs_1.writeFileSync(scriptPath, this.script.body);
        // build all referenced files as well
        let r = this.template.dom.getAttribute("include");
        if (r) {
            let referencedComponents = this.template.dom.getAttribute("include").split(",");
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
    let styleLang = style.dom.getAttribute("lang") || "css";
    let styleResult;
    switch (styleLang) {
        case "scss":
            styleResult = sass.renderSync({
                data: style.body
            }).css.toString();
            break;
        case "less":
            // TODO: implement less
            break;
        default:
            styleResult = style.body;
            break;
    }
    return styleResult;
}
//# sourceMappingURL=component.js.map