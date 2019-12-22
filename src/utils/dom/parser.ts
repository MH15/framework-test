import * as DOM from "./dom"
import { mutation } from "./traversal"



export function parsing(content: string): any {
    let nodes = new HTMLParser(content).parseNodes()
    let root: DOM.Node

    // If the document contains a root element, just return it. Otherwise, create one.
    if (nodes.length == 1) {
        root = nodes[0]
    } else {
        root = DOM.elem("html", new Map(), nodes)
    }


    console.log(DOM.prettyPrinter(root))

    // sample usage of a mutation
    mutation(root, (n) => {
        return n.nodeType === DOM.NodeType.Element
    }, (n) => {
        n.data.tagName = "trick"
    })

    /**
     * Algorithm:
     * - perform a mutation on the root node:
     *    - check if node is one of the included nodes
     *    - if so, link other shit in
     */

    console.log(DOM.prettyPrinter(root))
}













const DomParser = require('dom-parser')
const parser = new DomParser()
import { HTMLParser } from "./html-parser"

/**
 * TODO: Legacy
 */
export function parseHTML(content: string): any {
    let dom = parser.parseFromString(content)
    return dom
}





const htmlparser2 = require("htmlparser2")


const { DOMParser, XMLSerializer, DOMImplementation } = require('xmldom')

function printer(c) {
    console.log(new XMLSerializer().serializeToString(c))
}