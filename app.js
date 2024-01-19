const express = require("express");
const app = express();
const getHealthCheck = require("./controller/healthCheck.controller");
const getTopicsData = require("./controller/getTopics.controller");
const getApi = require("./controller/getapi.controller");
const {
  getArticleByID,
  getArticle,
  getCommentByArtcId,
  postComment,
  updateArticle,
} = require("./controller/getArticleId.controller");

app.use(express.json());

app.get("/api/healthcheck", getHealthCheck);
app.get("/api/topics", getTopicsData);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles", getArticle);
app.get("/api/articles/:articles_id/comments", getCommentByArtcId);

app.post("/api/articles/:articles_id/comments", postComment);

app.patch("/api/articles/:article_id", updateArticle);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    if (err.code === "23503") {
      res.status(404).send({ msg: "Not found" });
    }

    res.status(404).send({ msg: err.passThisMsg });
  }
});

module.exports = app;
