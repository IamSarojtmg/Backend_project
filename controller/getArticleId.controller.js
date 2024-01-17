const {fetchArticleData, fetchArticle} = require("../model/fetchAtricle.model");

const getArticleByID = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleData(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const getArticle = (req, res, next) => {
  fetchArticle().then((article) => {
    res.status(200).send({article})
  }).catch(next)
};

module.exports = { getArticleByID, getArticle };
