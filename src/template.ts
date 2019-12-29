/**
 * Template uses the DOM module to search and replace items in the DOM.
 * 
 */
import * as DOM from "./dom/node"
import { mutation } from "./dom/traversal"
import { Component } from "./component"
import { join, sep } from "path"
import { Parser } from "./utils/parser"
import * as assert from "assert"

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

export function templateRender(c: Component, buildSet: Set<string>, dirSearch: string) {
    let dom = c.template
    mutation(dom, (n) => {
        if (n.kind === DOM.NodeType.Element) {
            let tag = n.tagName.toLowerCase()
            console.log("tag:", tag)
            if (buildSet.has(tag)) {
                return true
            }
        }
        return false
    }, (n) => {
        modify(n, c, dirSearch)
    })
}


export function modify(n: DOM.Node, c: Component, dirSearch: string) {
    console.log("modding", n.tagName)
    let component = new Component(join(dirSearch, `${n.tagName}.component`))
    console.log(component)


    let referencedComponent = null // find the component to add
    // referencedComponent.assemble() // perform assembly on referenced component

    // insert referenced component in tree
}

// export function condition()



export class TemplateParser extends Parser {
    sepLeft = "{{"
    sepRight = "}}"
    openBraces = 0
    newString = ""

    constructor(content: string, separators?: Array<string>) {
        super(content)
        if (separators) {
            this.sepLeft = separators[0]
            this.sepRight = separators[1]
        }
    }

    advance(): string {
        while (this.hasNext()) {
            this.newString += this.consumeWhitespace()
            if (this.startsWith("{{")) {
                this.parseReplacement()
            } else {
                this.newString += this.consume()
            }
        }
        return this.newString
    }

    parseReplacement() {
        console.log("parse replacement", 0)
        assert.equal(this.consume(), "{")
        assert.equal(this.consume(), "{")

        // whitespace inside tags is not retained
        this.consumeWhitespace()
        console.log("parse replacement", 1)

        // get data, filter maybe?
        let key = this.parseKey()
        // TODO: find data
        this.newString += key

        console.log("parse replacement", 2)
        this.consumeWhitespace()
        assert.equal(this.consume(), "}")
        assert.equal(this.consume(), "}")


    }

    parseKey(): string {
        /* Additional (optional) characters can be: a 
        letter, a digit, underscore, colon, period, 
        dash, or a “CombiningChar” or “Extender” character, 
        which I believe allows Unicode attributes names. */
        let regex = new RegExp(/[a-zA-Z0-9\-:_@]/)
        return this.consumeWhile((char) => {
            return char.match(regex)
        })
    }


}