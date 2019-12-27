/**
 * Methods to traverse the virtual DOM.
 */
import * as DOM from "./dom"


type Condition = (n: DOM.Node) => boolean
type Mutation = (n: DOM.Node) => any
/**
 * Mutate all nodes in a DOM.Node tree that meet a condition.
 * @param node: the DOM.Node object to begin the mutation on
 * @param condition: if condition returns true, mutate the current DOM.Node object
 * @param mutate: the function that is called on the DOM.Node object
 */
function mutation(node: DOM.Node, condition: Condition, mutate: Mutation): void {
    if (condition(node) === true) {
        mutate(node)
    }
    if (node.kind === DOM.NodeType.Element) {
        node.children.forEach(child => {
            mutation(child, condition, mutate)
        })
    }
}

/**
 * Find an Element in the tree.
 * @param node: the DOM.Node object to begin the search on
 * @param condition: if condition returns true on the current Node, return the
 * current Node
 * @returns the DOM.Node that meets Condition if a Node is found that meets the
 * condition, else returns null
 */
function getElement(node: DOM.Node, condition: Condition): DOM.Node {
    let foundNode = null

    console.log("n", node)
    if (node.kind === DOM.NodeType.Element) {
        if (condition(node) === true) {
            console.log("NODE ELEMENT CONDITION PASS")
            foundNode = node
            // return
        } else {
            console.log("NODE ELEMENT CONDITION FAIL")
            node.children.forEach(child => {
                foundNode = getElement(child, condition)
                // if (foundNode != null) {
                return foundNode
                // }
            })
        }
    }
    return foundNode
}


export { mutation, getElement }