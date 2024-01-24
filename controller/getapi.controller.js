const endpoints = require('../endpoints.json')
const fs = require('fs/promises')

const getApi = (req, res) => {

    fs.readFile(`endpoints.json`, 'utf-8').then((result) => {
        const endpoint = JSON.parse(result)
       res.status(200).send({endpoint})
    })
}

module.exports = getApi