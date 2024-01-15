const fetchTopics = require("../model/fetchTopics.model")


const getTopicsData = (req, res) => {
    fetchTopics().then((data) => {
        res.status(200).send(data)
    })
}

module.exports = getTopicsData