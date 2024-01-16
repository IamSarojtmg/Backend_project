const db = require('../db/connection')

const fetchArticleData = (id) => {
    return db.query(`SELECT author,title,article_id,body,topic,created_at,votes,article_img_url FROM articles WHERE article_id = $1`, [id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({passThisMsg: 'Article does not exist'})
        }
        return rows[0]
    })
}


module.exports = fetchArticleData