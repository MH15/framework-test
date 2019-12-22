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



export { mutation }