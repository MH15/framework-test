"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Methods to traverse the virtual DOM.
 */
const DOM = require("./dom");
/**
 * Mutate all nodes in a DOM.Node tree that meet a condition.
 * @param node: the DOM.Node object to begin the mutation on
 * @param condition: if condition returns true, mutate the current DOM.Node object
 * @param mutate: the function that is called on the DOM.Node object
 */
function mutation(node, condition, mutate) {
    if (condition(node) === true) {
        mutate(node);
    }
    if (node.kind === DOM.NodeType.Element) {
        node.children.forEach(child => {
            mutation(child, condition, mutate);
        });
    }
}
exports.mutation = mutation;
/**
 * Find an Element in the tree.
 * @param node: the DOM.Node object to begin the search on
 * @param condition: if condition returns true on the current Node, return the
 * current Node
 * @returns the DOM.Node that meets Condition if a Node is found that meets the
 * condition, else returns null
 */
function getElement(node, condition) {
    let foundNode = null;
    if (node.kind === DOM.NodeType.Element) {
        if (condition(node) === true) {
            foundNode = node;
        }
        else {
            node.children.forEach(child => {
                foundNode = getElement(child, condition) || foundNode;
            });
        }
    }
    return foundNode;
}
exports.getElement = getElement;
function getElementById(node, id) {
    return getElement(node, (node) => {
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
//# sourceMappingURL=traversal.js.map