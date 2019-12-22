const DomParser = require('dom-parser')
const parser = new DomParser()
import { HTMLParser } from "./html-parser"

// import { parse } from 'node-html-parser';

export function parseHTML(content: string): any {
    let dom = parser.parseFromString(content)
    return dom
}

import { equal } from "assert"
import * as assert from "assert"

// import { DOMNode, NodeType } from "./dom"

import * as DOM from "./dom"

const htmlparser2 = require("htmlparser2");


const { DOMParser, XMLSerializer, DOMImplementation } = require('xmldom')

function printer(c) {
    console.log(new XMLSerializer().serializeToString(c))
}

export function parsing(content: string): any {
    let root = parser.parseFromString(content)
    // console.log("root", root)


    // const root = parse(content);
    let nodes = new HTMLParser(content).parseNodes()


    // If the document contains a root element, just return it. Otherwise, create one.
    if (nodes.length == 1) {
        root = nodes[0]
    } else {
        root = DOM.elem("html", new Map(), nodes)
    }

    // console.log(nodes);
    console.log(DOM.prettyPrinter(root))

}





