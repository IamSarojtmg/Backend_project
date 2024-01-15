const db = require('../db/connection')

const fetchTopics = () => {
    // console.log('model');
    return db.query(`SELECT slug, description FROM topics`).then(({ rows }) => {
        return rows
    })
}

module.exports = fetchTopics