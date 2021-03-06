"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traversal_1 = require("./traversal");
const DOM = require("./dom");
/**
 * Return all Elements with the matching tag name.
 * @param root: the root node to begin the search on
 * @param tagName: the id to match
 */
function getElementsByTagName(root, tagName) {
    return traversal_1.getAllElements(root, (node) => {
        if (node.kind == DOM.NodeType.Element) {
            if (node.tagName == tagName) {
                return true;
            }
        }
        return false;
    }, 0);
}
exports.getElementsByTagName = getElementsByTagName;
/**
 * Return all Elements with the matching class.
 * @param root: the root node to begin the search on
 * @param tagName: the id to match
 */
function getElementsByClassName(root, tagName) {
    // TODO: implementation
    return null;
}
/**
 * Return the first Element with the matching id.
 * @param root: the root node to begin the search on
 * @param id: the id to match
 */
function getElementById(root, id) {
    return traversal_1.getElement(root, (node) => {
        if (node.kind == DOM.NodeType.Element) {
            if (node.attributes.has("id")) {
                if (node.attributes.get("id") === id) {
                    return true;
                }
            }
        }
        return false;
    });
}
exports.getElementById = getElementById;
//# sourceMappingURL=finders.js.map