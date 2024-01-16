const express = require('express')
const app = express();
const getHealthCheck = require('./controller/healthCheck.controller')
const getTopicsData = require('./controller/getTopics.controller');
const getApi = require('./controller/getapi.controller');

app.use(express.json())

app.get('/api/healthcheck', getHealthCheck)
app.get('/api/topics', getTopicsData)
app.get('/api', getApi )

module.exports = app