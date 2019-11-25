
const path = require("path")
module.exports = {
    index
}



const { renderComponent } = require("../build/app")

function index(req, res) {
    fra.render(res, "home")
}