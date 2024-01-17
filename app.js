const express = require("express");
const app = express();
const getHealthCheck = require("./controller/healthCheck.controller");
const getTopicsData = require("./controller/getTopics.controller");
const getApi = require("./controller/getapi.controller");
const {getArticleByID, getArticle} = require("./controller/getArticleId.controller");

app.use(express.json());

app.get("/api/healthcheck", getHealthCheck);
app.get("/api/topics", getTopicsData);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleByID);
app.get('/api/articles',getArticle)

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    res.status(404).send({ msg: err.passThisMsg });
  }
});

module.exports = app;
