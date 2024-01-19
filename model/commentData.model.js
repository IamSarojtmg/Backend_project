const db = require("../db/connection");

const fetchCommentByID = (id) => {
    if (id > 18) {
        return Promise.reject({passThisMsg: "Comment does not exist"})
    }
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [id])
}

module.exports = fetchCommentByID