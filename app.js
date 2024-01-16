const express = require('express')
const app = express();
const getHealthCheck = require('./controller/healthCheck.controller')
const getTopicsData = require('./controller/getTopics.controller');
const getApi = require('./controller/getapi.controller');
const getArticleByID = require('./controller/getArticleId.controller');

app.use(express.json())

app.get('/api/healthcheck', getHealthCheck)
app.get('/api/topics', getTopicsData)
app.get('/api', getApi)
app.get('/api/articles/:article_id', getArticleByID)

module.exports = app