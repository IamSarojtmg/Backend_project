const fetchCommentByID = require("../model/commentData.model")

const getCommentId = (req, res, next) => {
    const { comment_id } = req.parms

    fetchCommentByID(comment_id).then(() => {
        res.status(204).send()
    }).catch(next)
}

module.exports = getCommentId