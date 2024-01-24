const db = require('../db/connection')


exports.fetchUsers = () => {

    return db.query(`
    SELECT * FROM USERS;
    `).then(({ rows }) => {
        // console.log(rows);
        return rows
    })
}