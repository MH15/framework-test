"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Template uses the DOM module to search and replace items in the DOM.
 *
 */
const DOM = require("./dom/node");
const traversal_1 = require("./dom/traversal");
const component_1 = require("./component");
const path_1 = require("path");
/**
pseudocode:

function combine(node) {
    gather included files
        find all included components
    mutate the node and its children
        whenever an included template appears in the root DOM,
            parse said template
                (this includes recursion)
            copy it into place in the root DOM

    1. do the DOM combine using mutation methdods
    2. do the style and script combine using string methods

}

*/
class Template {
}
function templateRender(c, buildSet, dirSearch) {
    let dom = c.template;
    traversal_1.mutation(dom, (n) => {
        if (n.kind === DOM.NodeType.Element) {
            let tag = n.tagName.toLowerCase();
            console.log("tag:", tag);
            if (buildSet.has(tag)) {
                return true;
            }
        }
        return false;
    }, (n) => {
        modify(n, c, dirSearch);
    });
}
exports.templateRender = templateRender;
function modify(n, c, dirSearch) {
    console.log("modding", n.tagName);
    let component = new component_1.Component(path_1.join(dirSearch, `${n.tagName}.component`));
    console.log(component);
    let referencedComponent = null; // find the component to add
    // referencedComponent.assemble() // perform assembly on referenced component
    // insert referenced component in tree
}
exports.modify = modify;
// export function condition()
//# sourceMappingURL=template.js.map