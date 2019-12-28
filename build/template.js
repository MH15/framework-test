"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Template uses the DOM module to search and replace items in the DOM.
 *
 */
const DOM = require("./dom/node");
const traversal_1 = require("./dom/traversal");
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
function templateRender(dom, buildSet) {
    traversal_1.mutation(dom, (n) => {
        if (n.kind === DOM.NodeType.Element) {
            let tag = n.tagName.toLowerCase();
            console.log("tag:", tag);
            if (buildSet.has(tag)) {
                return true;
            }
        }
        return false;
    }, modify);
}
exports.templateRender = templateRender;
function modify(n) {
    console.log("modding", n.tagName);
}
//# sourceMappingURL=template.js.map