import * as DOM from "./dom"
import * as assert from "assert"
import { Parser } from "../parser"

export class HTMLParser extends Parser {

    // Parse a sequence of sibling nodes.
    parseNodes(): DOM.Node[] {
        let nodes = []
        while (true) {
            this.consumeWhitespace()
            if (!this.hasNext() || this.startsWith("</")) {
                break
            }
            nodes.push(this.parseNode())
        }
        return nodes
    }

    // Parse a tag or attribute name.
    parseTagName(): string {
        return this.consumeWhile(isAlphaNumeric)
    }

    // Parse a single node.
    parseNode(): DOM.Node {
        let el: DOM.Node
        if (this.startsWith("<!--")) {
            el = this.parseComment()
        } else if (this.peek() === "<") {
            let el = this.parseElement()
            return el
        } else {
            let text = this.parseText()
            return text
        }
        return el
    }

    // Parse a comment node.
    parseComment(): DOM.Node {
        // Opening tag
        assert.equal(this.consume(), "<")
        assert.equal(this.consume(), "!")
        assert.equal(this.consume(), "-")
        assert.equal(this.consume(), "-")

        // parse until end tag reached
        let commentText = ""
        while (!this.startsWith("-->")) {
            commentText += this.consume()
        }

        // Closing tag
        assert.equal(this.consume(), "-")
        assert.equal(this.consume(), "-")
        assert.equal(this.consume(), ">")

        return DOM.comment(commentText)
    }

    // Parse a text node.
    parseText(): DOM.Node {
        let innerHTML = this.consumeWhile((char) => {
            return char != "<"
        })
        return DOM.text(innerHTML)
    }
    parseElement(): DOM.Node {
        // Opening tag
        assert.equal(this.consume(), "<")
        let tagName = this.parseTagName()
        let attributes = this.parseAttributes()
        assert.equal(this.consume(), ">")

        // Contents
        let children = this.parseNodes()

        // Closing tag
        assert.equal(this.consume(), "<")
        assert.equal(this.consume(), "/")
        assert.equal(this.parseTagName(), tagName)
        assert.equal(this.consume(), ">")

        return DOM.elem(tagName, attributes, children)
    }

    // Parse a single name="value" pair.
    parseAttribute(): { key: string, value: string } {
        let key = this.parseTagName()
        assert.equal(this.consume(), "=")
        let value = this.parseAttributeValue()
        return { key, value }
    }

    // Parse a quoted value.
    parseAttributeValue(): string {
        let open_quote = this.consume()
        assert(open_quote == '"' || open_quote == '\'')
        let value = this.consumeWhile((char) => {
            return char != open_quote
        })
        assert.equal(this.consume(), open_quote)
        return value
    }

    // Parse a list of name="value" pairs, separated by whitespace.
    parseAttributes(): Map<string, string> {
        let attributes = new Map()
        while (true) {
            this.consumeWhitespace()
            if (this.peek() == ">") {
                break
            }
            let pair = this.parseAttribute()
            attributes.set(pair.key, pair.value)
        }
        return attributes
    }

}




function isAlphaNumeric(str) {
    var code, i, len

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i)
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false
        }
    }
    return true
};


