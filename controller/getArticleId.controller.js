
const {
  fetchArticleData,
  fetchArticle,
  fetchComment,
  insertComment,
  changeArticleVotes,
  fetchArticlesByTopic
} = require("../model/fetchAtricle.model");
















const getArticleByID = (req, res, next) => {
  // this needs to be changed to a query and not starting with /
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    fetchArticlesByTopic(article_id)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
  } else {
    fetchArticleData(article_id)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
  }
};
























const getArticle = (req, res, next) => {

  fetchArticle()
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const getCommentByArtcId = (req, res, next) => {
  const { articles_id } = req.params;
  fetchComment(articles_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const postComment = (req, res, next) => {
  const { articles_id } = req.params;
  console.log(articles_id, `article id`);
  const newComment = req.body;
  console.log(newComment);
  insertComment(newComment, articles_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const voteDetail = req.body;
  changeArticleVotes(article_id, voteDetail)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const getArticleByTopic = (req,res,next) => {
  const topic = req.params.topic


}

module.exports = {
  getArticleByID,
  getArticle,
  getCommentByArtcId,
  postComment,
  updateArticle,
  getArticleByTopic
};
