/**
 * Live server
 */
module.exports = {
    start,
    restart
}
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
// you can pass the parameter in the command line. e.g. node static_server.js 3000
const port = 8081;

// maps file extention to MIME types
const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
};

console.log("DO ITasjklcbaslkjcbnjkasdndcjlkasdncj")

const ejs = require("ejs")
const utils = require("../utils")
let server;
let wss;

function restart(type, name) {
    // console.log("Closing server.")
    // server.close()
    console.log("Restarting server.")
    wss.send('reload')
    // start(type, name)
}

function start(type, name) {
    server = http.createServer(function (req, res) {
        // console.log(`${req.method} ${req.url}`);

        // parse URL
        const parsedUrl = url.parse(req.url);
        // extract URL path
        // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
        // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
        // by limiting the path to current directory only
        const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
        // let pathname = path.join(__dirname, "../..", "_build", type, name, sanitizePath);
        let pathname = path.join(__dirname, "../..", "_build", sanitizePath);

        fs.exists(pathname, function (exist) {
            if (!exist) {
                // if the file is not found, return 404
                // res.writeHead(301, { "Location": "http://" + req.headers['host'] + '/page-b.html' });
                // return res.end();

                res.statusCode = 404;
                res.end(`File ${pathname} not found!`);
                return;
            }

            /**
             * TODO
             * build develop.ejs and send to localhost:8081/
             * serve paths for static at /components/name/style.css|script.js
             * 
             */
            // if is a directory, then look for index.html
            if (fs.statSync(pathname).isDirectory()) {
                // pathname += '/index.html';
                // pathname = path.join(__dirname, "../..", "_framework");
                pathname += '/index.html';
                let developPath = path.join(__dirname, "..", "defaults", "develop.ejs")
                console.log("BIT " + developPath)
                let developHTML = ejs.render(utils.readFile(developPath), {
                    name: name,
                    type: type,
                    source: path.join(type, name, "temp.html")
                })
                res.setHeader('Content-type', mimeType[".html"] || 'text/plain');
                res.end(developHTML);
            } else {
                // read file from file system
                fs.readFile(pathname, function (err, data) {
                    if (err) {
                        res.statusCode = 500;
                        res.end(`Error getting the file: ${err}.`);
                    } else {
                        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
                        const ext = path.parse(pathname).ext;
                        // if the file is found, set Content-type and send data
                        res.setHeader('Content-type', mimeType[ext] || 'text/plain');
                        res.end(data);
                    }
                });
            }


        });


    })

    console.log(`Server listening on port ${port}`);

    const WebSocket = require('ws')
    let socket = new WebSocket.Server({ server });

    socket.on('connection', ws => {
        wss = ws
        ws.on('message', message => {
            console.log(`Received message => ${message}`)
        })
        ws.send('ho!')
    })

    server.listen(parseInt(port));
}






// const http = require('http');



// const port = 8000

// function start() {
//     const server = http.createServer((request, response) => {
//         console.log(request.url)
//         if (routes[request.url]) {
//             routes[request.url](request, response)
//         } else {
//             console.log("nah")
//         }
//     });

//     server.listen(port, () => console.log(`Server is listening on port ${port}`));
// }



// let routes = {}


// routes["/"] = (request, response) => {
//     response.end("home")
// }

// routes["/about"] = (request, response) => {
//     console.log("about")
//     response.end("about")
// }
