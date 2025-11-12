import * as commentsService from "./commentsService.js"
import createHttpError from "http-errors"

export const getComment = async (req, res, next) => {
    try {
        const { id: commentId } = req.params
        const comment = await commentsService.getComment(commentId)
        if (!comment) {
            throw new createHttpError.NotFound()
        }

        return res.status(200).json(comment)
    } catch (error) {
        next(error)
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const { id: commentId } = req.params
        const comment = await commentsService.getComment(commentId)
        if (!comment) {
            throw new createHttpError.NotFound()
        }

        const deletedComment = await commentsService.deleteComment(commentId)

        return res.status(200).json(deletedComment)
    } catch (error) {
        next(error)
    }
}

export const editComment = async (req, res, next) => {
    try {
        const { id: commentId } = req.params
        const { username, body } = req.body

        const comment = await commentsService.getComment(commentId)
        if (!comment) {
            throw new createHttpError.NotFound()
        }

        const updatedComment = await commentsService.updateComment({
            commentId,
            username,
            body,
        })

        return res.status(200).json(updatedComment)
    } catch (error) {
        next(error)
    }
}
