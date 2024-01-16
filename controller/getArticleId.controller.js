const fetchArticleData = require("../model/fetchAtricle.model")

const getArticleByID = (req, res) => {
    const { article_id } = req.params
   

    
    fetchArticleData(article_id).then((data) => {

        res.status(200).send(data)
    }).catch((err) => {
        res.status(404).send({msg:err.passThisMsg})
    })
}

module.exports = getArticleByID