module.exports = {
    find
}

function find(req, res, params) {
    res.end(`user id:${params.id}`)
}