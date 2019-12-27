import * as DOM from "./dom"
import { mutation, getElement, getElementById } from "./traversal"



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

    // sample usage of a mutation
    // mutation(root, (n) => {
    //     return n.kind === DOM.NodeType.Element
    // }, (n) => {
    //     if (n.kind == DOM.NodeType.Element) {
    //         n.tagName = "trick"
    //     }
    // })

    /**
     * Algorithm:
     * - perform a mutation on the root node:
     *    - check if node is one of the included nodes
     *    - if so, link other shit in
     */

    console.log(DOM.prettyPrinter(root))

    // sample usage of getElement
    // let el = getElement(root, (el) => {
    //     if (el.kind === DOM.NodeType.Element) {
    //         if (el.tagName == "FancyHeader") {
    //             return true
    //         }
    //     }
    //     return false
    // })


    let elByID = getElementById(root, "a")
    console.log(elByID)



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