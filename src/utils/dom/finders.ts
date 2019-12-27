import { getElement, getAllElements } from "./traversal"
import * as DOM from "./dom"

/**
 * Return all Elements with the matching tag name.
 * @param root: the root node to begin the search on
 * @param tagName: the id to match
 */
function getElementsByTagName(root: DOM.Node, tagName: string): DOM.Node[] {
    return getAllElements(root, (node) => {
        if (node.kind == DOM.NodeType.Element) {
            if (node.tagName == tagName) {
                return true
            }
        }
        return false
    }, 0)
}

/**
 * Return all Elements with the matching class.
 * @param root: the root node to begin the search on
 * @param tagName: the id to match
 */
function getElementsByClassName(root: DOM.Node, tagName: string): DOM.Node[] {
    // TODO: implementation
    return null
}

/**
 * Return the first Element with the matching id.
 * @param root: the root node to begin the search on
 * @param id: the id to match
 */
function getElementById(root: DOM.Node, id: string): DOM.Node {
    return getElement(root, (node) => {
        if (node.kind == DOM.NodeType.Element) {
            if (node.attributes.has("id")) {
                if (node.attributes.get("id") === id) {
                    return true
                }
            }
        }
        return false
    })
}


export { getElementById, getElementsByTagName }