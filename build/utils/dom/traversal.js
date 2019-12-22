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
//# sourceMappingURL=traversal.js.map