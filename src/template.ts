/**
 * Template uses the DOM module to search and replace items in the DOM.
 * 
 */
import * as DOM from "./dom/node"
import { mutation } from "./dom/traversal"
import { Component } from "./component"

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
    private cache: Set<Component>


}

export function templateRender(dom: DOM.Node, buildSet: Set<string>) {
    mutation(dom, (n) => {
        if (n.kind === DOM.NodeType.Element) {
            let tag = n.tagName.toLowerCase()
            console.log("tag:", tag)
            if (buildSet.has(tag)) {
                return true
            }
        }
        return false
    }, modify)
}


function modify(n: DOM.Node) {
    console.log("modding", n.tagName)


    let referencedComponent = null // find the component to add
    // referencedComponent.assemble() // perform assembly on referenced component

    // insert referenced component in tree
}