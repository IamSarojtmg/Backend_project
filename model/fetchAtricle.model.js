const db = require("../db/connection");

const fetchArticleData = (id) => {

  console.log('fetchByData');
  return db
    .query(
      `SELECT author,title,article_id,body,topic,created_at,votes,article_img_url FROM articles WHERE article_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ passThisMsg: "Article does not exist" });
      }
      return rows[0];
    });
};

const fetchArticle = () => {
  console.log('in model');
  return db
    .query(
      `SELECT articles.article_img_url, articles.votes,articles.created_at, articles.topic, articles.title, articles.author, comments.article_id, COUNT(comments.article_id) AS comment_count FROM articles 
    JOIN comments ON articles.article_id = comments.article_id
    GROUP BY comments.article_id, articles.author, articles.title,articles.topic,articles.created_at, articles.votes, articles.article_img_url
    ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      rows.forEach(elems => {
      })
      return rows;
    });
};

const fetchComment = (id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id 
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ passThisMsg: "No article found" });
      }
      return rows;
    });
};

const insertComment = ({ username, body }, article_id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

const changeArticleVotes = (id, { inc_votes }) => {
  return db
    .query(
      `UPDATE articles 
  SET votes = votes + $2
  WHERE article_id = $1
  RETURNING *`,
      [id, inc_votes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ passThisMsg: "No article found" });
      }
      return rows[0];
    });
};

const fetchArticlesByTopic = (id) => {
  console.log('by topic');
  return db.query(`SELECT * FROM articles WHERE topic = $1`, [id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({passThisMsg: 'Not found'})
    }
    return rows
  })
}

module.exports = {
  fetchArticleData,
  fetchArticle,
  fetchComment,
  insertComment,
  changeArticleVotes,
  fetchArticlesByTopic
};
