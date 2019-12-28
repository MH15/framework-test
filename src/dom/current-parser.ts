import * as DOM from "./node"
import { getElementById, getElementsByTagName } from "./finders"


import { HTMLParser } from "./html-parser"

export function parseHTML(content: string): any {
    let parser = new HTMLParser(content)

    let nodes = parser.parseNodes(null)
    let root: DOM.Node
    // If the document contains a root element, just return it. Otherwise, create one.
    if (nodes.length == 1) {
        root = nodes[0]
    } else {
        root = DOM.elem("html", new Map(), nodes)
    }

    return root
}

export function parsing(content: string): DOM.Node {

    var hrstart = process.hrtime()
    let nodes
    for (let i = 0; i < 1; i++) {
        let parser = new HTMLParser(content)
        try {
            nodes = parser.parseNodes(null)
        } catch (error) {
            console.log(parser.error())
            console.log(error.stack)
            process.exit()
        }
    }
    let root: DOM.Node
    // If the document contains a root element, just return it. Otherwise, create one.
    if (nodes.length == 1) {
        root = nodes[0]
    } else {
        root = DOM.elem("html", new Map(), nodes)
    }

    // TODO: parent link

    /**
     * Algorithm:
     * - perform a mutation on the root node:
     *    - check if node is one of the included nodes
     *    - if so, link other shit in
     */

    console.log(root.print())

    // console.time("findElements")
    let elsByID
    for (let i = 0; i < 1; i++) {

        elsByID = getElementsByTagName(root, "plus-icon")
    }

    // console.timeEnd("findElements")

    // console.log("all:", elsByID)
    return root
}

