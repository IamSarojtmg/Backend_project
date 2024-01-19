const db = require("../db/connection");

const fetchCommentByID = (id) => {
    console.log('in here');
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [id]).then((result) => {
        console.log(result);
    })
}

module.exports = fetchCommentByID