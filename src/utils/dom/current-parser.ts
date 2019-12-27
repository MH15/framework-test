import * as DOM from "./dom"
import { mutation, getElement, } from "./traversal"

import { getElementById, getElementsByTagName } from "./finders"

export function parsing(content: string): any {

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
    let hrend = process.hrtime(hrstart)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

    let root: DOM.Node

    // If the document contains a root element, just return it. Otherwise, create one.
    if (nodes.length == 1) {
        root = nodes[0]
    } else {
        root = DOM.elem("html", new Map(), nodes)
    }

    // console.log(root)
    // console.log(root.children[0])
    // TODO: parent link
    // console.log(root === root.children[0].parent)


    // console.log(DOM.prettyPrinter(root))



    /**
     * Algorithm:
     * - perform a mutation on the root node:
     *    - check if node is one of the included nodes
     *    - if so, link other shit in
     */

    console.log(DOM.prettyPrinter(root))

    console.time("findElements")
    let elsByID
    for (let i = 0; i < 1; i++) {

        elsByID = getElementsByTagName(root, "plus-icon")
    }

    console.timeEnd("findElements")

    console.log("all:", elsByID)


}













const DomParser = require('dom-parser')
const parser = new DomParser()
import { HTMLParser } from "./html-parser"
import { stringify } from "querystring"
import { symlinkSync } from "fs"

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