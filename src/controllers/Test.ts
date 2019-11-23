import { IncomingMessage, ServerResponse } from "http"

module.exports = {
    index: (req, res) => {

    }
}


function index(req: IncomingMessage, res: ServerResponse) {
    res.end("BiTHC")
}